import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Newspaper, Briefcase, Mail, Send, Check, Bell, Award, ArrowRight } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import ArticleCard from "./components/ArticleCard";
import OpportunityCard from "./components/OpportunityCard";
import NewsSection from "./components/NewsSection";
import OpportunitiesSection from "./components/OpportunitiesSection";
import AboutContactSection from "./components/AboutContactSection";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import { User, Article, Opportunity } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "news" | "opportunities" | "about" | "dashboard" | "admin">("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [savedOpps, setSavedOpps] = useState<string[]>([]);
  
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("alerte_benin_dark_mode") === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("alerte_benin_dark_mode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("alerte_benin_dark_mode", "false");
    }
  }, [darkMode]);
  
  // Home listings
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [recentOpps, setRecentOpps] = useState<Opportunity[]>([]);
  const [allOpps, setAllOpps] = useState<Opportunity[]>([]);
  const [lastOppsVisit, setLastOppsVisit] = useState<string>(() => localStorage.getItem("alerte_benin_last_opps_visit") || "");
  const [homeLoading, setHomeLoading] = useState(false);

  // Newsletter subscription
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  // Load user session on startup
  useEffect(() => {
    const token = localStorage.getItem("alerte_benin_token");
    if (token) {
      fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Token expiré");
      })
      .then(data => {
        setCurrentUser(data);
        setSavedOpps(data.savedOpportunities || []);
      })
      .catch(() => {
        localStorage.removeItem("alerte_benin_token");
        setCurrentUser(null);
      });
    }

    // Initialize last visit timestamp to 3 days ago for demo notifications if not set
    if (!localStorage.getItem("alerte_benin_last_opps_visit")) {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
      localStorage.setItem("alerte_benin_last_opps_visit", threeDaysAgo);
      setLastOppsVisit(threeDaysAgo);
    }

    // Fetch home page data
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setHomeLoading(true);
    try {
      // Recent 3 articles
      const artRes = await fetch("/api/articles?status=published&limit=3");
      if (artRes.ok) {
        setRecentArticles(await artRes.json());
      }
      // Fetch all opportunities to compute notifications and recent list
      const oppRes = await fetch("/api/opportunities");
      if (oppRes.ok) {
        const data = await oppRes.json();
        setRecentOpps(data.slice(0, 3));
        setAllOpps(data);
      }
    } catch (err) {
      console.error("Erreur de chargement de la page d'accueil", err);
    } finally {
      setHomeLoading(false);
    }
  };

  // Reset notification count when viewing opportunities tab
  useEffect(() => {
    if (activeTab === "opportunities") {
      const now = new Date().toISOString();
      localStorage.setItem("alerte_benin_last_opps_visit", now);
      setLastOppsVisit(now);
    }
  }, [activeTab]);

  const handleMarkNotificationsAsRead = () => {
    const now = new Date().toISOString();
    localStorage.setItem("alerte_benin_last_opps_visit", now);
    setLastOppsVisit(now);
  };

  const handleLoginSuccess = (user: User, token: string) => {
    localStorage.setItem("alerte_benin_token", token);
    setCurrentUser(user);
    setSavedOpps(user.savedOpportunities || []);
    if (user.role === "admin") {
      setActiveTab("admin");
    } else {
      setActiveTab("dashboard");
    }
    fetchHomeData();
  };

  const handleLogout = () => {
    localStorage.removeItem("alerte_benin_token");
    setCurrentUser(null);
    setSavedOpps([]);
    setActiveTab("home");
  };

  const handleUpdateProfile = async (fullname: string, avatar: string) => {
    try {
      const token = localStorage.getItem("alerte_benin_token") || "";
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ fullname, avatar })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSaveOpportunity = async (oppId: string) => {
    if (!currentUser) return;
    try {
      const token = localStorage.getItem("alerte_benin_token") || "";
      const res = await fetch(`/api/opportunities/${oppId}/save`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSavedOpps(data.savedOpportunities);
        // Update current user cached list
        setCurrentUser(prev => prev ? { ...prev, savedOpportunities: data.savedOpportunities } : null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setNewsletterLoading(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail })
      });
      if (res.ok) {
        setNewsletterSubscribed(true);
        setNewsletterEmail("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col font-sans text-[#222222] dark:text-zinc-100 transition-colors duration-300">
      {/* Navigation Header bar */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        allOpps={allOpps}
        lastOppsVisit={lastOppsVisit}
        onMarkNotificationsAsRead={handleMarkNotificationsAsRead}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* TAB 1: HOME LANDING PAGE */}
        {activeTab === "home" && (
          <div className="space-y-12 pb-12">
            {/* Visual Intro Banner */}
            <Hero setActiveTab={setActiveTab} />

             {/* Quick stats and introductory banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Highlight recent news articles */}
              <div className="space-y-6">
                <div className="flex items-end justify-between border-b border-gray-100 pb-3 text-left">
                  <div>
                    <span className="text-[10px] uppercase font-black text-[#138A0A] tracking-widest">ACTUALITÉS RÉCENTES</span>
                    <h2 className="text-xl sm:text-2xl font-black font-serif text-gray-900 tracking-tight mt-1">Dernières Éditions Publiées</h2>
                  </div>
                  <button
                    onClick={() => setActiveTab("news")}
                    className="text-xs font-bold text-[#138A0A] uppercase tracking-wider hover:underline flex items-center space-x-1 shrink-0"
                  >
                    <span>Toute l&#39;actualité</span>
                    <span>→</span>
                  </button>
                </div>

                {homeLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-64 bg-gray-50 border border-gray-100 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : recentArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recentArticles.map(art => (
                      <ArticleCard
                        key={art.id}
                        article={art}
                        onSelect={() => {
                          setActiveTab("news");
                          // Let the news section focus on it by passing state or resetting
                          setTimeout(() => {
                            const card = document.getElementById(`article-card-${art.id}`);
                            if (card) card.click();
                          }, 100);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center italic py-4">Aucun article publié pour le moment.</p>
                )}
              </div>

              {/* Highlight recent opportunities */}
              <div className="space-y-6 pt-10">
                <div className="flex items-end justify-between border-b border-gray-100 pb-3 text-left">
                  <div>
                    <span className="text-[10px] uppercase font-black text-[#D62828] tracking-widest">OPPORTUNITÉS URGENTES</span>
                    <h2 className="text-xl sm:text-2xl font-black font-serif text-gray-900 tracking-tight mt-1">Recrutements & Bourses Récents</h2>
                  </div>
                  <button
                    onClick={() => setActiveTab("opportunities")}
                    className="text-xs font-bold text-[#138A0A] uppercase tracking-wider hover:underline flex items-center space-x-1 shrink-0"
                  >
                    <span>Toutes les offres</span>
                    <span>→</span>
                  </button>
                </div>

                {homeLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-64 bg-gray-50 border border-gray-100 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : recentOpps.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recentOpps.map(opp => (
                      <OpportunityCard
                        key={opp.id}
                        opportunity={opp}
                        currentUser={currentUser}
                        onSelect={() => {
                          setActiveTab("opportunities");
                          setTimeout(() => {
                            const card = document.getElementById(`opp-card-${opp.id}`);
                            if (card) card.click();
                          }, 100);
                        }}
                        onToggleSave={handleToggleSaveOpportunity}
                        isSaved={savedOpps.includes(opp.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center italic py-4">Aucune opportunité enregistrée pour le moment.</p>
                )}
              </div>
            </div>

            {/* In-app highly styled CTA Newsletter zone */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
              <div className="bg-[#F8F9FA] border-l-4 border-[#138A0A] border-y border-r border-gray-200 text-gray-950 rounded-lg p-6 sm:p-10 relative overflow-hidden shadow-sm">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 space-y-3">
                    <span className="inline-block px-2.5 py-1 bg-white border border-[#D62828] text-[#D62828] rounded text-[10px] font-black uppercase tracking-widest">
                      SERVICE D'ALERTE CITOYENNE
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black font-serif tracking-tight leading-tight text-gray-900">
                      Restez alerté en temps réel !
                    </h3>
                    <p className="text-xs text-gray-600 max-w-xl font-medium">
                      Recevez gratuitement les opportunités réelles chaque matin. Rejoignez plus de 10 000 Béninois déjà informés de chaque concours national et offre d'emploi.
                    </p>
                  </div>

                  <div className="lg:col-span-5 w-full">
                    {newsletterSubscribed ? (
                      <div className="p-4 bg-emerald-50 border border-[#138A0A] rounded flex items-center justify-center space-x-2">
                        <Check className="h-5 w-5 text-[#138A0A] shrink-0" />
                        <span className="text-xs font-bold text-[#138A0A]">Votre inscription aux alertes Alerte Bénin est validée !</span>
                      </div>
                    ) : (
                      <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="email"
                          placeholder="Ex: citoyen@gmail.com"
                          required
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          className="flex-1 px-4 py-3 text-xs bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded focus:outline-none focus:border-[#138A0A] focus:ring-1 focus:ring-[#138A0A] transition-all"
                        />
                        <button
                          type="submit"
                          disabled={newsletterLoading}
                          className="px-6 py-3 bg-[#138A0A] hover:bg-[#0f6f08] text-white text-xs font-bold uppercase tracking-widest rounded shadow-sm hover:shadow transition-all shrink-0 flex items-center justify-center space-x-1"
                        >
                          <Send className="h-4 w-4" />
                          <span>{newsletterLoading ? "Envoi..." : "Je m'inscris"}</span>
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: NEWS VIEW */}
        {activeTab === "news" && (
          <NewsSection 
            currentUser={currentUser} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onNavigateToAuth={() => setActiveTab("dashboard")}
          />
        )}

        {/* TAB 3: OPPORTUNITIES VIEW */}
        {activeTab === "opportunities" && (
          <OpportunitiesSection 
            currentUser={currentUser} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            savedOpps={savedOpps}
            onToggleSave={handleToggleSaveOpportunity}
            onNavigateToAuth={() => setActiveTab("dashboard")}
          />
        )}

        {/* TAB 4: ABOUT VIEW */}
        {activeTab === "about" && (
          <AboutContactSection />
        )}

        {/* TAB 5: USER DASHBOARD VIEW */}
        {activeTab === "dashboard" && (
          <UserDashboard 
            currentUser={currentUser}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
            savedOpps={savedOpps}
            onToggleSave={handleToggleSaveOpportunity}
            setActiveTab={setActiveTab}
          />
        )}

        {/* TAB 6: ADMIN CONSOLE */}
        {activeTab === "admin" && (
          <AdminDashboard 
            currentUser={currentUser}
            setActiveTab={setActiveTab}
          />
        )}

      </main>

      {/* Footer bar */}
      <Footer 
        setActiveTab={setActiveTab} 
        darkMode={darkMode} 
        onToggleDarkMode={() => setDarkMode(prev => !prev)} 
      />
    </div>
  );
}
