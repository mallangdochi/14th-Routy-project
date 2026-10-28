import {
  useMemo,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  type FormEvent,
} from "react";
import {
  House,
  Search as SearchIcon,
  X,
  Bookmark,
  Map as MapIcon,
  MapPin,
  Plus,
} from "lucide-react";

import Dropdown from "../dropdown/Dropdown";
import AddPlaceModal, {
  type AddPlaceResult,
} from "../modal/addPlace/AddPlaceModal";
import SearchMascot from "../../assets/SearchMascot.webp";
import MainSidebar from "../MainSidebar/MainSidebar";
import MobileHeader from "../mobileBanner/MobileHeader";
import MobileNav from "../mobileBanner/MobileFooter";
import Breadcrumb from "../MainSidebar/mainHeader/Breadcrumb";
import KakaoSavedPlaceModal from "../modal/saved-place/KakaoSavedPlaceModal";
import { loadKakaoMaps } from "../../api/kakao/kakaoSdk";
import { REGIONS } from "../../data/regions";
import * as S from "./SearchStyle";

import { type SavedPlace, type PlaceCategory } from "../../data/saved";

type Category = "전체" | PlaceCategory;
type SortOption = "추천순" | "이름순";

const CATEGORIES: Category[] = ["전체", "관광", "음식점", "카페", "숙소"];

const SORT_OPTIONS: readonly {
  value: SortOption;
  label: string;
}[] = [
  { value: "추천순", label: "추천순" },
  { value: "이름순", label: "이름순" },
];

// Kakao Maps JS SDK의 장소 검색 응답. API 키와 SDK 로더는 팀원 코드 그대로 사용합니다.
type KakaoSearchPlace = {
  id: string;
  place_name: string;
  category_name: string;
  category_group_code: string;
  address_name: string;
  road_address_name?: string;
  x: string;
  y: string;
};

type KakaoSearchClient = {
  keywordSearch: (
    query: string,
    callback: (places: KakaoSearchPlace[], status: string) => void,
    options?: { category_group_code?: string; size?: number; page?: number },
  ) => void;
};

type SearchTask = {
  query: string;
  group?: string;
};

type SearchState = {
  results: SavedPlace[];
  loading: boolean;
  error: string;
};

const EMPTY_SEARCH: SearchState = {
  results: [],
  loading: false,
  error: "",
};

// 카카오 장소 검색은 사진을 반환하지 않아 앱에 있는 안내 이미지로 표시합니다.
const FALLBACK_PLACE_IMAGE = SearchMascot;

const GROUP_CODE: Record<PlaceCategory, string> = {
  관광: "AT4",
  음식점: "FD6",
  카페: "CE7",
  숙소: "AD5",
};

const NORMALIZE = (value: string) => value.replace(/\s+/g, "").toLowerCase();
const REGION_ENDING = /(특별자치시|특별시|광역시|특별자치도|시|군|구|도)$/;
const INTENT_WORDS =
  /(관광명소|관광지|가볼만한곳|볼거리|명소|명물|맛집|음식점|식당|카페|숙소|호텔|펜션|여행)$/g;

function getRegionLabel(value: string): string | null {
  const key = NORMALIZE(value).replace(REGION_ENDING, "");
  if (!key) return null;
  // '진주' → '진주시', '경남 진주' → '진주시' 등 주소에 표시되는 시·군 이름 확보
  for (const region of REGIONS) {
    const last = region.name.split(" ").at(-1) ?? "";
    const candidates = [
      last,
      last.replace(REGION_ENDING, ""),
      region.name,
      ...(region.keywords ?? []),
    ];
    if (candidates.some((item) => NORMALIZE(item) === key)) {
      return last;
    }
  }
  return null;
}

