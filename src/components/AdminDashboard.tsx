import React, { useState, useEffect } from "react";
import { 
  Settings, Newspaper, Briefcase, Mail, Send, Check, AlertCircle, 
  Trash2, Edit, Plus, Eye, Database, Users, Sparkles, BookOpen, 
  HelpCircle, MessageSquare, Award, Calendar, MapPin, Volume2, Video, ArrowLeft
} from "lucide-react";
import { Article, Opportunity, Contact, NewsletterSubscriber, AdminStats } from "../types";

interface AdminDashboardProps {
  currentUser: any;
  setActiveTab: (tab: any) => void;
}

export default function AdminDashboard({ currentUser, setActiveTab }: AdminDashboardProps) {
  const [adminTab, setAdminTab] = useState<"stats" | "articles" | "opportunities" | "contacts" | "newsletter">("stats");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);

  // Lists
  const [articles, setArticles] = useState<Article[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);

  // Editing / Adding modes
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [isAddingArticle, setIsAddingArticle] = useState(false);
  const [isAddingOpp, setIsAddingOpp] = useState(false);

  // Article Form State
  const [articleForm, setArticleForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    category: "Politique",
    mediaType: "article" as "article" | "podcast" | "video" | "interview",
    mediaUrl: "",
    status: "published" as "published" | "draft"
  });

  // Opportunity Form State
  const [oppForm, setOppForm] = useState({
    title: "",
    description: "",
    category: "Emplois",
    deadline: "",
    country: "Bénin",
    image: "",
    studyLevel: "Bac+2/3",
    company: ""
  });

  // Confirmation de suppression
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    type: "article" | "opportunity";
    title: string;
  } | null>(null);

  // Categories lists
  const articleCategories = ["Politique", "Économie", "Société", "Agriculture", "Éducation", "Santé", "Technologie", "Sport", "Culture"];
  const oppCategories = ["Emplois", "Stages", "Recrutements", "Concours", "Bourses", "Formations", "Appels à projets", "Opportunités d'affaires"];

  useEffect(() => {
    if (currentUser?.role !== "admin") {
      setActiveTab("home");
      return;
    }
    fetchStats();
    fetchData();
  }, [currentUser, adminTab]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (adminTab === "articles" || adminTab === "stats") {
        const res = await fetch("/api/articles?status=all");
        if (res.ok) setArticles(await res.json());
      }
      if (adminTab === "opportunities" || adminTab === "stats") {
        const res = await fetch("/api/opportunities");
        if (res.ok) setOpportunities(await res.json());
      }
      if (adminTab === "contacts") {
        const res = await fetch("/api/contacts");
        if (res.ok) setContacts(await res.json());
      }
      if (adminTab === "newsletter") {
        const res = await fetch("/api/newsletter/subscribers");
        if (res.ok) setSubscribers(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // ARTICLE CRUD Handlers
  // ----------------------------------------

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleForm)
      });
      if (res.ok) {
        alert("Article publié avec succès !");
        setIsAddingArticle(false);
        resetArticleForm();
        fetchData();
        fetchStats();
      } else {
        const err = await res.json();
        alert(err.error || "Erreur de création.");
      }
    } catch (err) {
      alert("Une erreur s'est produite.");
    }
  };

  const handleUpdateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    try {
      const res = await fetch(`/api/articles/${editingArticle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleForm)
      });
      if (res.ok) {
        alert("Article mis à jour !");
        setEditingArticle(null);
        resetArticleForm();
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Erreur.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteArticle = (id: string) => {
    const art = articles.find(a => a.id === id);
    if (!art) return;
    setDeleteConfirm({
      id: art.id,
      type: "article",
      title: art.title
    });
  };

  const startEditArticle = (art: Article) => {
    setEditingArticle(art);
    setIsAddingArticle(false);
    setArticleForm({
      title: art.title,
      excerpt: art.excerpt,
      content: art.content,
      image: art.image,
      category: art.category,
      mediaType: art.mediaType,
      mediaUrl: art.mediaUrl || "",
      status: art.status
    });
  };

  const resetArticleForm = () => {
    setArticleForm({
      title: "",
      excerpt: "",
      content: "",
      image: "",
      category: "Politique",
      mediaType: "article",
      mediaUrl: "",
      status: "published"
    });
  };

  // ----------------------------------------
  // OPPORTUNITIES CRUD Handlers
  // ----------------------------------------

  const handleCreateOpp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(oppForm)
      });
      if (res.ok) {
        alert("Opportunité créée avec succès !");
        setIsAddingOpp(false);
        resetOppForm();
        fetchData();
        fetchStats();
      } else {
        const err = await res.json();
        alert(err.error || "Erreur.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOpp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOpp) return;
    try {
      const res = await fetch(`/api/opportunities/${editingOpp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(oppForm)
      });
      if (res.ok) {
        alert("Opportunité mise à jour !");
        setEditingOpp(null);
        resetOppForm();
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Erreur.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOpp = (id: string) => {
    const opp = opportunities.find(o => o.id === id);
    if (!opp) return;
    setDeleteConfirm({
      id: opp.id,
      type: "opportunity",
      title: opp.title
    });
  };

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    const { id, type } = deleteConfirm;
    try {
      if (type === "article") {
        const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
        if (res.ok) {
          setArticles(prev => prev.filter(art => art.id !== id));
          fetchStats();
        }
      } else {
        const res = await fetch(`/api/opportunities/${id}`, { method: "DELETE" });
        if (res.ok) {
          setOpportunities(prev => prev.filter(opp => opp.id !== id));
          fetchStats();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const startEditOpp = (opp: Opportunity) => {
    setEditingOpp(opp);
    setIsAddingOpp(false);
    setOppForm({
      title: opp.title,
      description: opp.description,
      category: opp.category,
      deadline: opp.deadline,
      country: opp.country,
      image: opp.image,
      studyLevel: opp.studyLevel,
      company: opp.company || ""
    });
  };

  const resetOppForm = () => {
    setOppForm({
      title: "",
      description: "",
      category: "Emplois",
      deadline: "",
      country: "Bénin",
      image: "",
      studyLevel: "Bac+2/3",
      company: ""
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn text-left font-sans" id="admin-dashboard">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left column: Navigation buttons */}
        <div className="lg:w-1/4 shrink-0 bg-gray-50 border border-gray-100 p-5 rounded-3xl h-fit space-y-4">
          <div className="space-y-1">
            <span className="text-xl">🛠️</span>
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">Console d&#39;administration</h2>
            <p className="text-[10px] text-gray-400">Gérez le contenu à la manière de WordPress.</p>
          </div>

          <nav className="flex flex-col space-y-1">
            <button
              onClick={() => { setAdminTab("stats"); setIsAddingArticle(false); setEditingArticle(null); setIsAddingOpp(false); setEditingOpp(null); }}
              className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                adminTab === "stats" ? "bg-[#138A0A] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Database className="h-4 w-4" />
              <span>Tableau de Bord</span>
            </button>

            <button
              onClick={() => { setAdminTab("articles"); setIsAddingArticle(false); setEditingArticle(null); }}
              className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                adminTab === "articles" ? "bg-[#138A0A] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Newspaper className="h-4 w-4" />
              <span>Gérer les Actualités</span>
            </button>

            <button
              onClick={() => { setAdminTab("opportunities"); setIsAddingOpp(false); setEditingOpp(null); }}
              className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                adminTab === "opportunities" ? "bg-[#138A0A] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>Gérer les Opportunités</span>
            </button>

            <button
              onClick={() => { setAdminTab("contacts"); }}
              className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                adminTab === "contacts" ? "bg-[#138A0A] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Mail className="h-4 w-4" />
              <span>Messages de Contact</span>
            </button>

            <button
              onClick={() => { setAdminTab("newsletter"); }}
              className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                adminTab === "newsletter" ? "bg-[#138A0A] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Abonnés Newsletter</span>
            </button>
          </nav>
        </div>

        {/* Right column: active Tab Panel */}
        <div className="flex-1 min-w-0">
          
          {/* 1. STATS VIEW */}
          {adminTab === "stats" && stats && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Tableau des indicateurs</h2>
                <p className="text-xs text-gray-400">Statistiques globales du portail d&#39;actualités en temps réel.</p>
              </div>

              {/* Counter grids */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Actualités rédigées</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-[#138A0A]">{stats.articleCount}</span>
                    <Newspaper className="h-5 w-5 text-[#138A0A]/30" />
                  </div>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Opportunités</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-amber-500">{stats.opportunityCount}</span>
                    <Briefcase className="h-5 w-5 text-amber-500/30" />
                  </div>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Abonnés Lettre</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-purple-600">{stats.newsletterCount}</span>
                    <Users className="h-5 w-5 text-purple-600/30" />
                  </div>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Total Lectures</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-gray-900">{stats.totalViews}</span>
                    <Eye className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Sub grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* Popular posts */}
                <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide border-b border-gray-50 pb-2 flex items-center space-x-1.5">
                    <Sparkles className="h-4.5 w-4.5 text-amber-500" />
                    <span>Actualités les plus lues</span>
                  </h4>
                  <div className="space-y-3 text-xs">
                    {stats.articlesByViews.map((art, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded-xl">
                        <span className="font-bold text-gray-700 truncate max-w-[200px]">{art.title}</span>
                        <span className="font-mono text-[10px] text-[#138A0A] font-bold shrink-0">{art.views} vues</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submissions brief */}
                <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide border-b border-gray-50 pb-2 flex items-center space-x-1.5">
                    <Mail className="h-4.5 w-4.5 text-blue-500" />
                    <span>Derniers Messages Recus</span>
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Vous avez reçu <span className="font-bold text-gray-800">{stats.contactCount}</span> formulaires de contact de la part de vos lecteurs et partenaires.
                  </p>
                  <button
                    onClick={() => setAdminTab("contacts")}
                    className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors text-center"
                  >
                    Consulter les courriers
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. ARTICLES CMS CRUD VIEW */}
          {adminTab === "articles" && (
            <div className="space-y-6">
              {!isAddingArticle && !editingArticle ? (
                /* List Articles */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Publications Actualités</h2>
                      <p className="text-xs text-gray-400">Rédigez, modifiez ou supprimez vos publications.</p>
                    </div>
                    <button
                      onClick={() => { setIsAddingArticle(true); resetArticleForm(); }}
                      className="flex items-center space-x-1 px-4 py-2 bg-[#138A0A] hover:bg-[#0f6f08] text-white text-xs font-bold rounded-xl shadow-xs"
                      id="admin-add-article-btn"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Rédiger un article</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto bg-white border border-gray-100 rounded-2xl shadow-xs">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 text-gray-400 uppercase tracking-wider font-bold text-[9px] text-left border-b border-gray-100">
                          <th className="p-3">Titre de la publication</th>
                          <th className="p-3">Catégorie</th>
                          <th className="p-3">Média</th>
                          <th className="p-3">Lectures</th>
                          <th className="p-3">Statut</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {articles.map((art) => (
                          <tr key={art.id} className="hover:bg-gray-50/50">
                            <td className="p-3 font-bold text-gray-900 max-w-xs truncate">{art.title}</td>
                            <td className="p-3 text-gray-500 font-medium">{art.category}</td>
                            <td className="p-3">
                              <span className="px-1.5 py-0.5 rounded border uppercase text-[8px] font-black bg-gray-100 border-gray-200">
                                {art.mediaType}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-[10px] text-gray-500">{art.views || 0} vues</td>
                            <td className="p-3">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                                art.status === "published" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                              }`}>
                                {art.status === "published" ? "En ligne" : "Brouillon"}
                              </span>
                            </td>
                            <td className="p-3 flex items-center justify-center space-x-1">
                              <button
                                onClick={() => startEditArticle(art)}
                                className="p-1.5 text-blue-500 hover:bg-blue-50 border border-blue-100 rounded-lg transition-colors"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteArticle(art.id)}
                                className="p-1.5 text-red-500 hover:bg-red-50 border border-red-100 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Add / Edit Article Form */
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
                    <button
                      onClick={() => { setIsAddingArticle(false); setEditingArticle(null); resetArticleForm(); }}
                      className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                      <h2 className="text-lg font-black text-gray-900 uppercase">
                        {isAddingArticle ? "Rédiger un nouvel article" : "Modifier l'article"}
                      </h2>
                      <p className="text-[11px] text-gray-400">Éditeur enrichi de publication WordPress-style.</p>
                    </div>
                  </div>

                  {/* Main Input Form */}
                  <form onSubmit={isAddingArticle ? handleCreateArticle : handleUpdateArticle} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Titre de l&#39;article</label>
                        <input
                          type="text"
                          required
                          value={articleForm.title}
                          onChange={(e) => setArticleForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#138A0A]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Catégorie thématique</label>
                        <select
                          value={articleForm.category}
                          onChange={(e) => setArticleForm(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#138A0A]"
                        >
                          {articleCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Format de publication</label>
                        <select
                          value={articleForm.mediaType}
                          onChange={(e) => setArticleForm(prev => ({ ...prev, mediaType: e.target.value as any }))}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#138A0A]"
                        >
                          <option value="article">Écrit (Par défaut)</option>
                          <option value="podcast">Podcast Audio</option>
                          <option value="video">Reportage Vidéo</option>
                          <option value="interview">Interview</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Lien du fichier média (Audio / Vidéo) (Optionnel)</label>
                        <input
                          type="text"
                          placeholder="Ex: https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                          value={articleForm.mediaUrl}
                          onChange={(e) => setArticleForm(prev => ({ ...prev, mediaUrl: e.target.value }))}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Lien de l&#39;image d&#39;illustration (Photo URL)</label>
                        <input
                          type="text"
                          placeholder="Ex: https://images.unsplash.com/photo-..."
                          value={articleForm.image}
                          onChange={(e) => setArticleForm(prev => ({ ...prev, image: e.target.value }))}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#138A0A]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Statut initial de la publication</label>
                        <div className="flex space-x-3 pt-2">
                          <label className="flex items-center space-x-1.5 cursor-pointer text-xs">
                            <input
                              type="radio"
                              name="status"
                              checked={articleForm.status === "published"}
                              onChange={() => setArticleForm(prev => ({ ...prev, status: "published" }))}
                              className="text-[#138A0A]"
                            />
                            <span>Publier directement (En ligne)</span>
                          </label>
                          <label className="flex items-center space-x-1.5 cursor-pointer text-xs">
                            <input
                              type="radio"
                              name="status"
                              checked={articleForm.status === "draft"}
                              onChange={() => setArticleForm(prev => ({ ...prev, status: "draft" }))}
                              className="text-[#138A0A]"
                            />
                            <span>Enregistrer comme Brouillon</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Extrait court (Affichage carte d&#39;actualité)</label>
                      <input
                        type="text"
                        required
                        value={articleForm.excerpt}
                        onChange={(e) => setArticleForm(prev => ({ ...prev, excerpt: e.target.value }))}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#138A0A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Corps textuel complet (Markdown supporté)</label>
                      <textarea
                        rows={10}
                        required
                        value={articleForm.content}
                        onChange={(e) => setArticleForm(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#138A0A] font-sans leading-relaxed"
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => { setIsAddingArticle(false); setEditingArticle(null); resetArticleForm(); }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#138A0A] hover:bg-[#0f6f08] text-white text-xs font-bold rounded-xl shadow-md"
                      >
                        {isAddingArticle ? "Publier la rédaction" : "Sauvegarder l'article"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* 3. OPPORTUNITIES CMS CRUD VIEW */}
          {adminTab === "opportunities" && (
            <div className="space-y-6">
              {!isAddingOpp && !editingOpp ? (
                /* List Opps */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Publications Offres & Opportunités</h2>
                      <p className="text-xs text-gray-400">Rédigez, modifiez ou supprimez vos offres d&#39;emploi, bourses ou concours.</p>
                    </div>
                    <button
                      onClick={() => { setIsAddingOpp(true); resetOppForm(); }}
                      className="flex items-center space-x-1 px-4 py-2 bg-[#138A0A] hover:bg-[#0f6f08] text-white text-xs font-bold rounded-xl shadow-xs"
                      id="admin-add-opp-btn"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Ajouter une opportunité</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto bg-white border border-gray-100 rounded-2xl shadow-xs">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 text-gray-400 uppercase tracking-wider font-bold text-[9px] text-left border-b border-gray-100">
                          <th className="p-3">Intitulé de l&#39;offre</th>
                          <th className="p-3">Thématique</th>
                          <th className="p-3">Niveau requis</th>
                          <th className="p-3">Zone / Pays</th>
                          <th className="p-3">Date limite</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {opportunities.map((opp) => (
                          <tr key={opp.id} className="hover:bg-gray-50/50">
                            <td className="p-3 font-bold text-gray-900 max-w-xs truncate">{opp.title}</td>
                            <td className="p-3 text-gray-500 font-medium">{opp.category}</td>
                            <td className="p-3 font-mono text-[10px] text-gray-500">{opp.studyLevel}</td>
                            <td className="p-3 text-gray-500">{opp.country}</td>
                            <td className="p-3 font-mono text-red-600 font-bold">{new Date(opp.deadline).toLocaleDateString("fr-BJ")}</td>
                            <td className="p-3 flex items-center justify-center space-x-1">
                              <button
                                onClick={() => startEditOpp(opp)}
                                className="p-1.5 text-blue-500 hover:bg-blue-50 border border-blue-100 rounded-lg transition-colors"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteOpp(opp.id)}
                                className="p-1.5 text-red-500 hover:bg-red-50 border border-red-100 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Add / Edit Opp Form */
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
                    <button
                      onClick={() => { setIsAddingOpp(false); setEditingOpp(null); resetOppForm(); }}
                      className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                      <h2 className="text-lg font-black text-gray-900 uppercase">
                        {isAddingOpp ? "Ajouter une nouvelle opportunité" : "Modifier l'opportunité"}
                      </h2>
                      <p className="text-[11px] text-gray-400">Éditeur enrichi d&#39;opportunités pour le Bénin et l&#39;international.</p>
                    </div>
                  </div>

                  {/* Main Input Form */}
                  <form onSubmit={isAddingOpp ? handleCreateOpp : handleUpdateOpp} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Intitulé de l&#39;opportunité</label>
                        <input
                          type="text"
                          required
                          value={oppForm.title}
                          onChange={(e) => setOppForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#138A0A]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Thématique d&#39;opportunité</label>
                        <select
                          value={oppForm.category}
                          onChange={(e) => setOppForm(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#138A0A]"
                        >
                          {oppCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Organisme / Entreprise émettrice</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: MTN Bénin, Ambassade de France, ..."
                          value={oppForm.company}
                          onChange={(e) => setOppForm(prev => ({ ...prev, company: e.target.value }))}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#138A0A]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Niveau d&#39;étude exigé</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Bac+2/3, Licence, Master, ..."
                          value={oppForm.studyLevel}
                          onChange={(e) => setOppForm(prev => ({ ...prev, studyLevel: e.target.value }))}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Zone géographique / Pays d&#39;accueil</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Bénin, International, France, ..."
                          value={oppForm.country}
                          onChange={(e) => setOppForm(prev => ({ ...prev, country: e.target.value }))}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Lien de l&#39;image d&#39;annonce (Photo URL)</label>
                        <input
                          type="text"
                          placeholder="Ex: https://images.unsplash.com/photo-..."
                          value={oppForm.image}
                          onChange={(e) => setOppForm(prev => ({ ...prev, image: e.target.value }))}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#138A0A]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Date limite de candidature (AAAA-MM-JJ)</label>
                        <input
                          type="date"
                          required
                          value={oppForm.deadline}
                          onChange={(e) => setOppForm(prev => ({ ...prev, deadline: e.target.value }))}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#138A0A]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Descriptif complet, compétences et exigences (Markdown supporté)</label>
                      <textarea
                        rows={10}
                        required
                        value={oppForm.description}
                        onChange={(e) => setOppForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#138A0A] font-sans leading-relaxed"
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => { setIsAddingOpp(false); setEditingOpp(null); resetOppForm(); }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#138A0A] hover:bg-[#0f6f08] text-white text-xs font-bold rounded-xl shadow-md"
                      >
                        {isAddingOpp ? "Publier l'opportunité" : "Sauvegarder les modifications"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* 4. CONTACT MESSAGES VIEW */}
          {adminTab === "contacts" && (
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Courriers de contact recu</h2>
                <p className="text-xs text-gray-400">Consultez les messages envoyés depuis le site.</p>
              </div>

              {contacts.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {contacts.map((msg) => (
                    <div key={msg.id} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 border-b border-gray-50 pb-2">
                        <div>
                          <h4 className="text-xs font-extrabold text-gray-900 uppercase">Sujet : {msg.subject}</h4>
                          <p className="text-[11px] text-[#138A0A] font-medium">De: {msg.name} ({msg.email}) {msg.phone ? `- Tél: ${msg.phone}` : ""}</p>
                        </div>
                        <span className="text-[9px] font-mono text-gray-400">
                          Recu le : {new Date(msg.createdAt).toLocaleString("fr-BJ")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed font-sans bg-gray-50 p-3 rounded-lg border border-gray-100">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed border-gray-100 bg-gray-50 rounded-3xl text-gray-400 italic text-xs">
                  Aucun message de contact n&#39;a été reçu pour le moment.
                </div>
              )}
            </div>
          )}

          {/* 5. NEWSLETTER SUBSCRIBERS VIEW */}
          {adminTab === "newsletter" && (
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Abonnés Lettre d&#39;information</h2>
                <p className="text-xs text-gray-400">Liste des citoyens béninois inscrits pour recevoir des alertes par mail.</p>
              </div>

              {subscribers.length > 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 uppercase tracking-wider font-bold text-[9px] text-left border-b border-gray-100">
                        <th className="p-3">Numéro ID</th>
                        <th className="p-3">Adresse Email de l&#39;abonné</th>
                        <th className="p-3">Date d&#39;inscription aux alertes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {subscribers.map((sub, idx) => (
                        <tr key={sub.id} className="hover:bg-gray-50/50">
                          <td className="p-3 font-mono font-bold text-gray-400">#{idx + 1}</td>
                          <td className="p-3 font-bold text-gray-900">{sub.email}</td>
                          <td className="p-3 font-mono text-gray-500">{new Date(sub.createdAt).toLocaleString("fr-BJ")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed border-gray-100 bg-gray-50 rounded-3xl text-gray-400 italic text-xs">
                  Aucun abonné newsletter enregistré pour le moment.
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Custom Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-gray-100 transform transition-all scale-100 space-y-4">
            <div className="h-12 w-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-tight">
                Confirmation de suppression
              </h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Voulez-vous vraiment supprimer {deleteConfirm.type === "article" ? "cet article" : "cette opportunité"} :{" "}
                <span className="font-bold text-gray-800">"{deleteConfirm.title}"</span> ? Cette action est irréversible et immédiate.
              </p>
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-[10px] font-black uppercase text-gray-600 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
