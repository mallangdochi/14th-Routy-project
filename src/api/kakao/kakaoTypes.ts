/**
 * 카카오맵 JavaScript SDK에서 ROUTY가 사용하는 타입 정의입니다.
 * 다른 지도 컴포넌트와 Window.kakao 전역 선언이 충돌하지 않도록
 * 이 파일에서는 Window 인터페이스를 확장하지 않습니다.
 */

export type Coordinate = {
  getLat: () => number;
  getLng: () => number;
};

export type MapInstance = {
  relayout: () => void;
  getLevel: () => number;
  setLevel: (level: number, options?: { animate: boolean }) => void;
  setBounds: (bounds: BoundsInstance, padding?: number) => void;
  setCenter: (position: Coordinate) => void;
};

export type BoundsInstance = {
  extend: (position: Coordinate) => void;
};

export type OverlayInstance = {
  setMap: (map: MapInstance | null) => void;
};

export type PlaceResult = {
  x: string;
  y: string;
  place_name: string;
};

export type KakaoMapsSDK = {
  load: (callback: () => void) => void;

  Map: new (
    node: HTMLElement,
    options: {
      center: Coordinate;
      level: number;
    },
  ) => MapInstance;

  LatLng: new (latitude: number, longitude: number) => Coordinate;

  LatLngBounds: new () => BoundsInstance;

  CustomOverlay: new (options: {
    map: MapInstance;
    position: Coordinate;
    content: HTMLElement;
    yAnchor: number;
    zIndex: number;
  }) => OverlayInstance;

  Polyline: new (options: {
    map: MapInstance;
    path: Coordinate[];
    strokeWeight: number;
    strokeColor: string;
    strokeOpacity: number;
    strokeStyle: string;
  }) => OverlayInstance;

  services: {
    Places: new () => {
      keywordSearch: (
        query: string,
        callback: (places: PlaceResult[], status: string) => void,
        options?: {
          location?: Coordinate;
        },
      ) => void;
    };

    Status: {
      OK: string;
    };
  };
};
