// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Tabs from "./components/Tabs";
import LunchPage from "./pages/LunchPage";
import DinnerPage from "./pages/DinnerPage";
import NightPage from "./pages/NightPage";
import CustomPage from "./pages/CustomPage";

export default function App() {
  return (
    <Layout>
      {/* 탭 메뉴 영역 */}
      <Tabs />

      {/* 메인 컨텐츠: 선택된 탭의 페이지를 렌더링 */}
      <Routes>
        {/* 기본 경로 "/" 접속 시 "/lunch"로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/lunch" />} />
        <Route path="/lunch" element={<LunchPage />} />
        <Route path="/dinner" element={<DinnerPage />} />
        <Route path="/night" element={<NightPage />} />
        <Route path="/custom" element={<CustomPage />} />

        {/* 그 외 경로가 오면 다시 "/lunch" 로 */}
        <Route path="*" element={<Navigate to="/lunch" />} />
      </Routes>
    </Layout>
  );
}
