import {
  useMemo,
  useState,
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
import * as S from "./SearchStyle";

import {
  mockSavedPlaces,
  type SavedPlace,
  type PlaceCategory,
} from "../../data/saved";

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

  const results = useMemo(() => {
    const words = submittedKeyword
      .toLocaleLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 0) return [];

    const matches = mockSavedPlaces.filter((place) => {
      if (selectedCategory !== "전체" && place.category !== selectedCategory) {
        return false;
      }

      const searchable = [
        place.name,
        place.category,
        place.address,
        place.description,
      ]
        .join(" ")
        .toLocaleLowerCase();

      return words.every((word) => searchable.includes(word));
    });

    return sort === "이름순"
      ? [...matches].sort((a, b) => a.name.localeCompare(b.name, "ko"))
      : matches;
  }, [submittedKeyword, selectedCategory, sort]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedKeyword(keyword.trim());
  };

  const clearSearch = () => {
    setKeyword("");
    setSubmittedKeyword("");
  };

  const toggleFavorite = (id: string) => {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const handleAddPlace = (result: AddPlaceResult) => {
    // 검색 페이지 내 추가 완료 표시용 상태. 실제 일정 저장은 앱의 데이터 계층과 별도 연결 필요.
    setAddedPlaces((previous) => ({ ...previous, [result.place.id]: result }));
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
    list.addEventListener("scroll", updateIndicator, { passive: true });

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
                setSubmittedKeyword(event.target.value.trim());
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
            <S.ResultsSection aria-live="polite">
              <S.ResultsToolbar>
                <S.ResultsCount>
                  총 <strong>{results.length}개</strong>의 장소를 찾았어요.
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

              {results.length ? (
                <S.ResultList>
                  {results.map((place) => {
                    const isFavorite = favorites.includes(place.id);
                    const isAdded = Boolean(addedPlaces[place.id]);

                    return (
                      <S.PlaceCard key={place.id}>
                        <S.PlaceImage
                          src={place.image}
                          alt={`${place.name} 이미지`}
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
