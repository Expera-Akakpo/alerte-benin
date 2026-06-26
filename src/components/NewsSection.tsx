import React, { useState, useEffect } from "react";
import { Search, Eye, Clock, ArrowLeft, Volume2, Video, Send, User, MessageCircle, Share2, CornerDownRight } from "lucide-react";
import { Article, Comment, User as UserType } from "../types";
import ArticleCard from "./ArticleCard";

interface NewsSectionProps {
  currentUser: UserType | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNavigateToAuth: () => void;
}

export default function NewsSection({
  currentUser,
  searchQuery,
  setSearchQuery,
  onNavigateToAuth
}: NewsSectionProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Tous");
  const [activeMediaType, setActiveMediaType] = useState<string>("Tous");
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  const categories = [
    "Tous",
    "Politique",
    "Économie",
    "Société",
    "Agriculture",
    "Éducation",
    "Santé",
    "Technologie",
    "Sport",
    "Culture"
  ];

  const mediaTypes = [
    { id: "Tous", label: "Tous formats" },
    { id: "article", label: "Écrits" },
    { id: "podcast", label: "Podcasts Audio" },
    { id: "video", label: "Vidéos" },
    { id: "interview", label: "Interviews" }
  ];

  // Fetch articles on mount and filter changes
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        let url = `/api/articles?status=published`;
        if (activeCategory !== "Tous") {
          url += `&category=${encodeURIComponent(activeCategory)}`;
        }
        if (activeMediaType !== "Tous") {
          url += `&mediaType=${activeMediaType}`;
        }
        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setArticles(data);
        }
      } catch (err) {
        console.error("Erreur de chargement des articles", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [activeCategory, activeMediaType, searchQuery]);

  // Fetch comments when article is selected
  useEffect(() => {
    if (selectedArticle) {
      const fetchComments = async () => {
        try {
          const res = await fetch(`/api/articles/${selectedArticle.id}/comments`);
          if (res.ok) {
            const data = await res.json();
            setComments(data);
          }
        } catch (err) {
          console.error("Erreur de chargement des commentaires", err);
        }
      };
      fetchComments();
    }
  }, [selectedArticle]);

  const handleArticleSelect = async (article: Article) => {
    setSelectedArticle(article);
    // Fetch individual to increment views
    try {
      const res = await fetch(`/api/articles/${article.slug}`);
      if (res.ok) {
        const updated = await res.json();
        // Update local views count
        setArticles(prev => prev.map(a => a.id === updated.id ? updated : a));
        setSelectedArticle(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle || !newComment.trim()) return;

    if (!currentUser) {
      alert("Veuillez vous connecter pour publier un commentaire.");
      onNavigateToAuth();
      return;
    }

    setCommentLoading(true);
    try {
      const token = localStorage.getItem("alerte_benin_token") || "";
      const res = await fetch(`/api/articles/${selectedArticle.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ comment: newComment })
      });

      if (res.ok) {
        const addedComment = await res.json();
        setComments(prev => [addedComment, ...prev]);
        setNewComment("");
      } else {
        const errData = await res.json();
        alert(errData.error || "Erreur de publication du commentaire.");
      }
    } catch (err) {
      alert("Impossible de joindre le serveur.");
    } finally {
      setCommentLoading(false);
    }
  };

  const shareSocial = (platform: "fb" | "wa") => {
    if (!selectedArticle) return;
    const url = `${window.location.origin}/articles/${selectedArticle.slug}`;
    const text = `Alerte Bénin : ${selectedArticle.title}`;

    if (platform === "wa") {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} - ${url}`)}`;
      window.open(waUrl, "_blank");
    } else {
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(fbUrl, "_blank");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="news-section">
      
      {selectedArticle ? (
        /* Detailed Article View */
        <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
          {/* Back button */}
          <button
            onClick={() => { setSelectedArticle(null); setComments([]); }}
            className="flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-[#138A0A] transition-colors"
            id="back-to-articles"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour aux actualités</span>
          </button>

          {/* Category & Badge Row */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-[#138A0A] rounded text-[10px] uppercase font-black">
              {selectedArticle.category}
            </span>

            <span className="text-[11px] font-mono text-gray-400 flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{new Date(selectedArticle.createdAt).toLocaleDateString("fr-BJ", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="h-3.5 w-3.5" />
                <span>{selectedArticle.views || 0} vues</span>
              </span>
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {selectedArticle.title}
          </h1>

          {/* Author info */}
          <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-[#138A0A]">
              {selectedArticle.author.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-800">{selectedArticle.author}</p>
              <p className="text-[10px] text-gray-400">Rédacteur officiel d&#39;Alerte Bénin</p>
            </div>
          </div>

          {/* Multimedia Players */}
          {selectedArticle.mediaType === "podcast" && selectedArticle.mediaUrl && (
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center animate-pulse">
                  <Volume2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Écouter le podcast audio</h4>
                  <p className="text-[10px] text-gray-400">Diffusé par Alerte Bénin</p>
                </div>
              </div>
              <audio 
                src={selectedArticle.mediaUrl} 
                controls 
                className="w-full h-8 rounded-lg outline-none"
              />
            </div>
          )}

          {selectedArticle.mediaType === "video" && selectedArticle.mediaUrl && (
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-md bg-black relative aspect-video">
              <video 
                src={selectedArticle.mediaUrl} 
                controls 
                poster={selectedArticle.image}
                className="w-full h-full"
              />
            </div>
          )}

          {/* Banner Photo if not video */}
          {selectedArticle.mediaType !== "video" && (
            <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={selectedArticle.image || undefined}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Excerpt panel */}
          <div className="p-4 bg-emerald-50/30 border-l-4 border-[#138A0A] rounded-r-xl text-xs sm:text-sm font-medium text-gray-700 italic leading-relaxed">
            &quot; {selectedArticle.excerpt} &quot;
          </div>

          {/* Content Body */}
          <div className="prose max-w-none text-xs sm:text-sm text-gray-800 leading-relaxed space-y-4">
            {selectedArticle.content.split("\n\n").map((para, idx) => {
              if (para.startsWith("###")) {
                return (
                  <h3 key={idx} className="text-base font-bold text-gray-900 pt-3 border-b border-gray-50 pb-1">
                    {para.replace("###", "").trim()}
                  </h3>
                );
              }
              if (para.startsWith("*")) {
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1.5 my-3">
                    {para.split("\n").map((li, lIdx) => (
                      <li key={lIdx}>{li.replace("*", "").trim()}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={idx}>{para}</p>;
            })}
          </div>

          {/* Share Block */}
          <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-500 flex items-center space-x-1">
              <Share2 className="h-3.5 w-3.5" />
              <span>Partager cet article :</span>
            </span>
            <button
              onClick={() => shareSocial("wa")}
              className="px-3 py-1.5 bg-emerald-50 text-[#138A0A] border border-emerald-200 rounded-lg text-[11px] font-bold hover:bg-emerald-100 transition-colors"
            >
              WhatsApp
            </button>
            <button
              onClick={() => shareSocial("fb")}
              className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-[11px] font-bold hover:bg-blue-100 transition-colors"
            >
              Facebook
            </button>
          </div>

          {/* Comment Zone */}
          <div className="pt-6 border-t border-gray-100 space-y-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center space-x-2">
              <MessageCircle className="h-4.5 w-4.5 text-[#138A0A]" />
              <span>Commentaires ({comments.length})</span>
            </h3>

            {/* Comment Post Form */}
            {currentUser ? (
              <form onSubmit={handlePostComment} className="space-y-3">
                <div className="flex items-start space-x-3">
                  <img
                    src={currentUser.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
                    alt={currentUser.fullname}
                    className="h-8 w-8 rounded-full mt-1 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <textarea
                      rows={3}
                      placeholder="Votre avis nous intéresse... Écrivez un commentaire constructif."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#138A0A] focus:ring-1 focus:ring-[#138A0A] transition-all"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={commentLoading || !newComment.trim()}
                    className="flex items-center space-x-1.5 px-4 py-1.5 bg-[#138A0A] hover:bg-[#0f6f08] text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                  >
                    <Send className="h-3 w-3" />
                    <span>{commentLoading ? "Envoi..." : "Publier"}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-center space-y-2">
                <p className="text-xs text-gray-500">Vous devez être connecté pour participer au débat et laisser un avis.</p>
                <button
                  onClick={onNavigateToAuth}
                  className="px-4 py-1.5 bg-[#138A0A] text-white text-xs font-bold rounded-lg hover:bg-[#0f6f08]"
                >
                  Se connecter
                </button>
              </div>
            )}

            {/* Comment Thread */}
            <div className="space-y-4 pt-2">
              {comments.length > 0 ? (
                comments.map((com) => (
                  <div key={com.id} className="flex items-start space-x-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100 text-xs text-gray-700 animate-fadeIn">
                    <img
                      src={com.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${com.userFullName}`}
                      alt={com.userFullName}
                      className="h-7 w-7 rounded-full shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-800">{com.userFullName}</span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {new Date(com.createdAt).toLocaleDateString("fr-BJ", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="leading-relaxed text-gray-600 font-sans">{com.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 text-center italic py-4">Aucun commentaire rédigé pour le moment. Soyez le premier à réagir !</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Article Listing & Search Filter View */
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              L&#39;Actualité Béninoise
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Suivez l&#39;actualité politique, économique, agricole, éducationnelle et sociétale en continu.
            </p>
          </div>

          {/* Interactive Search & Filter Row */}
          <div className="space-y-4">
            {/* Horizontal Category Slider */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? "bg-[#138A0A] text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* MediaType Select Filters */}
            <div className="flex items-center space-x-2 border-t border-gray-50 pt-3 overflow-x-auto">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mr-2 shrink-0">Formats :</span>
              {mediaTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveMediaType(type.id)}
                  className={`px-2.5 py-1 rounded border text-[10px] font-medium whitespace-nowrap transition-colors ${
                    activeMediaType === type.id
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loader or listings */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-8 w-8 rounded-full border-4 border-emerald-100 border-t-[#138A0A] animate-spin"></div>
              <span className="text-xs text-gray-400 mt-2">Chargement des articles...</span>
            </div>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((art) => (
                <ArticleCard
                  key={art.id}
                  article={art}
                  onSelect={handleArticleSelect}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50">
              <p className="text-sm text-gray-500 font-bold">Aucun article ne correspond à vos critères de recherche.</p>
              <button
                onClick={() => { setActiveCategory("Tous"); setActiveMediaType("Tous"); setSearchQuery(""); }}
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
