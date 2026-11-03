import { useEffect, useId, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import {
  Bookmark,
  CalendarDays,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  MapPin,
  MessageSquareText,
  Phone,
  ExternalLink,
  Navigation,
  Search,
} from "lucide-react";
import MainSidebar from "../../components/MainSidebar/MainSidebar";
import MobileHeader from "../../components/mobileBanner/MobileHeader";
import MobileFooter from "../../components/mobileBanner/MobileFooter";
import AddPlaceModal, {
  type AddPlaceResult,
} from "../../components/modal/addPlace/AddPlaceModal";
import KakaoPlaceDetailMap from "../../components/placeDetail/KakaoPlaceDetailMap";
import SearchMascot from "../../assets/SearchMascot.webp";
import {
  findNearbyPlaces,
  findPlaceDetail,
  type KakaoPlaceInfo,
} from "../../api/kakao/placeDetails";
import { PlaceDetailPageStyle } from "./PlaceDetailPageStyle";
import { useSavedPlaces } from "../../contexts/SavedPlacesContext";
import Breadcrumb from "../../components/MainSidebar/mainHeader/Breadcrumb";

type Tab = "intro" | "nearby" | "reviews";
type NearCategory = "전체" | "관광지" | "맛집" | "카페" | "숙소";
export type DetailPlace = {
  id: string;
  name: string;
  address: string;
  category: string;
  categoryName?: string;
  phone?: string;
  placeUrl?: string;
  lat?: number;
  lng?: number;
  image?: string;
  description?: string;
};

type NavigationState = { place?: DetailPlace } | null;
const tabs: { id: Tab; label: string; Icon: typeof FileText }[] = [
  { id: "intro", label: "소개", Icon: FileText },
  { id: "nearby", label: "주변 장소", Icon: MapPin },
  { id: "reviews", label: "후기", Icon: MessageSquareText },
];
const categories: NearCategory[] = ["전체", "관광지", "맛집", "카페", "숙소"];

function finiteCoordinate(input: string | null): number | undefined {
  if (!input?.trim()) return undefined;
  const value = Number(input);
  return Number.isFinite(value) ? value : undefined;
}

function fromKakao(item: KakaoPlaceInfo): DetailPlace {
  const code = item.category_group_code;
  return {
    id: `kakao-${item.id}`,
    name: item.place_name,
    address: item.road_address_name || item.address_name,
    category:
      code === "FD6"
        ? "음식점"
        : code === "CE7"
          ? "카페"
          : code === "AD5"
            ? "숙소"
            : "관광",
    categoryName: item.category_name,
    phone: item.phone,
    placeUrl: item.place_url,
    lat: Number(item.y),
    lng: Number(item.x),
  };
}

function getDetailLink(place: DetailPlace) {
  const params = new URLSearchParams({
    id: place.id,
    name: place.name,
    address: place.address,
    category: place.category,
  });
  if (Number.isFinite(place.lat)) params.set("lat", String(place.lat));
  if (Number.isFinite(place.lng)) params.set("lng", String(place.lng));
  return `/place/detail?${params.toString()}`;
}

function safeKakaoUrl(place: DetailPlace) {
  if (place.placeUrl) {
    try {
      const url = new URL(place.placeUrl);
      if (
        url.protocol === "https:" &&
        (url.hostname === "place.map.kakao.com" ||
          url.hostname === "map.kakao.com")
      )
        return url.toString();
    } catch {
      /* discard malformed URL */
    }
  }
  const id = place.id.replace(/^kakao-/, "");
  return /^\d+$/.test(id) ? `https://place.map.kakao.com/${id}` : null;
}

type SavedCategory =
  | "attraction"
  | "restaurant"
  | "cafe"
  | "accommodation"
  | "other";

function getBookmarkIdentity(place: DetailPlace | null) {
  if (!place) return null;
  const placeId = place.id.replace(/^kakao-/, "");
  // 현재 상세 페이지는 카카오 장소 ID를 사용합니다.
  if (!/^\d+$/.test(placeId)) return null;
  return { provider: "kakao", placeId };
}

function toBookmarkInput(place: DetailPlace, image: string | null) {
  const identity = getBookmarkIdentity(place);
  if (!identity) throw new Error("장소 정보를 확인한 뒤 다시 시도해 주세요.");

  const categoryMap: Record<string, SavedCategory> = {
    관광: "attraction",
    관광지: "attraction",
    음식점: "restaurant",
    맛집: "restaurant",
    카페: "cafe",
    숙소: "accommodation",
  };
  const candidate = image || place.image;

  return {
    ...identity,
    name: place.name,
    address: place.address,
    category: categoryMap[place.category] ?? "other",
    description: place.description || place.categoryName || "",
    imageUrl: candidate && /^https?:\/\//i.test(candidate) ? candidate : null,
    latitude:
      typeof place.lat === "number" && Number.isFinite(place.lat)
        ? place.lat
        : null,
    longitude:
      typeof place.lng === "number" && Number.isFinite(place.lng)
        ? place.lng
        : null,
  };
}

export default function PlaceDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const urlKey = params.toString();
  const statePlace = (location.state as NavigationState)?.place;
  const request = useMemo(
    () => ({
      id: params.get("id") || "",
      name: params.get("name") || "",
      address: params.get("address") || "",
      category: params.get("category") || "관광",
      lat: finiteCoordinate(params.get("lat")),
      lng: finiteCoordinate(params.get("lng")),
    }),
    [params],
  );
  const initialPlace: DetailPlace | null = request.name
    ? {
        ...request,
        ...(statePlace?.name === request.name ? statePlace : {}),
      }
    : null;
  const [resolved, setResolved] = useState<{
    key: string;
    place: DetailPlace;
  } | null>(null);
  const place = resolved?.key === urlKey ? resolved.place : initialPlace;
  const [apiError, setApiError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("intro");
  const [category, setCategory] = useState<NearCategory>("전체");
  const [nearby, setNearby] = useState<KakaoPlaceInfo[]>([]);
  const [nearbyError, setNearbyError] = useState("");
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [photo, setPhoto] = useState<{
    key: string;
    url: string | null;
  } | null>(null);
  const [brokenPhotoKey, setBrokenPhotoKey] = useState<string | null>(null);
  const {
    isSaved,
    isPending,
    isLoading: bookmarksLoading,
    loadError: bookmarksLoadError,
    toggleSaved,
    reload: reloadBookmarks,
  } = useSavedPlaces();
  const [bookmarkFailure, setBookmarkFailure] = useState<{
    key: string;
    message: string;
  } | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [added, setAdded] = useState<AddPlaceResult | null>(null);
  const tabsId = useId();
  const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab);

  // Kakao Places: fetch the actual metadata rather than reusing hard-coded detail mockups.
  useEffect(() => {
    if (!request.name) return;
    let active = true;
    void findPlaceDetail(request)
      .then((record) => {
        if (!active) return;
        setApiError("");
        if (record) {
          setResolved({
            key: urlKey,
            place: { ...initialPlace, ...fromKakao(record) },
          });
        }
      })
      .catch((reason: unknown) => {
        if (active)
          setApiError(
            reason instanceof Error
              ? reason.message
              : "장소 정보를 불러오지 못했습니다.",
          );
      });
    return () => {
      active = false;
    };
    // Use URL fields to recover the place on refresh; navigation state is a fast initial display.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKey]);

  const photoName = place?.name ?? "";
  const photoAddress = place?.address ?? "";
  const photoLat = place?.lat;
  const photoLng = place?.lng;
  const photoKey = `${photoName}|${photoAddress}|${photoLat ?? ""}|${photoLng ?? ""}`;
  useEffect(() => {
    if (!photoName || !photoAddress) return;
    let active = true;
    const search = new URLSearchParams({
      name: photoName,
      address: photoAddress,
    });
    if (Number.isFinite(photoLat)) search.set("lat", String(photoLat));
    if (Number.isFinite(photoLng)) search.set("lng", String(photoLng));
    void fetch(`/api/tour/photos?${search.toString()}`)
      .then(async (response) =>
        response.ok ? ((await response.json()) as { image?: unknown }) : {},
      )
      .then((data) => {
        const candidate = typeof data.image === "string" ? data.image : null;
        if (active)
          setPhoto({
            key: photoKey,
            url: candidate?.startsWith("https://") ? candidate : null,
          });
      })
      .catch(() => {
        if (active) setPhoto({ key: photoKey, url: null });
      });
    return () => {
      active = false;
    };
  }, [photoKey, photoName, photoAddress, photoLat, photoLng]);

  const nearbyId = place?.id;
  const nearbyLat = place?.lat;
  const nearbyLng = place?.lng;
  useEffect(() => {
    if (
      activeTab !== "nearby" ||
      !Number.isFinite(nearbyLat) ||
      !Number.isFinite(nearbyLng)
    )
      return;
    let active = true;
    void findNearbyPlaces(nearbyLat!, nearbyLng!, category)
      .then((results) => {
        if (!active) return;
        setNearby(results.filter((item) => `kakao-${item.id}` !== nearbyId));
        setNearbyError("");
        setNearbyLoading(false);
      })
      .catch((reason: unknown) => {
        if (active) {
          setNearbyError(
            reason instanceof Error
              ? reason.message
              : "주변 장소를 불러오지 못했습니다.",
          );
          setNearbyLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [activeTab, nearbyId, nearbyLat, nearbyLng, category]);

  const onTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % tabs.length
        : event.key === "ArrowLeft"
          ? (index + tabs.length - 1) % tabs.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? tabs.length - 1
              : -1;
    if (next === -1) return;
    event.preventDefault();
    setActiveTab(tabs[next].id);
    const buttons =
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]',
      );
    buttons?.[next]?.focus();
  };

  const kakaoUrl = place ? safeKakaoUrl(place) : null;
  const picture =
    photo?.key === photoKey && brokenPhotoKey !== photoKey ? photo.url : null;

  const bookmarkIdentity = getBookmarkIdentity(place);
  const bookmarkKey = bookmarkIdentity
    ? JSON.stringify([bookmarkIdentity.provider, bookmarkIdentity.placeId])
    : "";
  const bookmarked = bookmarkIdentity ? isSaved(bookmarkIdentity) : false;
  const bookmarkPending = bookmarkIdentity
    ? isPending(bookmarkIdentity)
    : false;
  const bookmarkDisabled =
    !bookmarkIdentity ||
    bookmarksLoading ||
    Boolean(bookmarksLoadError) ||
    bookmarkPending;
  const bookmarkError =
    bookmarkFailure?.key === bookmarkKey ? bookmarkFailure.message : null;

  async function handleToggleBookmark(): Promise<void> {
    if (!place || bookmarkDisabled) return;
    setBookmarkFailure(null);

    try {
      await toggleSaved(toBookmarkInput(place, picture));
    } catch (error: unknown) {
      setBookmarkFailure({
        key: bookmarkKey,
        message:
          error instanceof Error
            ? error.message
            : "장소 저장 상태를 변경하지 못했어요.",
      });
    }
  }

  return (
    <PlaceDetailPageStyle>
      <aside className="page-sidebar">
        <MainSidebar />
      </aside>
      <div className="page-mobile-header">
        <MobileHeader />
      </div>
      <main className="page-content">
        <div className="detail-inner">
          {/* <nav className="breadcrumb" aria-label="현재 위치">
            <Link to="/search">검색</Link>
            <ChevronRight size={17} aria-hidden="true" />
            <span aria-current="page">장소 상세</span>
          </nav> */}
          <Breadcrumb className="breadcrumb" />
          {!place ? (
            <section className="content-card missing-place">
              <Search size={32} />
              <h1>표시할 장소가 없습니다.</h1>
              <p>검색 결과에서 장소 이름이나 사진을 클릭해 주세요.</p>
              <Link to="/search">여행지 검색으로 돌아가기</Link>
            </section>
          ) : (
            <>
              <section className="hero-section" aria-label="장소 기본 정보">
                <div className="hero-image-card">
                  {picture ? (
                    <img
                      src={picture}
                      alt={`${place.name} 사진 (한국관광공사)`}
                      onError={() => setBrokenPhotoKey(photoKey)}
                    />
                  ) : (
                    <div className="photo-placeholder">
                      <ImageIcon size={50} />
                      <span>{place.name}</span>
                      <small>등록된 관광지 사진이 없습니다</small>
                    </div>
                  )}
                </div>
                <div className="summary-column">
                  <section className="summary-card">
                    <div className="tag-row">
                      <span className="tag-chip">{place.category}</span>
                      {place.categoryName && (
                        <span className="tag-chip">{place.categoryName}</span>
                      )}
                    </div>
                    <h1>{place.name}</h1>
                    <div className="location-row">
                      <MapPin size={18} />
                      <span>{place.address}</span>
                    </div>
                    <p className="verified-detail">
                      카카오맵 장소 검색 정보를 기준으로 표시합니다.
                    </p>
                    {apiError && (
                      <p className="inline-warning" role="status">
                        추가 정보 조회 실패: {apiError}
                      </p>
                    )}
                    <div className="action-row">
                      <button
                        className="primary-action-button"
                        type="button"
                        onClick={() => setAddOpen(true)}
                      >
                        <CalendarDays size={23} />
                        <span>{added ? "일정 추가됨" : "일정에 추가"}</span>
                      </button>
                      <button
                        className="icon-outline-button"
                        type="button"
                        aria-label={bookmarked ? "장소 저장 해제" : "장소 저장"}
                        aria-pressed={bookmarked}
                        aria-busy={bookmarkPending}
                        disabled={bookmarkDisabled}
                        title={
                          bookmarksLoading
                            ? "저장 목록을 불러오고 있어요."
                            : bookmarksLoadError
                              ? "저장 목록을 다시 불러와 주세요."
                              : !bookmarkIdentity
                                ? "장소 정보를 확인하고 있어요."
                                : bookmarked
                                  ? "저장 해제"
                                  : "장소 저장"
                        }
                        onClick={() => void handleToggleBookmark()}
                      >
                        <Bookmark
                          size={25}
                          fill={bookmarked ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                    {bookmarksLoadError && (
                      <div className="inline-warning" role="alert">
                        <p>{bookmarksLoadError}</p>
                        <button
                          type="button"
                          onClick={() => void reloadBookmarks()}
                          disabled={bookmarksLoading}
                        >
                          저장 목록 다시 불러오기
                        </button>
                      </div>
                    )}
                    {bookmarkError && (
                      <p className="inline-warning" role="alert">
                        {bookmarkError}
                      </p>
                    )}
                  </section>
                  <section className="info-card">
                    <h2>장소 정보</h2>
                    <ul className="info-list">
                      <li>
                        <span className="info-label">
                          <MapPin />
                          <strong>주소</strong>
                        </span>
                        <span className="info-value">{place.address}</span>
                      </li>
                      <li>
                        <span className="info-label">
                          <Phone />
                          <strong>전화번호</strong>
                        </span>
                        <span className="info-value">
                          {place.phone ? (
                            <a
                              href={`tel:${place.phone.replace(/[^\d+]/g, "")}`}
                            >
                              {place.phone}
                            </a>
                          ) : (
                            "정보 없음"
                          )}
                        </span>
                      </li>
                      <li>
                        <span className="info-label">
                          <FileText />
                          <strong>분류</strong>
                        </span>
                        <span className="info-value">
                          {place.categoryName || place.category}
                        </span>
                      </li>
                    </ul>
                  </section>
                </div>
              </section>
              <div
                className="tab-card"
                role="tablist"
                aria-label="장소 상세 정보"
              >
                {tabs.map(({ id, label, Icon }, index) => (
                  <button
                    key={id}
                    type="button"
                    className={`tab-item${activeTab === id ? " is-active" : ""}`}
                    id={`${tabsId}-${id}-tab`}
                    role="tab"
                    aria-selected={activeTab === id}
                    aria-controls={`${tabsId}-panel`}
                    tabIndex={activeTab === id ? 0 : -1}
                    onClick={() => {
                      setActiveTab(id);
                      if (id === "nearby") setNearbyLoading(true);
                    }}
                    onKeyDown={(event) => onTabKeyDown(event, index)}
                  >
                    <Icon size={23} />
                    <span>{label}</span>
                  </button>
                ))}
                <span
                  className="tab-indicator"
                  aria-hidden="true"
                  style={{
                    transform: `translateX(calc(${activeTabIndex * 100}% + ${activeTabIndex} * var(--tab-gap)))`,
                  }}
                />
              </div>
              <div
                id={`${tabsId}-panel`}
                role="tabpanel"
                aria-labelledby={`${tabsId}-${activeTab}-tab`}
                className="tab-content"
              >
                {activeTab === "intro" && (
                  <section className="content-card intro-section">
                    <div className="section-heading">
                      <h2>{place.name} 소개</h2>
                    </div>
                    <p className="section-description">
                      {place.name}의 위치와 기본 정보입니다.{" "}
                      {place.categoryName
                        ? `분류: ${place.categoryName}. `
                        : ""}
                      주소는 {place.address}입니다. 상세 운영 시간과 이용 후기는
                      카카오맵에서 확인해 주세요.
                    </p>
                    <h3 className="detail-subheading">지도에서 위치 확인</h3>
                    {Number.isFinite(place.lat) &&
                    Number.isFinite(place.lng) ? (
                      <KakaoPlaceDetailMap
                        name={place.name}
                        lat={place.lat!}
                        lng={place.lng!}
                      />
                    ) : (
                      <p className="inline-warning">
                        좌표 정보가 없어 지도를 표시할 수 없습니다.
                      </p>
                    )}
                    {kakaoUrl && (
                      <a
                        className="external-map-link"
                        href={kakaoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Navigation size={18} />
                        카카오맵에서 상세정보 확인
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </section>
                )}
                {activeTab === "nearby" && (
                  <section className="content-card nearby-section">
                    <div
                      className="filter-row"
                      role="group"
                      aria-label="주변 장소 분류"
                    >
                      {categories.map((item) => (
                        <button
                          className={`filter-chip${category === item ? " is-active" : ""}`}
                          type="button"
                          key={item}
                          aria-pressed={category === item}
                          onClick={() => {
                            setCategory(item);
                            setNearbyLoading(true);
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                    {nearbyError && (
                      <p role="alert" className="inline-warning">
                        {nearbyError}
                      </p>
                    )}
                    {nearbyLoading && (
                      <p role="status">주변 장소를 검색 중입니다…</p>
                    )}
                    {!nearbyLoading && !nearbyError && nearby.length === 0 && (
                      <p>주변에 등록된 장소가 없습니다.</p>
                    )}
                    <div className="nearby-grid">
                      {!nearbyLoading &&
                        nearby.map((item) => {
                          const next = fromKakao(item);
                          return (
                            <article className="nearby-card" key={item.id}>
                              <div className="nearby-body">
                                <h3>{next.name}</h3>
                                <p>{next.address}</p>
                                <p>{next.categoryName || next.category}</p>
                                <div className="nearby-meta">
                                  <button
                                    className="nearby-details-button"
                                    type="button"
                                    onClick={() => {
                                      navigate(getDetailLink(next), {
                                        state: { place: next },
                                      });
                                      setActiveTab("intro");
                                    }}
                                  >
                                    상세 보기 <ChevronRight size={16} />
                                  </button>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                    </div>
                  </section>
                )}
                {activeTab === "reviews" && (
                  <section className="content-card reviews-section">
                    <div className="section-heading">
                      <h2>이용 후기</h2>
                    </div>
                    <p className="section-description">
                      카카오 장소 검색 API는 평점과 후기 본문을 제공하지
                      않습니다. 실제 이용 후기는 카카오맵에서 확인할 수
                      있습니다.
                    </p>
                    {kakaoUrl && (
                      <a
                        className="external-map-link"
                        href={kakaoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        카카오맵 후기 확인 <ExternalLink size={16} />
                      </a>
                    )}
                  </section>
                )}
              </div>
              <AddPlaceModal
                open={addOpen}
                place={{
                  id: place.id,
                  name: place.name,
                  address: place.address,
                  category: place.category,
                  image: picture || SearchMascot,
                }}
                onClose={() => setAddOpen(false)}
                onAdd={(result) => {
                  setAdded(result);
                  setAddOpen(false);
                }}
              />
            </>
          )}
        </div>
      </main>
      <div className="page-mobile-footer">
        <MobileFooter />
      </div>
    </PlaceDetailPageStyle>
  );
}
