import React, { useState } from "react";
import { Newspaper, Briefcase, Info, User, LogOut, Menu, X, Search, Settings, Bell } from "lucide-react";
import { User as UserType, Opportunity } from "../types";
interface HeaderProps {
  activeTab: "home" | "news" | "opportunities" | "about" | "dashboard" | "admin";
  setActiveTab: (tab: "home" | "news" | "opportunities" | "about" | "dashboard" | "admin") => void;
  currentUser: UserType | null;
  onLogout: () => void;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
  allOpps?: Opportunity[];
  lastOppsVisit?: string;
  onMarkNotificationsAsRead?: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  setSearchQuery,
  searchQuery,
  allOpps = [],
  lastOppsVisit,
  onMarkNotificationsAsRead
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState(searchQuery);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  // Filter new opportunities published since last visit
  const newOpps = allOpps.filter(opp => {
    if (!lastOppsVisit) return true;
    return new Date(opp.createdAt).getTime() > new Date(lastOppsVisit).getTime();
  });

  const newOppsCount = newOpps.length;

  const renderNotificationDropdown = () => {
    if (!notificationDropdownOpen) return null;
    return (
      <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-3 animate-fadeIn">
        <div className="px-4 pb-2 border-b border-gray-100 flex justify-between items-center">
          <span className="text-[10px] font-black text-gray-900 uppercase tracking-wider">
            Nouvelles Offres ({newOppsCount})
          </span>
          {newOppsCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkNotificationsAsRead?.();
                setNotificationDropdownOpen(false);
              }}
              className="text-[10px] text-[#138A0A] hover:underline font-bold focus:outline-none"
            >
              Tout marquer lu
            </button>
          )}
        </div>
        
        <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
          {newOpps.length > 0 ? (
            newOpps.map((opp) => (
              <div
                key={opp.id}
                onClick={() => {
                  setActiveTab("opportunities");
                  setNotificationDropdownOpen(false);
                  // Highlight or select this opportunity
                  setTimeout(() => {
                    const card = document.getElementById(`opp-card-${opp.id}`);
                    if (card) card.click();
                  }, 150);
                }}
                className="p-3 hover:bg-gray-50 cursor-pointer transition-colors text-left space-y-1"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[9px] font-bold text-[#138A0A] bg-emerald-50 px-1.5 py-0.5 rounded uppercase">
                    {opp.category}
                  </span>
                  <span className="text-[9px] text-gray-400 font-mono">
                    {new Date(opp.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 hover:text-[#138A0A]">
                  {opp.title}
                </h4>
                {opp.company && (
                  <p className="text-[10px] text-gray-500 font-medium">
                    {opp.company} • {opp.country}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="py-8 text-center px-4 space-y-2">
              <span className="text-2xl">🎉</span>
              <p className="text-[11px] text-gray-400 italic">
                Aucune nouvelle opportunité depuis votre dernière visite.
              </p>
            </div>
          )}
        </div>
        
        <div className="px-4 pt-2 border-t border-gray-100 text-center">
          <button
            onClick={() => {
              setActiveTab("opportunities");
              setNotificationDropdownOpen(false);
            }}
            className="text-[11px] text-[#138A0A] hover:text-[#0f6f08] font-bold uppercase tracking-wider w-full py-1.5 transition-colors focus:outline-none"
          >
            Voir toutes les opportunités
          </button>
        </div>
      </div>
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(headerSearch);
    if (activeTab !== "news" && activeTab !== "opportunities") {
      setActiveTab("news");
    }
  };

  const navItems = [
    { id: "home", label: "Accueil", icon: Newspaper },
    { id: "news", label: "Actualités", icon: Newspaper },
    { id: "opportunities", label: "Opportunités", icon: Briefcase },
    { id: "about", label: "À propos", icon: Info },
  ] as const;

  const getFrenchDate = () => {
    try {
      const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
      const dateStr = new Date().toLocaleDateString("fr-FR", options);
      return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    } catch (e) {
      return "Jeudi 25 Juin 2026";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      {/* TOP BAR */}
      <div className="bg-[#138A0A] text-white px-4 sm:px-6 lg:px-8 py-1.5 flex justify-between items-center text-[11px] font-semibold tracking-wide border-b border-emerald-700">
        <div className="flex gap-4">
          <span className="font-mono">{getFrenchDate()}</span>
          <span className="opacity-90 hidden sm:inline">Cotonou, Bénin • 31°C</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D62828] animate-pulse"></span>
            <span className="font-mono tracking-wider uppercase text-[10px]">DIRECT INFO</span>
          </span>
          {currentUser ? (
            <span onClick={() => setActiveTab("dashboard")} className="hover:text-[#F5B400] cursor-pointer transition-colors">
              Mon Compte
            </span>
          ) : (
            <div className="flex gap-3">
              <span onClick={() => setActiveTab("dashboard")} className="hover:text-[#F5B400] cursor-pointer transition-colors">
                Se connecter
              </span>
              <span onClick={() => setActiveTab("dashboard")} className="bg-white/20 px-2 py-0.5 rounded cursor-pointer hover:bg-white/30 transition-all">
                S'inscrire
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div 
            className="flex items-center gap-3 cursor-pointer select-none hover:opacity-90 transition-opacity"
            onClick={() => { setActiveTab("home"); setSearchQuery(""); setHeaderSearch(""); }}
            id="logo-container"
          >
            <img 
              src="/logo.png" 
              alt="Alerte Bénin Logo" 
              className="h-10 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Desktop Search */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative max-w-xs w-full mx-4">
            <input
              type="text"
              placeholder="Rechercher actualités, bourses..."
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-full focus:bg-white focus:outline-none focus:border-[#138A0A] focus:ring-1 focus:ring-[#138A0A] transition-all"
            />
            <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-gray-400" />
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-bold uppercase tracking-widest">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setSearchQuery(""); setHeaderSearch(""); }}
                  className={`py-2 transition-all border-b-2 hover:text-[#138A0A] duration-200 ${
                    isActive
                      ? "text-[#138A0A] border-[#138A0A]"
                      : "text-gray-600 border-transparent hover:border-[#138A0A]/40"
                  }`}
                  id={`nav-item-${item.id}`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Auth Button and Menu for Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Bell notification container */}
            <div className="relative">
              <button
                onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                className={`p-2 text-gray-500 hover:text-[#138A0A] hover:bg-gray-50 rounded-full transition-all relative ${
                  notificationDropdownOpen ? "text-[#138A0A] bg-gray-50" : ""
                }`}
                id="desktop-bell-btn"
                title="Notifications"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                {newOppsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#D62828] text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                    {newOppsCount}
                  </span>
                )}
              </button>
              {renderNotificationDropdown()}
            </div>

            {currentUser ? (
              <div className="flex items-center space-x-2">
                {currentUser.role === "admin" && (
                  <button
                    onClick={() => setActiveTab("admin")}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      activeTab === "admin"
                        ? "bg-[#222222] border-[#222222] text-white"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                    id="admin-dashboard-btn"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span>Admin Panel</span>
                  </button>
                )}
                
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all ${
                    activeTab === "dashboard"
                      ? "bg-emerald-50 border-emerald-200 text-[#138A0A] font-semibold"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                  id="user-profile-btn"
                >
                  <img
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.fullname}`}
                    alt={currentUser.fullname}
                    className="h-5 w-5 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs font-medium max-w-[120px] truncate">{currentUser.fullname.split(" ")[0]}</span>
                </button>

                <button
                  onClick={onLogout}
                  title="Se déconnecter"
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  id="logout-btn"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab("dashboard")}
                className="flex items-center space-x-1.5 px-4 py-1.5 bg-[#138A0A] hover:bg-[#0f6f08] text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all"
                id="header-login-btn"
              >
                <User className="h-3.5 w-3.5" />
                <span>Mon Espace</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Mobile Bell notification container */}
            <div className="relative">
              <button
                onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                className={`p-1.5 text-gray-500 hover:text-[#138A0A] hover:bg-gray-50 rounded-full transition-all relative ${
                  notificationDropdownOpen ? "text-[#138A0A] bg-gray-50" : ""
                }`}
                id="mobile-bell-btn"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {newOppsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[#D62828] text-[8px] font-bold text-white flex items-center justify-center animate-pulse">
                    {newOppsCount}
                  </span>
                )}
              </button>
              {renderNotificationDropdown()}
            </div>

            {currentUser && (
              <button
                onClick={() => setActiveTab("dashboard")}
                className="p-1 rounded-full border border-gray-200 hover:bg-gray-50"
              >
                <img
                  src={currentUser.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar"}
                  alt={currentUser.fullname}
                  className="h-7 w-7 rounded-full"
                  referrerPolicy="no-referrer"
                />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-500 hover:text-[#138A0A] hover:bg-gray-50 rounded-lg"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg animate-fadeIn">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="flex items-center relative mb-4">
              <input
                type="text"
                placeholder="Rechercher..."
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#138A0A]"
              />
              <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-gray-400" />
            </form>

            {/* Navigation links */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSearchQuery("");
                    setHeaderSearch("");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? "text-[#138A0A] bg-emerald-50"
                      : "text-gray-700 hover:text-[#138A0A] hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Action buttons based on auth state */}
            {currentUser ? (
              <div className="pt-3 border-t border-gray-100 space-y-2">
                {currentUser.role === "admin" && (
                  <button
                    onClick={() => {
                      setActiveTab("admin");
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Tableau de Bord Administrateur</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setActiveTab("dashboard");
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-semibold text-[#138A0A] bg-emerald-50/50 hover:bg-emerald-50 rounded-lg"
                >
                  <User className="h-4 w-4" />
                  <span>Mon Profil ({currentUser.fullname})</span>
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Se déconnecter</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center space-x-2 w-full mt-2 py-2.5 bg-[#138A0A] hover:bg-[#0f6f08] text-white text-sm font-semibold rounded-lg shadow-sm"
              >
                <User className="h-4 w-4" />
                <span>Espace Connexion / Inscription</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
