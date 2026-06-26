import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, MapPin, Award, Check, Search, Filter, FileText, Heart, Share2, Sparkles, AlertCircle } from "lucide-react";
import { Opportunity, User } from "../types";
import OpportunityCard from "./OpportunityCard";

interface OpportunitiesSectionProps {
  currentUser: User | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  savedOpps: string[];
  onToggleSave: (oppId: string) => Promise<void>;
  onNavigateToAuth: () => void;
}

export default function OpportunitiesSection({
  currentUser,
  searchQuery,
  setSearchQuery,
  savedOpps,
  onToggleSave,
  onNavigateToAuth,
}: OpportunitiesSectionProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Tous");
  const [selectedCountry, setSelectedCountry] = useState<string>("Tous");
  const [selectedLevel, setSelectedLevel] = useState<string>("Tous");
  const [loading, setLoading] = useState(false);

  const categories = [
    "Tous",
    "Emplois",
    "Stages",
    "Recrutements",
    "Concours",
    "Bourses",
    "Formations",
    "Appels à projets",
    "Opportunités d'affaires"
  ];

  const countries = ["Tous", "Bénin", "International"];
  const studyLevels = ["Tous", "Bac", "Bac+2/3", "Licence / Master", "Tous niveaux"];

  // Fetch opportunities
  useEffect(() => {
    const fetchOpps = async () => {
      setLoading(true);
      try {
        let url = `/api/opportunities?`;
        if (activeCategory !== "Tous") {
          url += `&category=${encodeURIComponent(activeCategory)}`;
        }
        if (selectedCountry !== "Tous") {
          url += `&country=${encodeURIComponent(selectedCountry)}`;
        }
        if (selectedLevel !== "Tous") {
          url += `&studyLevel=${encodeURIComponent(selectedLevel)}`;
        }
        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setOpportunities(data);
        }
      } catch (err) {
        console.error("Erreur de chargement des opportunités", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpps();
  }, [activeCategory, selectedCountry, selectedLevel, searchQuery]);

  const handleOppSelect = async (opp: Opportunity) => {
    setSelectedOpp(opp);
    try {
      const res = await fetch(`/api/opportunities/${opp.id}`);
      if (res.ok) {
        const updated = await res.json();
        setSelectedOpp(updated);
        setOpportunities(prev => prev.map(o => o.id === updated.id ? updated : o));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isOppSaved = (oppId: string) => {
    return savedOpps.includes(oppId);
  };

  const shareSocial = (platform: "wa" | "fb") => {
    if (!selectedOpp) return;
    const shareUrl = `${window.location.origin}/opportunities/${selectedOpp.id}`;
    const text = `Opportunité Alerte Bénin : ${selectedOpp.title}`;

    if (platform === "wa") {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} - ${shareUrl}`)}`;
      window.open(waUrl, "_blank");
    } else {
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
      window.open(fbUrl, "_blank");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="opportunities-section">
      
      {selectedOpp ? (
        /* Detailed Opportunity View */
        <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
          {/* Back button */}
          <button
            onClick={() => setSelectedOpp(null)}
            className="flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-[#138A0A] transition-colors"
            id="back-to-opps"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour aux opportunités</span>
          </button>

          {/* Title & Banner Grid */}
          <div className="relative h-60 sm:h-72 w-full rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
            <img
              src={selectedOpp.image || undefined}
              alt={selectedOpp.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="px-2.5 py-1 bg-[#138A0A] border border-emerald-500/35 rounded text-[10px] font-black uppercase tracking-wider self-start mb-3">
                {selectedOpp.category}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug">
                {selectedOpp.title}
              </h1>
            </div>
          </div>

          {/* Technical cards grid (Level, Deadline, Location, Host) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl space-y-1">
              <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400">Organisme</span>
              <p className="text-xs font-bold text-gray-800 truncate">{selectedOpp.company || "Non défini"}</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl space-y-1">
              <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400">Lieu d&#39;affectation</span>
              <p className="text-xs font-bold text-gray-800 truncate flex items-center space-x-1">
                <MapPin className="h-3 w-3 text-red-500 shrink-0" />
                <span>{selectedOpp.country}</span>
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl space-y-1">
              <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400">Niveau d&#39;étude requis</span>
              <p className="text-xs font-bold text-gray-800 truncate">{selectedOpp.studyLevel}</p>
            </div>
            <div className="bg-[#D62828]/5 border border-red-100 p-3 rounded-xl space-y-1">
              <span className="text-[9px] uppercase tracking-wider font-bold text-red-400">Date limite</span>
              <p className="text-xs font-bold text-red-600 truncate flex items-center space-x-1">
                <Calendar className="h-3 w-3 shrink-0" />
                <span>{new Date(selectedOpp.deadline).toLocaleDateString("fr-BJ", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </p>
            </div>
          </div>

          {/* Description Content */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs uppercase font-extrabold text-gray-400 tracking-widest border-b border-gray-100 pb-2 flex items-center space-x-2">
              <FileText className="h-4.5 w-4.5 text-[#138A0A]" />
              <span>Détails & Exigences de l&#39;opportunité</span>
            </h3>

            <div className="prose max-w-none text-xs sm:text-sm text-gray-800 leading-relaxed space-y-4 font-sans">
              {selectedOpp.description.split("\n\n").map((para, idx) => {
                if (para.startsWith("###")) {
                  return (
                    <h3 key={idx} className="text-sm font-extrabold text-gray-900 pt-3 border-b border-gray-100 pb-1 flex items-center">
                      <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-500 shrink-0" />
                      <span>{para.replace("###", "").trim()}</span>
                    </h3>
                  );
                }
                if (para.startsWith("*")) {
                  return (
                    <ul key={idx} className="list-disc pl-5 space-y-1.5 my-3 text-gray-700">
                      {para.split("\n").map((li, lIdx) => (
                        <li key={lIdx}>{li.replace("*", "").trim()}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={idx}>{para}</p>;
              })}
            </div>
          </div>

          {/* Bottom Action bar (Save favoris, share WhatsApp, share Facebook) */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!currentUser) {
                  alert("Veuillez vous connecter pour enregistrer cette opportunité.");
                  onNavigateToAuth();
                  return;
                }
                onToggleSave(selectedOpp.id);
              }}
              className={`flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 ${
                isOppSaved(selectedOpp.id)
                  ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Heart className="h-4 w-4" fill={isOppSaved(selectedOpp.id) ? "currentColor" : "none"} />
              <span>{isOppSaved(selectedOpp.id) ? "Retirer de mes favoris" : "Enregistrer l'opportunité"}</span>
            </button>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <span className="text-[10px] font-bold text-gray-400 mr-2 uppercase tracking-wider hidden sm:inline">Partager :</span>
              <button
                onClick={() => shareSocial("wa")}
                className="px-4 py-2 bg-emerald-50 text-[#138A0A] border border-emerald-100 text-xs font-bold rounded-xl hover:bg-emerald-100 transition-colors w-1/2 sm:w-auto"
              >
                WhatsApp
              </button>
              <button
                onClick={() => shareSocial("fb")}
                className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold rounded-xl hover:bg-blue-100 transition-colors w-1/2 sm:w-auto"
              >
                Facebook
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Opportunity list with custom filtering panel */
        <div className="space-y-6 animate-fadeIn">
          <div className="border-b border-gray-100 pb-5">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Portail des Opportunités Béninoises
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Trouvez des offres d&#39;emploi, stages qualifiants, concours nationaux, bourses d&#39;études et opportunités de formation vérifiées.
            </p>
          </div>

          {/* Interactive Filters Panel */}
          <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl space-y-4">
            <div className="flex items-center space-x-2 text-xs font-extrabold text-gray-800 uppercase tracking-wider pb-2 border-b border-gray-200/50">
              <Filter className="h-4 w-4 text-[#138A0A]" />
              <span>Filtres de tri</span>
            </div>

            {/* Category selection bar */}
            <div>
              <span className="block text-[10px] uppercase font-black text-gray-400 tracking-wider mb-2">Thématique d&#39;opportunité :</span>
              <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                      activeCategory === cat
                        ? "bg-[#138A0A] text-white"
                        : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub Filter dropdown triggers (Country and study level) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[10px] uppercase font-black text-gray-400 tracking-wider mb-2">Zone géographique :</label>
                <div className="flex space-x-1.5">
                  {countries.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCountry(c)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                        selectedCountry === c
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black text-gray-400 tracking-wider mb-2">Niveau d&#39;études requis :</label>
                <div className="flex space-x-1.5 overflow-x-auto">
                  {studyLevels.map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg border text-xs font-semibold whitespace-nowrap transition-colors ${
                        selectedLevel === lvl
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Listings feed */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-8 w-8 rounded-full border-4 border-yellow-100 border-t-[#F5B400] animate-spin"></div>
              <span className="text-xs text-gray-400 mt-2">Recherche d&#39;opportunités...</span>
            </div>
          ) : opportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  currentUser={currentUser}
                  onSelect={handleOppSelect}
                  onToggleSave={onToggleSave}
                  isSaved={isOppSaved(opp.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50">
              <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-bold">Aucune opportunité ne correspond à ces critères.</p>
              <button
                onClick={() => { setActiveCategory("Tous"); setSelectedCountry("Tous"); setSelectedLevel("Tous"); setSearchQuery(""); }}
                className="mt-3 text-xs text-[#138A0A] font-bold underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
