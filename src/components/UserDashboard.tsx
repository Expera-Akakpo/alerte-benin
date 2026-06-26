import React, { useState, useEffect } from "react";
import { User, Opportunity, UserRole } from "../types";
import { User as UserIcon, Heart, Bell, Mail, Lock, LogIn, Key, Compass, Check, AlertCircle } from "lucide-react";

interface UserDashboardProps {
  currentUser: User | null;
  onLoginSuccess: (user: User, token: string) => void;
  onLogout: () => void;
  onUpdateProfile: (fullname: string, avatar: string) => Promise<void>;
  savedOpps: string[];
  onToggleSave: (oppId: string) => Promise<void>;
  setActiveTab: (tab: any) => void;
}

export default function UserDashboard({
  currentUser,
  onLoginSuccess,
  onLogout,
  onUpdateProfile,
  savedOpps,
  onToggleSave,
  setActiveTab
}: UserDashboardProps) {
  // Login / Signup state
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Edit profile state
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Saved Opportunities list
  const [savedOpportunities, setSavedOpportunities] = useState<Opportunity[]>([]);
  const [loadingOpps, setLoadingOpps] = useState(false);

  // Alerts Settings State
  const [alerts, setAlerts] = useState({
    jobs: true,
    internships: true,
    scholarships: true,
    contests: true,
    trainings: false
  });

  const [newsletterSub, setNewsletterSub] = useState(true);

  // Sync edit profile on user load
  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.fullname);
      setEditAvatar(currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.fullname)}`);
      fetchSavedOpps();
    }
  }, [currentUser, savedOpps]);

  const fetchSavedOpps = async () => {
    if (!currentUser) return;
    setLoadingOpps(true);
    try {
      const token = localStorage.getItem("alerte_benin_token") || "";
      const res = await fetch("/api/opportunities/saved/user", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSavedOpportunities(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOpps(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    const endpoint = authTab === "login" ? "/api/auth/login" : "/api/auth/signup";
    const body = authTab === "login" 
      ? { email, password } 
      : { email, password, fullname };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (res.ok) {
        onLoginSuccess(data.user, data.token);
      } else {
        setAuthError(data.error || "Une erreur s'est produite.");
      }
    } catch (err) {
      setAuthError("Impossible de joindre le serveur.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    setUpdateLoading(true);
    setUpdateSuccess(false);

    try {
      await onUpdateProfile(editName, editAvatar);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      alert("Erreur de mise à jour.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const toggleAlert = (key: keyof typeof alerts) => {
    setAlerts(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!currentUser) {
    /* Authentification state */
    return (
      <div className="max-w-md mx-auto py-12 px-4 sm:px-6 animate-fadeIn" id="user-auth-panel">
        <div className="bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden">
          {/* Header tabs */}
          <div className="flex border-b border-gray-100 bg-gray-50/50">
             <button
              onClick={() => { setAuthTab("login"); setAuthError(""); }}
              className={`flex-1 py-4 text-xs font-extrabold uppercase tracking-wider transition-colors ${
                authTab === "login"
                  ? "bg-white text-[#138A0A] border-b-2 border-[#138A0A]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Se Connecter
            </button>
            <button
              onClick={() => { setAuthTab("signup"); setAuthError(""); }}
              className={`flex-1 py-4 text-xs font-extrabold uppercase tracking-wider transition-colors ${
                authTab === "signup"
                  ? "bg-white text-[#138A0A] border-b-2 border-[#138A0A]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Créer un Compte
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6 text-left">
            <div className="text-center space-y-1">
              <span className="text-xl">🇧🇯</span>
              <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">
                {authTab === "login" ? "Bon retour parmi nous" : "Rejoignez Alerte Bénin"}
              </h2>
              <p className="text-[11px] text-gray-400">
                {authTab === "login" 
                  ? "Connectez-vous pour postuler et enregistrer vos alertes" 
                  : "Inscrivez-vous gratuitement pour ne rater aucune bourse d'étude ou emploi."}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authTab === "signup" && (
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nom Complet</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Ex: Codjo Gbènamè"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#138A0A]"
                    />
                    <UserIcon className="absolute left-3 top-3 h-3.5 w-3.5 text-gray-400" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Adresse Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Ex: citoyen@alertebenin.bj"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#138A0A]"
                  />
                  <Mail className="absolute left-3 top-3.5 h-3.5 w-3.5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Mot de Passe</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#138A0A]"
                  />
                  <Lock className="absolute left-3 top-3.5 h-3.5 w-3.5 text-gray-400" />
                </div>
              </div>

              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-[10px] text-red-500 flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 bg-[#138A0A] hover:bg-[#0f6f08] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2"
              >
                <LogIn className="h-4 w-4" />
                <span>{authLoading ? "Traitement..." : authTab === "login" ? "Se Connecter" : "Créer mon Compte"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* Logged In Dashboard state */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn" id="user-dashboard-panel">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Hand: Profile Summary & Alerts customization */}
        <div className="lg:col-span-5 space-y-6">
          {/* Profile Card */}
          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm text-center space-y-4">
            <div className="relative inline-block">
              <img
                src={editAvatar || undefined}
                alt={currentUser.fullname}
                className="h-20 w-20 rounded-full border-4 border-emerald-50 object-cover mx-auto"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 h-5 w-5 bg-[#138A0A] text-white rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-white shadow">
                ✓
              </span>
            </div>

            <div>
              <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">{currentUser.fullname}</h2>
              <p className="text-[11px] text-gray-400 font-mono">{currentUser.email}</p>
              <div className="inline-block mt-2 px-2.5 py-0.5 bg-emerald-50 border border-emerald-100 text-[#138A0A] text-[9px] font-bold uppercase tracking-wider rounded">
                Profil {currentUser.role === "admin" ? "Administrateur" : "Candidat Actif"}
              </div>
            </div>

            {/* Profile Modification Form */}
            <form onSubmit={handleUpdateProfileSubmit} className="pt-4 border-t border-gray-100 text-left space-y-3">
              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Modifier mon Nom</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#138A0A]"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Générateur d&#39;Avatar (Seed Nom)</label>
                <input
                  type="text"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="Coller l'adresse d'une image"
                  className="w-full p-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#138A0A]"
                />
                <span className="block text-[8px] text-gray-400 mt-1">Utilise les SVG de Dicebear par défaut.</span>
              </div>

              {updateSuccess && (
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[9px] text-emerald-600 flex items-center space-x-1">
                  <Check className="h-3.5 w-3.5 shrink-0" />
                  <span>Modifications sauvegardées avec succès !</span>
                </div>
              )}

              <button
                type="submit"
                disabled={updateLoading}
                className="w-full py-2 bg-[#138A0A] hover:bg-[#0f6f08] text-white text-xs font-bold rounded-lg shadow-sm"
              >
                {updateLoading ? "Sauvegarde..." : "Mettre à jour mon profil"}
              </button>
            </form>

            <button
              onClick={onLogout}
              className="w-full py-2 border border-red-200 text-red-500 bg-red-50/30 hover:bg-red-50 text-xs font-bold rounded-lg transition-colors"
            >
              Fermer ma session
            </button>
          </div>

          {/* Email Alerts settings */}
          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm text-left space-y-4">
            <h3 className="text-xs uppercase font-extrabold text-gray-400 tracking-widest border-b border-gray-100 pb-2 flex items-center space-x-1.5">
              <Bell className="h-4.5 w-4.5 text-[#138A0A]" />
              <span>Abonnement aux Alertes</span>
            </h3>

            <p className="text-[11px] text-gray-500 leading-relaxed">
              Recevez des alertes mails instantanées dès qu&#39;une opportunité correspondante est publiée au Bénin.
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={alerts.jobs} 
                  onChange={() => toggleAlert("jobs")}
                  className="h-4 w-4 rounded border-gray-300 text-[#138A0A] focus:ring-[#138A0A]"
                />
                <span className="text-gray-700 font-medium">Offres d&#39;emploi & Recrutements</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={alerts.internships} 
                  onChange={() => toggleAlert("internships")}
                  className="h-4 w-4 rounded border-gray-300 text-[#138A0A] focus:ring-[#138A0A]"
                />
                <span className="text-gray-700 font-medium">Stages professionnels</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={alerts.scholarships} 
                  onChange={() => toggleAlert("scholarships")}
                  className="h-4 w-4 rounded border-gray-300 text-[#138A0A] focus:ring-[#138A0A]"
                />
                <span className="text-gray-700 font-medium">Bourses d&#39;études internationales</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={alerts.contests} 
                  onChange={() => toggleAlert("contests")}
                  className="h-4 w-4 rounded border-gray-300 text-[#138A0A] focus:ring-[#138A0A]"
                />
                <span className="text-gray-700 font-medium">Concours nationaux & Examens</span>
              </label>
            </div>

            {/* Newsletter toggle */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Mail className="h-4.5 w-4.5 text-amber-500" />
                <span className="text-gray-700 font-bold">Newsletter Hebdomadaire</span>
              </div>
              <button
                onClick={() => setNewsletterSub(!newsletterSub)}
                className={`px-3 py-1 rounded-md text-[10px] font-bold ${
                  newsletterSub ? "bg-emerald-50 text-[#138A0A] border border-emerald-200" : "bg-gray-100 text-gray-500"
                }`}
              >
                {newsletterSub ? "Abonné" : "Désabonné"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Hand: Saved opportunities listings */}
        <div className="lg:col-span-7 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm text-left space-y-4">
          <h3 className="text-xs uppercase font-extrabold text-gray-400 tracking-widest border-b border-gray-100 pb-2 flex items-center space-x-2">
            <Heart className="h-4.5 w-4.5 text-red-500" />
            <span>Mes Opportunités enregistrées ({savedOpportunities.length})</span>
          </h3>

          {loadingOpps ? (
            <div className="flex justify-center py-12">
              <div className="h-6 w-6 border-2 border-emerald-100 border-t-[#138A0A] rounded-full animate-spin"></div>
            </div>
          ) : savedOpportunities.length > 0 ? (
            <div className="space-y-4">
              {savedOpportunities.map((opp) => {
                const isExpired = new Date(opp.deadline).getTime() < Date.now();
                return (
                  <div 
                    key={opp.id}
                    onClick={() => setActiveTab("opportunities")}
                    className="flex items-center space-x-4 p-3 bg-gray-50/50 hover:bg-gray-50 rounded-2xl border border-gray-100 transition-colors cursor-pointer text-xs"
                  >
                    <img
                      src={opp.image || undefined}
                      alt={opp.title}
                      className="h-14 w-14 rounded-xl object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase font-bold text-[#138A0A]">{opp.category}</span>
                      <h4 className="font-extrabold text-gray-900 truncate leading-snug">{opp.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Date limite : {new Date(opp.deadline).toLocaleDateString("fr-BJ", { day: 'numeric', month: 'short' })}</p>
                    </div>

                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await onToggleSave(opp.id);
                        fetchSavedOpps();
                      }}
                      className="p-1.5 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-lg shrink-0 transition-colors"
                      title="Supprimer des favoris"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center space-y-4 border border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
              <p className="text-xs text-gray-400 italic">Vous n&#39;avez pas encore d&#39;opportunités enregistrées en favoris.</p>
              <button
                onClick={() => setActiveTab("opportunities")}
                className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-[#138A0A] hover:bg-[#0f6f08] text-white text-xs font-bold rounded-lg shadow-xs"
              >
                <Compass className="h-4 w-4" />
                <span>Découvrir les offres</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
