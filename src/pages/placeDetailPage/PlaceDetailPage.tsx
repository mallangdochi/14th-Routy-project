import { useId, useState } from "react";
import type { KeyboardEvent } from "react";
import {
  Bookmark,
  CalendarDays,
  CarFront,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  Image as ImageIcon,
  MapPin,
  MessageSquareText,
  Pencil,
  Star,
  Ticket,
} from "lucide-react";
import MainSidebar from "../../components/MainSidebar/MainSidebar";
import MobileHeader from "../../components/mobileBanner/MobileHeader";
import MobileFooter from "../../components/mobileBanner/MobileFooter";
import placeDetailImage from "../../assets/placeDetailSample.jpg";
import { PlaceDetailPageStyle } from "./PlaceDetailPageStyle";

type DetailTab = "intro" | "nearby" | "reviews";
type PlaceCategory = "전체" | "관광지" | "맛집" | "카페" | "숙소";
type ReviewSort = "recent" | "rating";

const tabs: { id: DetailTab; label: string; Icon: typeof FileText }[] = [
  { id: "intro", label: "소개", Icon: FileText },
  { id: "nearby", label: "주변 장소", Icon: MapPin },
  { id: "reviews", label: "후기", Icon: MessageSquareText },
];

const categories: PlaceCategory[] = ["전체", "관광지", "맛집", "카페", "숙소"];

const nearbyPlaces: {
  id: number;
  name: string;
  category: Exclude<PlaceCategory, "전체">;
  description: string;
  rating: string;
  count: string;
}[] = [
  {
    id: 1,
    name: "고궁 산책길",
    category: "관광지",
    description: "연못을 따라 조용히 걷기 좋은 산책 코스예요.",
    rating: "4.7",
    count: "1,248",
  },
  {
    id: 2,
    name: "서촌 다락 카페",
    category: "카페",
    description: "고즈넉한 창가에서 차 한 잔을 즐길 수 있어요.",
    rating: "4.6",
    count: "892",
  },
  {
    id: 3,
    name: "궁담 한상",
    category: "맛집",
    description: "정갈한 한식과 따뜻한 식사를 즐길 수 있는 공간이에요.",
    rating: "4.5",
    count: "1,120",
  },
  {
    id: 4,
    name: "북촌 작은 정원",
    category: "관광지",
    description: "골목 사이로 한옥의 운치를 느낄 수 있는 장소예요.",
    rating: "4.6",
    count: "756",
  },
  {
    id: 5,
    name: "종로 스테이",
    category: "숙소",
    description: "도심의 편리함과 아늑한 분위기를 함께 누릴 수 있어요.",
    rating: "4.4",
    count: "528",
  },
  {
    id: 6,
    name: "돌담길 티룸",
    category: "카페",
    description: "궁궐 산책을 마친 뒤 잠시 쉬어 가기 좋아요.",
    rating: "4.8",
    count: "643",
  },
];

const reviews = [
  {
    id: 1,
    author: "고궁산책",
    initials: "궁",
    date: "2026. 10. 12.",
    rating: 5,
    text: "연못에 비친 정자가 정말 아름다웠어요. 조용히 둘러보면서 가을 풍경을 즐기기 좋았습니다. 사진으로 보는 것보다 직접 봤을 때 분위기가 더 좋았어요!",
    hasPhoto: true,
  },
  {
    id: 2,
    author: "서울나들이",
    initials: "서",
    date: "2026. 10. 08.",
    rating: 5,
    text: "산책로가 잘 정돈되어 있어서 여유롭게 걸었어요. 주변 풍경이 아기자기하고 예쁜 곳이 많아 다음에는 가족과 함께 다시 오고 싶어요.",
    hasPhoto: true,
  },
  {
    id: 3,
    author: "주말여행자",
    initials: "주",
    date: "2026. 09. 21.",
    rating: 4,
    text: "사람이 많을 때도 있지만 잠깐 기다렸다가 둘러보니 괜찮았어요. 날씨 좋은 날 천천히 걷는 코스로 추천해요.",
    hasPhoto: false,
  },
  {
    id: 4,
    author: "초록빛",
    initials: "초",
    date: "2026. 08. 29.",
    rating: 5,
    text: "고궁의 단청과 자연 풍경이 잘 어울려요. 근처에서 식사하고 들르기에도 좋은 위치라 하루 일정에 넣기 편했습니다.",
    hasPhoto: true,
  },
];

