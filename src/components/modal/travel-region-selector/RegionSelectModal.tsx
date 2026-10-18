import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, Circle, MapPin, Search, X } from "lucide-react";
import { RegionSelectStyle } from "./regionSelectStyle";
import {
  filterRegions,
  REGIONS,
  type TravelRegion,
} from "../../../data/regions";
function subscribeMobile(listener: () => void) {
  const media = window.matchMedia("(max-width: 767px)");
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}
function getMobileSnapshot() {
  return window.matchMedia("(max-width: 767px)").matches;
}
interface Props {
  isOpen: boolean;
  value: TravelRegion | null;
  onClose: () => void;
  onConfirm: (region: TravelRegion) => void;
  searchRegions?: (
    query: string,
    signal: AbortSignal,
  ) => Promise<TravelRegion[]>;
  renderMap?: (props: {
    selectedRegion: TravelRegion | null;
    onSelectRegion: (region: TravelRegion) => void;
  }) => ReactNode;
}
export default function RegionSelectModal({ isOpen, ...props }: Props) {
  const [previousOpen, setPreviousOpen] = useState(isOpen);
  const [mounted, setMounted] = useState(isOpen);

  if (previousOpen !== isOpen) {
    setPreviousOpen(isOpen);
    if (isOpen) setMounted(true);
  }

  if (!mounted || typeof document === "undefined") return null;
  return (
    <RegionSelectContent
      {...props}
      isOpen={isOpen}
      onExited={() => setMounted(false)}
    />
  );
}
function RegionSelectContent({
  isOpen,
  onExited,
  onClose,
  onConfirm,
  searchRegions,
  renderMap,
}: Props & { onExited: () => void }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<TravelRegion | null>(null);
  const [response, setResponse] = useState<{
    query: string;
    search: NonNullable<Props["searchRegions"]>;
    results: TravelRegion[];
    error: string;
  } | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const radioName = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const isMobile = useSyncExternalStore(
    subscribeMobile,
    getMobileSnapshot,
    () => false,
  );
  const [view, setView] = useState<"search" | "map">("search");
  const responseMatches =
    response !== null &&
    response.query === query &&
    response.search === searchRegions;
  const hasQuery = query.trim().length > 0;
  const loading = Boolean(hasQuery && searchRegions && !responseMatches);
  const error = hasQuery && responseMatches ? response.error : "";
  const results = !hasQuery
    ? []
    : searchRegions
      ? responseMatches
        ? filterRegions(response.results, query)
        : []
      : filterRegions(REGIONS, query);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    if (!searchRegions || !query.trim()) return;
    const search = searchRegions;
    const controller = new AbortController();
    let active = true;
    const timer = window.setTimeout(async () => {
      try {
        const regions = await search(query.trim(), controller.signal);
        if (!active) return;
        setResponse({
          query,
          search,
          results: regions,
          error: "",
        });
      } catch {
        if (!active || controller.signal.aborted) return;
        setResponse({
          query,
          search,
          results: [],
          error: "지역을 불러오지 못했어요. 검색어를 다시 입력해주세요.",
        });
      }
    }, 300);
    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, searchRegions]);
  const showSearch = () => {
    setView("search");
    requestAnimationFrame(() =>
      inputRef.current?.focus({ preventScroll: true }),
    );
  };
  const confirm = () => {
    if (!selected) return;
    onConfirm(selected);
    onClose();
  };
  const status = !hasQuery
    ? "여행할 지역명을 입력해주세요."
    : loading
      ? "지역을 검색하고 있어요."
      : error || (results.length === 0 ? "일치하는 지역이 없어요." : "");
  return createPortal(
    <RegionSelectStyle
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="region-dialog"
        data-open={isOpen}
        inert={!isOpen}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget && !isOpen) {
            onExited();
          }
        }}
        data-view={view}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        // onKeyDown={(event) => {
        //   if (event.key === "Escape") {
        //     event.preventDefault();
        //     event.stopPropagation();
        //     if (isMobile && view === "map") showSearch();
        //     else onClose();
        //     return;
        //   }
        //   if (event.key !== "Tab") return;
        //   const nodes = Array.from(
        //     dialogRef.current?.querySelectorAll<HTMLElement>(
        //       'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]',
        //     ) ?? [],
        //   ).filter(
        //     (node) =>
        //       node.getClientRects().length > 0 && !node.closest("[inert]"),
        //   );
        //   const first = nodes[0];
        //   const last = nodes[nodes.length - 1];
        //   if (event.shiftKey && document.activeElement === first) {
        //     event.preventDefault();
        //     last?.focus();
        //   } else if (!event.shiftKey && document.activeElement === last) {
        //     event.preventDefault();
        //     first?.focus();
        //   }
        // }}
        onKeyDown={(event) => {
          if (
            !isOpen ||
            event.nativeEvent.isComposing ||
            event.keyCode === 229
          ) {
            return;
          }

          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            onClose();
            return;
          }

          if (event.key === "Enter") {
            event.preventDefault();
            event.stopPropagation();

            if (!event.repeat && selected) {
              confirm();
            }

            return;
          }

          if (event.key !== "Tab") return;

          const nodes = Array.from(
            dialogRef.current?.querySelectorAll<HTMLElement>(
              'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]',
            ) ?? [],
          ).filter(
            (node) =>
              node.getClientRects().length > 0 && !node.closest("[inert]"),
          );

          const first = nodes[0];
          const last = nodes[nodes.length - 1];

          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
      >
        <header className="region-header">
          <button
            ref={backRef}
            className="back-button icon-button"
            type="button"
            onClick={() => (view === "map" ? showSearch() : onClose())}
            aria-label={
              view === "map" ? "지역 검색으로 돌아가기" : "지역 선택 취소"
            }
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <div className="heading-copy">
            <h2 id={titleId}>
              {isMobile && view === "map" ? "지역 확인" : "여행 지역 선택"}
            </h2>
            <p id={descriptionId}>지역을 검색하고 지도에서 확인해주세요.</p>
          </div>
          <button
            className="close-button icon-button"
            type="button"
            onClick={onClose}
            aria-label="지역 선택 닫기"
          >
            <X aria-hidden="true" />
          </button>
        </header>

        <div className="region-content">
          <section className="region-search-panel" aria-label="지역 검색">
            <div className="search-field">
              <Search aria-hidden="true" size={20} />
              <input
                ref={inputRef}
                aria-label="여행 지역 검색"
                placeholder="여행할 지역을 검색해주세요"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  if (listRef.current) listRef.current.scrollTop = 0;
                }}
              />
              {/* <button
                type="button"
                className="icon-button clear-button"
                aria-label="검색어 지우기"
                disabled={!query}
                onClick={() => {
                  setQuery("");
                  if (listRef.current) listRef.current.scrollTop = 0;
                  inputRef.current?.focus({ preventScroll: true });
                }}
              >
              */}
              <button
                type="button"
                className="icon-button clear-button"
                aria-label="검색어와 선택 지역 초기화"
                disabled={!query && !selected}
                onClick={() => {
                  setQuery("");
                  setSelected(null);
                  setResponse(null);

                  if (listRef.current) {
                    listRef.current.scrollTop = 0;
                  }

                  showSearch();
                }}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <p className="results-caption" role="status">
              {hasQuery && !loading && !error
                ? `검색 결과 ${results.length}개`
                : "검색 결과"}
            </p>
            <div className="region-results" ref={listRef} aria-busy={loading}>
              {status ? (
                <div className="search-empty" role="status">
                  <Search size={30} aria-hidden="true" />
                  <p>{status}</p>
                </div>
              ) : (
                <div role="radiogroup" aria-label="지역 검색 결과">
                  {results.map((region) => (
                    <label
                      className="region-result"
                      key={region.id}
                      data-selected={selected?.id === region.id}
                    >
                      <input
                        type="radio"
                        name={radioName}
                        checked={selected?.id === region.id}
                        onChange={() => setSelected(region)}
                      />
                      <MapPin aria-hidden="true" size={20} />
                      <span className="result-copy">
                        <strong>{region.name}</strong>
                        <span>{region.country}</span>
                      </span>
                      <span className="selection-indicator" aria-hidden="true">
                        {selected?.id === region.id && (
                          <Circle
                            size={14}
                            fill="currentColor"
                            strokeWidth={0}
                          />
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </section>
          <section className="region-map" aria-label="선택한 지역 지도">
            {(!isMobile || view === "map") &&
              (renderMap ? (
                renderMap({
                  selectedRegion: selected,
                  onSelectRegion: setSelected,
                })
              ) : (
                <div className="map-placeholder">
                  <MapPin size={40} aria-hidden="true" />
                  <strong>
                    {selected?.name ?? "여행할 지역을 선택해주세요"}
                  </strong>
                  <span>지도 미리보기 준비 중</span>
                </div>
              ))}
          </section>
        </div>

        <footer className="region-footer">
          <div className="selected-copy" aria-live="polite">
            <span>선택한 지역</span>
            <strong title={selected?.name} data-empty={!selected}>
              {selected?.name ?? "아직 선택한 지역이 없어요"}
            </strong>
          </div>
          {/* {isMobile && view === "map" && (
            <button type="button" className="search-again" onClick={showSearch}>
              <ChevronLeft size={16} aria-hidden="true" />
              지역 다시 검색
            </button>
          )} */}
          <div className="footer-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              취소
            </button>
            <button
              type="button"
              className="confirm-button"
              disabled={!selected}
              onClick={() => {
                if (isMobile && view === "search") {
                  inputRef.current?.blur();
                  setView("map");
                  requestAnimationFrame(() =>
                    backRef.current?.focus({ preventScroll: true }),
                  );
                } else confirm();
              }}
            >
              {isMobile && view === "search"
                ? "지도에서 확인"
                : "이 지역으로 선택"}
            </button>
          </div>
        </footer>
      </div>
    </RegionSelectStyle>,
    document.body,
  );
}
