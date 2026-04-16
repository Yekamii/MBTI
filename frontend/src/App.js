import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop"; 
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sources from "./components/Sources";
import ResearchTicker from "./components/ResearchTicker";

// comp
import HeroSection from "./components/HeroSection"; 
import MBTIDimensions from "./components/MBTIDimensions";
import EIArticle from "./components/EIArticle";
import SNArticle from "./components/SNArticle";
import TFArticle from "./components/TFArticle";
import JPArticle from "./components/JPArticle";
import ArticlesPage from "./components/ArticlesPage";
import ArticleDetail from "./components/ArticleDetail";
import StartTest from "./components/test/StartTest";
import TestFlow from "./components/test/TestFlow";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";
import FinalResults from "./components/test/FinalResult";

// Import AuthContext
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Header />
        <ResearchTicker />
        <main className="main-content">
          <Routes>
            {/* მთავარი */}
            <Route path="/" element={<HeroSection />} />
            <Route path="/sources" element={<Sources />} />
            {/* განზომილებები */}
            <Route path="/mbti-dimensions" element={<MBTIDimensions />} />
            <Route path="/ei" element={<EIArticle />} />
            <Route path="/sn" element={<SNArticle />} />
            <Route path="/tf" element={<TFArticle />} />
            <Route path="/jp" element={<JPArticle />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<ArticleDetail />} />
            <Route path="/start-test" element={<StartTest />} />
            <Route path="/test" element={<TestFlow />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/result" element={<FinalResults />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;