export default function PlaceDetailPage() {
  const [activeTab, setActiveTab] = useState<DetailTab>("intro");
  const [category, setCategory] = useState<PlaceCategory>("전체");
  const [reviewSort, setReviewSort] = useState<ReviewSort>("recent");
  const [photoOnly, setPhotoOnly] = useState(false);
  const tabsId = useId();

  const filteredPlaces = nearbyPlaces.filter(
    (place) => category === "전체" || place.category === category,
  );
  const filteredReviews = reviews
    .filter((review) => !photoOnly || review.hasPhoto)
    .sort((a, b) =>
      reviewSort === "rating"
        ? b.rating - a.rating || a.id - b.id
        : a.id - b.id,
    );

  const onTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const nextIndex =
      event.key === "ArrowRight"
        ? (index + 1) % tabs.length
        : event.key === "ArrowLeft"
          ? (index + tabs.length - 1) % tabs.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? tabs.length - 1
              : null;

    if (nextIndex === null) return;
    event.preventDefault();
    setActiveTab(tabs[nextIndex].id);
    const buttons =
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]',
      );
    buttons?.[nextIndex]?.focus();
  };

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
          <nav className="breadcrumb" aria-label="현재 위치">
            <span>검색</span>
            <ChevronRight size={17} aria-hidden="true" />
            <span aria-current="page">장소 상세</span>
          </nav>

          <section className="hero-section" aria-label="장소 기본 정보">
            <div className="hero-image-card">
              <img
                src={placeDetailImage}
                alt="연못과 가을 단풍 사이에 자리한 전통 정자"
              />
            </div>

            <div className="summary-column">
              <section className="summary-card">
                <div className="tag-row">
                  <span className="tag-chip">관광지</span>
                  <span className="tag-chip">서울</span>
                  <span className="tag-chip">추천 체류 1~2시간</span>
                </div>

                <h1>경복궁 향원정</h1>
                <div className="location-row">
                  <MapPin
                    size={18}
                    fill="currentColor"
                    strokeWidth={2.2}
                    aria-hidden="true"
                  />
                  <span>서울특별시 종로구 사직로 161</span>
                </div>
                <div className="rating-row">
                  <Star
                    size={32}
                    fill="currentColor"
                    strokeWidth={1.4}
                    aria-hidden="true"
                  />
                  <strong>4.8</strong>
                  <span>(2,431)</span>
                </div>

                <div className="action-row">
                  <button className="primary-action-button" type="button">
                    <CalendarDays
                      size={23}
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                    <span>일정에 추가</span>
                  </button>
                  <button
                    className="icon-outline-button"
                    type="button"
                    aria-label="장소 저장"
                  >
                    <Bookmark size={25} strokeWidth={2} aria-hidden="true" />
                  </button>
                </div>
              </section>

              <section className="info-card">
                <h2>방문 정보</h2>
                <ul className="info-list">
                  <li>
                    <span className="info-label">
                      <Ticket aria-hidden="true" />
                      <strong>입장 요금</strong>
                    </span>
                    <span className="info-value">방문 전 확인</span>
                  </li>
                  <li>
                    <span className="info-label">
                      <Clock3 aria-hidden="true" />
                      <strong>추천 체류 시간</strong>
                    </span>
                    <span className="info-value">1~2시간</span>
                  </li>
                  <li>
                    <span className="info-label">
                      <CarFront aria-hidden="true" />
                      <strong>주차 정보</strong>
                    </span>
                    <span className="info-value">인근 주차장 확인</span>
                  </li>
                </ul>
              </section>
            </div>
          </section>

          <div className="tab-card" role="tablist" aria-label="장소 상세 정보">
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
                onClick={() => setActiveTab(id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                <Icon size={23} strokeWidth={1.9} aria-hidden="true" />
                <span>{label}</span>
              </button>
            ))}
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
                  <h2>경복궁 향원정 소개</h2>
                </div>
                <p className="section-description">
                  향원정은 고요한 연못과 나무들에 둘러싸인 아름다운 정자입니다.
                  계절마다 달라지는 자연 풍경과 고궁의 분위기를 함께 느낄 수
                  있어요. 천천히 산책하며 여유로운 시간을 보내거나, 한적한
                  풍경을 사진으로 남기기에도 좋은 장소입니다.
                </p>
                <div className="gallery-grid">
                  {Array.from({ length: 4 }, (_, index) => (
                    <div className="gallery-item" key={index}>
                      <img
                        src={placeDetailImage}
                        alt={`경복궁 향원정 풍경 예시 ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
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
                      onClick={() => setCategory(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="nearby-grid">
                  {filteredPlaces.map((place) => (
                    <article className="nearby-card" key={place.id}>
                      <div className="nearby-image">
                        <img
                          src={placeDetailImage}
                          alt={`${place.name} 예시 이미지`}
                        />
                        <span className="place-category">{place.category}</span>
                      </div>
                      <div className="nearby-body">
                        <div className="nearby-name-row">
                          <h3>{place.name}</h3>
                          <span className="nearby-category-inline">
                            {place.category}
                          </span>
                        </div>
                        <p>{place.description}</p>
                        <div className="nearby-meta">
                          <span className="nearby-rating">
                            <Star
                              size={20}
                              fill="currentColor"
                              strokeWidth={1.4}
                              aria-hidden="true"
                            />
                            <strong>{place.rating}</strong>
                            <span>({place.count})</span>
                          </span>
                          <button
                            className="nearby-details-button"
                            type="button"
                          >
                            <Bookmark size={17} aria-hidden="true" />
                            <span>상세 보기</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "reviews" && (
              <section className="content-card reviews-section">
                <div className="review-toolbar">
                  <div className="review-score">
                    <Star
                      size={36}
                      fill="currentColor"
                      strokeWidth={1.4}
                      aria-hidden="true"
                    />
                    <strong>4.8</strong>
                    <span>(2,431)</span>
                  </div>
                  <div className="review-actions">
                    <button
                      type="button"
                      className={`review-filter-button${photoOnly ? " is-active" : ""}`}
                      aria-pressed={photoOnly}
                      onClick={() => setPhotoOnly((current) => !current)}
                    >
                      <ImageIcon
                        size={19}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                      <span>전체 포토 후기</span>
                    </button>
                    <label className="review-sort">
                      <span className="sr-only">후기 정렬</span>
                      <select
                        value={reviewSort}
                        onChange={(event) =>
                          setReviewSort(event.target.value as ReviewSort)
                        }
                      >
                        <option value="recent">최신순</option>
                        <option value="rating">평점순</option>
                      </select>
                      <ChevronDown size={17} aria-hidden="true" />
                    </label>
                    <button className="write-review-button" type="button">
                      <Pencil size={19} strokeWidth={1.8} aria-hidden="true" />
                      후기 작성
                    </button>
                  </div>
                </div>

                <div className="review-grid">
                  {filteredReviews.map((review) => (
                    <article className="review-card" key={review.id}>
                      <div className="review-user-row">
                        <span className="review-avatar">{review.initials}</span>
                        <div className="review-identity">
                          <strong>{review.author}</strong>
                          <span
                            className="review-stars"
                            aria-label={`평점 ${review.rating}점`}
                          >
                            {Array.from(
                              { length: review.rating },
                              (_, index) => (
                                <Star
                                  size={16}
                                  key={index}
                                  fill="currentColor"
                                  strokeWidth={1.3}
                                  aria-hidden="true"
                                />
                              ),
                            )}
                          </span>
                        </div>
                        <time>{review.date}</time>
                      </div>
                      <p className="review-text">{review.text}</p>
                      {review.hasPhoto && (
                        <div className="review-photos">
                          <img
                            src={placeDetailImage}
                            alt={`${review.author} 후기 예시 사진`}
                          />
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <div className="page-mobile-footer">
        <MobileFooter />
      </div>
    </PlaceDetailPageStyle>
  );
}