function getSearchPlan(rawKeyword: string, category: Category) {
  const keyword = rawKeyword.trim().replace(/\s+/g, " ");
  const tailRemoved = keyword.replace(INTENT_WORDS, "").trim();
  const region = getRegionLabel(tailRemoved || keyword);
  const isRegionSearch = region !== null;
  const hasFoodIntent = /맛집|음식점|식당|명물/.test(keyword);
  const hasCafeIntent = /카페/.test(keyword);
  const hasStayIntent = /숙소|호텔|펜션/.test(keyword);
  const hasTourIntent = /관광|명소|볼거리|가볼만한곳/.test(keyword);

  let target = category;
  if (target === "전체" && isRegionSearch) {
    if (hasFoodIntent) target = "음식점";
    else if (hasCafeIntent) target = "카페";
    else if (hasStayIntent) target = "숙소";
    else if (hasTourIntent) target = "관광";
  }

  if (!isRegionSearch) {
    if (target === "전체") return { region: null, tasks: [{ query: keyword }] };
    if (target === "관광") {
      return {
        region: null,
        tasks: [
          { query: keyword, group: "AT4" },
          { query: keyword, group: "CT1" },
        ],
      };
    }
    return {
      region: null,
      tasks: [{ query: keyword, group: GROUP_CODE[target] }],
    };
  }

  const regionWord = region.replace(REGION_ENDING, "");
  const tourTasks: SearchTask[] = [
    { query: `${regionWord} 관광지`, group: "AT4" },
    { query: `${regionWord} 관광명소`, group: "AT4" },
    { query: `${regionWord} 박물관`, group: "CT1" },
  ];
  const categoryTasks: Record<PlaceCategory, SearchTask[]> = {
    관광: tourTasks,
    음식점: [{ query: `${regionWord} 맛집`, group: "FD6" }],
    카페: [{ query: `${regionWord} 카페`, group: "CE7" }],
    숙소: [{ query: `${regionWord} 숙소`, group: "AD5" }],
  };

  // 지역만 입력한 경우 다양한 종류의 장소를 함께 보여줍니다.
  const tasks =
    target === "전체"
      ? [
          ...tourTasks.slice(0, 2),
          ...categoryTasks.음식점,
          ...categoryTasks.카페,
          ...categoryTasks.숙소,
        ]
      : categoryTasks[target];

  return { region, tasks };
}

function toSavedPlace(place: KakaoSearchPlace): SavedPlace {
  const code = place.category_group_code;
  const category: PlaceCategory =
    code === "FD6"
      ? "음식점"
      : code === "CE7"
        ? "카페"
        : code === "AD5"
          ? "숙소"
          : "관광";

  return {
    id: `kakao-${place.id}`,
    name: place.place_name,
    category,
    address: place.road_address_name || place.address_name || "주소 정보 없음",
    description: place.category_name || `${category} · 카카오맵 장소 검색 결과`,
    image: FALLBACK_PLACE_IMAGE,
    savedAt: new Date().toISOString(),
  };
}

function keywordSearch(
  client: KakaoSearchClient,
  task: SearchTask,
): Promise<KakaoSearchPlace[]> {
  return new Promise((resolve, reject) => {
    client.keywordSearch(
      task.query,
      (places, status) => {
        if (status === "OK") resolve(places);
        else if (status === "ZERO_RESULT" || status === "RESULT_NOT_FOUND")
          resolve([]);
        else
          reject(new Error(`카카오 장소 검색 실패 (${status || "응답 없음"})`));
      },
      {
        size: 15,
        page: 1,
        ...(task.group ? { category_group_code: task.group } : {}),
      },
    );
  });
}

