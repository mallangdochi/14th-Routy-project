import { Routes, Route, Navigate, useNavigate, useParams } from "react-router";

import RoutyBookLogin from "./components/RoutyBookLogin/RoutyBookLogin";
import SchedulePage from "./pages/travelSchedulePage/SchedulePage";
import MyTripsPage from "./pages/mainPage/MyTripsPages";
import CreateTripPage from "./pages/newTravelPage/CreateTripPage";
import MyPage from "./pages/mypage/MyPage";
import SavedPage from "./pages/savedPage/SavedPage";
import PlaceDetailPage from "./pages/placeDetailPage/PlaceDetailPage";
import TripDaysPage from "./pages/travelTimetablePage/TimetablePage";
import Search from "./components/search/Search";
import Schedule from "./components/Schedule/Schedule";
import TravelBudgetStatsPage from "./components/travelBudget/TravelBudgetStatsPage";

function CreateTripRoute() {
  const navigate = useNavigate();

  return <CreateTripPage onCancel={() => navigate(-1)} />;
}

function ScheduleRoute() {
  const { tripId } = useParams<{ tripId: string }>();

  return <Schedule key={tripId} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MyTripsPage />} />
      <Route path="/trips/new" element={<CreateTripRoute />} />

      <Route path="/trip-schedule/:tripId" element={<ScheduleRoute />} />

      <Route
        path="/trip-schedule/:tripId/budget/stats"
        element={<TravelBudgetStatsPage />}
      />

      <Route path="/schedule" element={<SchedulePage />} />
      <Route path="/saved" element={<SavedPage />} />
      <Route path="/place/detail" element={<PlaceDetailPage />} />
      <Route path="/trips/:tripId" element={<TripDaysPage />} />
      <Route path="/search" element={<Search />} />

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
