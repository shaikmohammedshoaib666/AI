import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import CropDetectionPage from './pages/CropDetectionPage';
import DiseaseDetectionPage from './pages/DiseaseDetectionPage';
import SoilAnalysisPage from './pages/SoilAnalysisPage';
import RecommendationsPage from './pages/RecommendationsPage';
import AssistantPage from './pages/AssistantPage';
import MyFarmPage from './pages/MyFarmPage';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('agrismart_lang') || 'en';
  });

  const handleSetLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('agrismart_lang', lang);
  };

  // Scroll to top on page switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage setActivePage={setActivePage} language={language} />;
      case 'dashboard':
        return <DashboardPage setActivePage={setActivePage} language={language} />;
      case 'crop-id':
        return <CropDetectionPage setActivePage={setActivePage} language={language} />;
      case 'disease-detect':
        return <DiseaseDetectionPage setActivePage={setActivePage} language={language} />;
      case 'soil-analysis':
        return <SoilAnalysisPage setActivePage={setActivePage} language={language} />;
      case 'recommendations':
        return <RecommendationsPage language={language} />;
      case 'assistant':
        return <AssistantPage language={language} setLanguage={handleSetLanguage} />;
      case 'my-farm':
        return <MyFarmPage language={language} />;
      default:
        return <HomePage setActivePage={setActivePage} language={language} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf7] text-stone-900 font-sans">
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        language={language} 
        setLanguage={handleSetLanguage} 
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>

      <Footer language={language} />
    </div>
  );
}