export default function Search() {
  const [keyword, setKeyword] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체");

  const categoryListRef = useRef<HTMLDivElement>(null);

  const categoryButtonRefs = useRef<
    Partial<Record<Category, HTMLButtonElement | null>>
  >({});

  const [indicatorStyle, setIndicatorStyle] = useState({
    x: 0,
    width: 0,
  });

  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<SavedPlace | null>(null);
  const [mapPlace, setMapPlace] = useState<SavedPlace | null>(null);
  const [addedPlaces, setAddedPlaces] = useState<
    Record<string, AddPlaceResult>
  >({});

  const [sort, setSort] = useState<SortOption>("추천순");
  const [searchState, setSearchState] = useState<SearchState>(EMPTY_SEARCH);

  const results = useMemo(() => {
    if (sort === "이름순") {
      return [...searchState.results].sort((a, b) =>
        a.name.localeCompare(b.name, "ko"),
      );
    }
    return searchState.results;
  }, [searchState.results, sort]);

  // 사용자가 입력을 멈추면 자동으로 검색합니다. Enter를 누르면 즉시 검색합니다.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSubmittedKeyword(keyword.trim());
    }, 500);
    return () => window.clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    if (!submittedKeyword) return;
    let active = true;
    const { region, tasks } = getSearchPlan(submittedKeyword, selectedCategory);

    const run = async () => {
      setSearchState({ results: [], loading: true, error: "" });
      try {
        // 팀원이 기존에 작성한 SDK 로더와 환경변수 사용. 키를 새로 발급하거나 수정하지 않습니다.
        const sdk = await loadKakaoMaps();
        const client =
          new sdk.services.Places() as unknown as KakaoSearchClient;
        const outcomes = await Promise.allSettled(
          tasks.map((task) => keywordSearch(client, task)),
        );
        if (!active) return;
        const successful = outcomes.filter(
          (result): result is PromiseFulfilledResult<KakaoSearchPlace[]> =>
            result.status === "fulfilled",
        );
        if (successful.length === 0) {
          const firstError = outcomes.find(
            (result) => result.status === "rejected",
          );
          const detail =
            firstError?.status === "rejected" &&
            firstError.reason instanceof Error
              ? firstError.reason.message
              : "응답을 받을 수 없습니다.";
          throw new Error(
            `${detail} 카카오맵 권한 및 localhost 등록을 확인해 주세요.`,
          );
        }

        const unique = new Map<string, SavedPlace>();
        successful.forEach(({ value }) => {
          value.forEach((item) => {
            const addr = item.road_address_name || item.address_name || "";
            if (region) {
              const normalizedAddress = NORMALIZE(addr);
              const fullRegion = NORMALIZE(region);
              const shortRegion = NORMALIZE(region.replace(REGION_ENDING, ""));
              if (
                !normalizedAddress.includes(fullRegion) &&
                !normalizedAddress.includes(shortRegion)
              )
                return;
            }
            if (!item.id || !item.place_name) return;
            const converted = toSavedPlace(item);
            unique.set(converted.id, converted);
          });
        });

        // 선택한 카테고리에 맞는 장소만 노출합니다.
        const values = [...unique.values()].filter(
          (place) =>
            selectedCategory === "전체" || place.category === selectedCategory,
        );
        setSearchState({ results: values, loading: false, error: "" });
      } catch (reason) {
        if (!active) return;
        setSearchState({
          results: [],
          loading: false,
          error:
            reason instanceof Error
              ? reason.message
              : "장소 검색 중 오류가 발생했습니다.",
        });
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, [submittedKeyword, selectedCategory]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextKeyword = keyword.trim();
    setSubmittedKeyword(nextKeyword);
  };

  const clearSearch = () => {
    setKeyword("");
    setSubmittedKeyword("");
    setSearchState(EMPTY_SEARCH);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const handleAddPlace = (result: AddPlaceResult) => {
    setAddedPlaces((previous) => ({
      ...previous,
      [result.place.id]: result,
    }));
  };

  useLayoutEffect(() => {
    const list = categoryListRef.current;
    const button = categoryButtonRefs.current[selectedCategory];

    if (!list || !button) return;

    const updateIndicator = () => {
      const listRect = list.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      setIndicatorStyle({
        x: buttonRect.left - listRect.left + list.scrollLeft,
        width: buttonRect.width,
      });
    };

    updateIndicator();

    const observer = new ResizeObserver(updateIndicator);

    observer.observe(list);
    observer.observe(button);

    window.addEventListener("resize", updateIndicator);
    list.addEventListener("scroll", updateIndicator, {
      passive: true,
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateIndicator);
      list.removeEventListener("scroll", updateIndicator);
    };
  }, [selectedCategory]);

  return (
    <S.Page>
      <S.MobileHeaderArea>
        <MobileHeader />
      </S.MobileHeaderArea>

      <S.SidebarArea>
        <MainSidebar />
      </S.SidebarArea>

      <S.MainContent>
        <S.Container>
          <S.BreadcrumbArea>
            <Breadcrumb
              items={[
                { label: "내 여행", to: "/", Icon: House },
                { label: "검색" },
              ]}
            />
          </S.BreadcrumbArea>

          <S.PageTitle>여행지 검색</S.PageTitle>

          <S.SearchForm onSubmit={handleSearch} role="search">
            <SearchIcon size={21} strokeWidth={2} aria-hidden="true" />

            <S.SearchInput
              type="search"
              aria-label="여행지 검색"
              placeholder="여행지나 장소를 검색해보세요"
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value);
                if (!event.target.value.trim()) clearSearch();
              }}
            />

            {keyword && (
              <S.ClearButton
                type="button"
                onClick={clearSearch}
                aria-label="검색어 지우기"
              >
                <X size={19} />
              </S.ClearButton>
            )}
          </S.SearchForm>

          <S.CategoryList ref={categoryListRef} aria-label="장소 카테고리">
            {CATEGORIES.map((category) => (
              <S.CategoryButton
                key={category}
                ref={(element) => {
                  categoryButtonRefs.current[category] = element;
                }}
                type="button"
                $active={selectedCategory === category}
                aria-pressed={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </S.CategoryButton>
            ))}

            <S.CategoryIndicator
              aria-hidden="true"
              style={{
                width: `${indicatorStyle.width}px`,
                transform: `translateX(${indicatorStyle.x}px)`,
                opacity: indicatorStyle.width > 0 ? 1 : 0,
              }}
            />
          </S.CategoryList>

          {submittedKeyword ? (
            <S.ResultsSection
              aria-live="polite"
              aria-busy={searchState.loading}
            >
              <S.ResultsToolbar>
                <S.ResultsCount>
                  {searchState.loading ? (
                    "장소를 검색하는 중이에요…"
                  ) : searchState.error ? (
                    "검색 연결을 확인해 주세요."
                  ) : (
                    <>
                      총 <strong>{results.length}개</strong>의 장소를 찾았어요.
                    </>
                  )}
                </S.ResultsCount>

                <S.SortArea>
                  <Dropdown<SortOption>
                    label="검색 결과 정렬"
                    value={sort}
                    options={SORT_OPTIONS}
                    onChange={setSort}
                  />
                </S.SortArea>
              </S.ResultsToolbar>

              {searchState.error ? (
                <S.EmptyState role="alert">
                  <S.EmptyTitle>장소 검색에 실패했어요</S.EmptyTitle>
                  <S.EmptyDescription>{searchState.error}</S.EmptyDescription>
                </S.EmptyState>
              ) : searchState.loading ? (
                <S.EmptyState role="status">
                  <S.EmptyTitle>장소를 찾고 있어요</S.EmptyTitle>
                  <S.EmptyDescription>
                    카카오맵에서 실제 장소를 검색 중입니다.
                  </S.EmptyDescription>
                </S.EmptyState>
              ) : results.length ? (
                <S.ResultList>
                  {results.map((place) => {
                    const isFavorite = favorites.includes(place.id);
                    const isAdded = Boolean(addedPlaces[place.id]);

                    return (
                      <S.PlaceCard key={place.id}>
                        <S.PlaceImage
                          src={place.image}
                          alt="장소 사진 대신 표시하는 루티 안내 이미지"
                          loading="lazy"
                        />

                        <S.PlaceContent>
                          <S.PlaceHeading>
                            <S.PlaceName>{place.name}</S.PlaceName>
                            <S.CategoryTag>{place.category}</S.CategoryTag>
                          </S.PlaceHeading>

                          <S.PlaceAddress>
                            <MapPin size={14} color="#6478A5" />
                            {place.address}
                          </S.PlaceAddress>

                          <S.PlaceDescription>
                            {place.description}
                          </S.PlaceDescription>
                        </S.PlaceContent>

                        <S.FavoriteButton
                          type="button"
                          aria-label={`${place.name} ${
                            isFavorite ? "저장 취소" : "장소 저장"
                          }`}
                          aria-pressed={isFavorite}
                          onClick={() => toggleFavorite(place.id)}
                          $active={isFavorite}
                        >
                          <Bookmark
                            size={24}
                            fill={isFavorite ? "currentColor" : "none"}
                            strokeWidth={2}
                          />
                        </S.FavoriteButton>

                        <S.CardActions>
                          <S.MapButton
                            type="button"
                            onClick={() => setMapPlace(place)}
                          >
                            <MapIcon size={17} />
                            지도 보기
                          </S.MapButton>

                          <S.AddButton
                            type="button"
                            $added={isAdded}
                            onClick={() => setSelectedPlace(place)}
                          >
                            <Plus size={17} />
                            일정에 추가
                          </S.AddButton>
                        </S.CardActions>
                      </S.PlaceCard>
                    );
                  })}
                </S.ResultList>
              ) : (
                <S.EmptyState>
                  <S.EmptyIcon>
                    <S.MascotImage src={SearchMascot} alt="Routy 마스코트" />
                  </S.EmptyIcon>

                  <S.EmptyTitle>검색 결과가 없어요</S.EmptyTitle>

                  <S.EmptyDescription>
                    다른 검색어나 카테고리로 다시 검색해보세요.
                  </S.EmptyDescription>
                </S.EmptyState>
              )}
            </S.ResultsSection>
          ) : (
            <S.EmptyState aria-live="polite">
              <S.EmptyIcon>
                <S.MascotImage src={SearchMascot} alt="Routy 마스코트" />
              </S.EmptyIcon>

              <S.EmptyTitle>어디로 떠나고 싶으세요?</S.EmptyTitle>

              <S.EmptyDescription>
                도시, 관광지, 음식점, 카페를 검색해보세요.
              </S.EmptyDescription>
            </S.EmptyState>
          )}
        </S.Container>
      </S.MainContent>

      <S.MobileNavArea>
        <MobileNav />
      </S.MobileNavArea>

      {mapPlace && (
        <KakaoSavedPlaceModal
          place={mapPlace}
          onClose={() => setMapPlace(null)}
        />
      )}

      {selectedPlace && (
        <AddPlaceModal
          open={true}
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onAdd={handleAddPlace}
        />
      )}
    </S.Page>
  );
}
