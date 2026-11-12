import React, { useState } from 'react';
import { 
  Sprout, 
  LayoutDashboard, 
  ScanLine, 
  Activity, 
  FlaskConical, 
  Pill, 
  MessageSquareText, 
  MapPin, 
  Menu, 
  X, 
  PhoneCall,
  Languages
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, language, setLanguage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: language === 'te' ? 'హోమ్' : 'Home', icon: Sprout },
    { id: 'dashboard', label: language === 'te' ? 'డ్యాష్‌బోర్డ్' : 'Dashboard', icon: LayoutDashboard },
    { id: 'crop-id', label: language === 'te' ? 'పంట గుర్తింపు' : 'Crop ID', icon: ScanLine },
    { id: 'disease-detect', label: language === 'te' ? 'తెగుళ్ళ నిర్ధారణ' : 'Disease Detection', icon: Activity },
    { id: 'soil-analysis', label: language === 'te' ? 'భూసార పరీక్ష' : 'Soil Analysis', icon: FlaskConical },
    { id: 'recommendations', label: language === 'te' ? 'ఎరువులు & మందులు' : 'Recommendations', icon: Pill },
    { id: 'assistant', label: language === 'te' ? 'రైతు సలహాదారు' : 'AI Assistant', icon: MessageSquareText },
    { id: 'my-farm', label: language === 'te' ? 'నా పొలం' : 'My Farm', icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
      {/* Top emergency announcement bar */}
      <div className="bg-gradient-to-r from-agri-800 via-agri-700 to-agri-800 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              {language === 'te' 
                ? 'భారతీయ రైతుల కోసం ఏఐ ఆధారిత ఆధునిక వ్యవసాయ వేదిక - అగ్రిస్మార్ట్ ఏఐ' 
                : 'AI-Powered Smart Indian Agriculture Assistance Platform • ICAR & CIBRC Aligned'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-agri-100">
            <a 
              href="tel:18001801551" 
              className="flex items-center gap-1.5 hover:text-white transition-colors bg-white/10 px-2 py-0.5 rounded-full"
            >
              <PhoneCall className="w-3 h-3 text-emerald-300" />
              <span>{language === 'te' ? 'కిసాన్ కాల్ సెంటర్:' : 'Kisan Call Centre:'} <strong>1800-180-1551</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActivePage('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agri-600 to-agri-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-stone-900">AgriSmart</span>
                <span className="text-xs font-semibold uppercase tracking-wider bg-agri-100 text-agri-800 px-1.5 py-0.5 rounded">AI</span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                {language === 'te' ? 'రైతు బాంధవి • స్మార్ట్ వ్యవసాయం' : 'Empowering Indian Farmers'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-agri-100/90 text-agri-900 shadow-sm font-semibold'
                      : 'text-stone-600 hover:text-agri-800 hover:bg-stone-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-agri-700' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Language Switcher */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs font-medium">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-white text-agri-900 font-semibold shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  language === 'te'
                    ? 'bg-agri-700 text-white font-semibold shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                తెలుగు
              </button>
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
              className="px-2 py-1 bg-stone-100 rounded text-xs font-bold text-agri-800 border border-stone-200"
            >
              {language === 'en' ? 'తెలుగు' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-agri-100 text-agri-900 font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-agri-700' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
