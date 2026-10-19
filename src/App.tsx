import { Routes, Route, useNavigate } from "react-router";
import RoutyBookLogin from "./components/RoutyBookLogin/RoutyBookLogin";
import SchedulePage from "./pages/travelSchedulePage/SchedulePage";
import MyTripsPage from "./pages/mainPage/MyTripsPages";
import CreateTripPage from "./pages/newTravelPage/CreateTripPage";

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

      {/* 두 주소가 같은 여권 컴포넌트를 공유 */}
      <Route element={<RoutyBookLogin />}>
        <Route path="/login" element={null} />
        <Route path="/signup" element={null} />
      </Route>
    </Routes>
  );
}
