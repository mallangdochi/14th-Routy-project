import { AirplaneLoaderStyle, Description } from "./loaderStyle";

export default function Loader() {
  return (
    <AirplaneLoaderStyle role="status" aria-live="polite">
      <div className="loader-graphic" aria-hidden="true">
        <div className="loader-track" />

        <div className="loader-orbit">
          <div className="loader-tail" />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="loader-plane"
            viewBox="0 0 16 16"
          >
            <path
              fill="var(--loader-pin-background)"
              d="M8 .5C7 .5 6.5 2 6.5 3v4L1.05 9.72a1 1 0 0 0-.55.9V12l6-.999.5 3L5.5 15.5h5L9 14l.5-3 6 1v-1.38a1 1 0 0 0-.55-.9L9.5 7V3C9.5 2 9 .5 8 .5Z"
            />

            <path
              fill="currentColor"
              d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849m.894.448C7.111 2.02 7 2.569 7 3v4a.5.5 0 0 1-.276.447l-5.448 2.724a.5.5 0 0 0-.276.447v.792l5.418-.903a.5.5 0 0 1 .575.41l.5 3a.5.5 0 0 1-.14.437L6.708 15h2.586l-.647-.646a.5.5 0 0 1-.14-.436l.5-3a.5.5 0 0 1 .576-.411L15 11.41v-.792a.5.5 0 0 0-.276-.447L9.276 7.447A.5.5 0 0 1 9 7V3c0-.432-.11-.979-.322-1.401C8.458 1.159 8.213 1 8 1s-.458.158-.678.599"
            />
          </svg>
        </div>

        <div className="loader-pin">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-geo-alt"
            viewBox="0 0 16 16"
          >
            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
          </svg>
        </div>
      </div>

      <Description>
        <p className="bold">여행을 준비하고 있어요</p>
        <p>잠시만 기다려 주세요 ...</p>
      </Description>
    </AirplaneLoaderStyle>
  );
}
