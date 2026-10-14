// import Loader from "./components/loader/Loader";
// import MainSidebar from "./components/MainSidebar/MainSidebar";
// import MobileNav from "./components/mobileBanner/MobileFooter";
// import MobileHeader from "./components/mobileBanner/MobileHeader";
// import Sidebar from "./components/mysidebar/mysidebar";

import MyTripsPage from "./pages/mainPage/MyTripsPages";

function App() {
  return (
    <>
      <MyTripsPage />

      {/* <MobileHeader /> */}
      {/* <Sidebar
      onNavigate={(page: string) => console.log("선택한 메뉴:", page)}
      onBack={() => console.log("여행으로 돌아가기")}
      onLogout={() => console.log("로그아웃")}
    /> */}
      {/* <MainSidebar /> */}
      {/* <Loader /> */}
      {/* <MobileNav /> */}
    </>
  );
}

export default App;
