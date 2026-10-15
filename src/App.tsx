import { Routes, Route } from "react-router";

import Loader from "./components/loader/Loader";
import MobileNav from "./components/mobileBanner/MobileFooter";
import MobileHeader from "./components/mobileBanner/MobileHeader";

import RoutyBookLogin from "./components/RoutyBookLogin/RoutyBookLogin";

function MainPage() {
  return (
    <>
      <MobileHeader />
      <Loader />
      <MobileNav />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />

      {/* 두 주소가 같은 여권 컴포넌트를 공유 */}
      <Route element={<RoutyBookLogin />}>
        <Route path="/login" element={null} />
        <Route path="/signup" element={null} />
      </Route>
    </Routes>
  );
}
