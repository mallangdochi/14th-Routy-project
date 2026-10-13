import Sidebar from "./components/mysidebar/mysidebar";

function App() {
  return (
    <Sidebar
      onNavigate={(page: string) => console.log("선택한 메뉴:", page)}
      onBack={() => console.log("여행으로 돌아가기")}
      onLogout={() => console.log("로그아웃")}
    />
  );
}

export default App;
