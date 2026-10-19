import { Routes, Route, Navigate, useNavigate } from "react-router";
import RoutyBookLogin from "./components/RoutyBookLogin/RoutyBookLogin";
import SchedulePage from "./pages/travelSchedulePage/SchedulePage";
import MyTripsPage from "./pages/mainPage/MyTripsPages";
import CreateTripPage from "./pages/newTravelPage/CreateTripPage";
import MyPage from "./page/mypage/mypage";

function CreateTripRoute() {
  const navigate = useNavigate();

  return <CreateTripPage onCancel={() => navigate(-1)} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MyTripsPage />} />
      <Route path="/trips/new" element={<CreateTripRoute />} />
      <Route path="/schedule" element={<SchedulePage />} />

      <Route
        path="/mypage"
        element={<Navigate to="/mypage/profile" replace />}
      />
      <Route path="/mypage/profile" element={<MyPage />} />
      <Route path="/mypage/security" element={<MyPage />} />
      <Route path="/mypage/security/edit" element={<MyPage />} />
      <Route path="/mypage/security/password" element={<MyPage />} />
      <Route path="/mypage/settings" element={<MyPage />} />
      <Route path="/mypage/support" element={<MyPage />} />

      <Route element={<RoutyBookLogin />}>
        <Route path="/login" element={null} />
        <Route path="/signup" element={null} />
      </Route>
    </Routes>
  );
}
