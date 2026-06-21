import { HashRouter, Routes, Route } from "react-router-dom";
import VideoLearningPage from "./pages/VideoLearningPage";
import ChannelPage from "./pages/ChannelPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<VideoLearningPage />} />
        <Route path="/channel/:channelName" element={<ChannelPage />} />
      </Routes>
    </HashRouter>
  );
}
