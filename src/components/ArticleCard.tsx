import React from "react";
import { Clock, Eye, MessageSquare, Volume2, Video, FileText, User } from "lucide-react";
import { Article } from "../types";

interface ArticleCardProps {
  key?: any;
  article: Article;
  onSelect: (article: Article) => void;
  commentsCount?: number;
}

export default function ArticleCard({ article, onSelect, commentsCount = 0 }: ArticleCardProps) {
  // Format published or created date
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-BJ", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // Get Media Badges
  const getMediaBadge = () => {
    switch (article.mediaType) {
      case "podcast":
        return {
          label: "Podcast Audio",
          className: "bg-blue-50 border-blue-200 text-blue-600",
          icon: Volume2
        };
      case "video":
        return {
          label: "Reportage Vidéo",
          className: "bg-red-50 border-red-200 text-red-600",
          icon: Video
        };
      case "interview":
        return {
          label: "Interview",
          className: "bg-purple-50 border-purple-200 text-purple-600",
          icon: User
        };
      default:
        return {
          label: "Article Rédigé",
          className: "bg-emerald-50 border-emerald-200 text-emerald-600",
          icon: FileText
        };
    }
  };

  const badge = getMediaBadge();
  const BadgeIcon = badge.icon;

  return (
    <article 
      onClick={() => onSelect(article)}
      className="group flex flex-col bg-white border border-gray-200 rounded overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-300 cursor-pointer h-full"
      id={`article-card-${article.id}`}
    >
      {/* Article Image Frame */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        <img
          src={article.image || "https://images.unsplash.com/photo-1594901861115-b3a37d61b319?q=80&w=600"}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {/* Overlay category tag */}
        <div className="absolute top-3 left-3 bg-[#138A0A] text-white px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest shadow-sm">
          {article.category}
        </div>

        {/* Play badge overlay if multimedia */}
        {article.mediaType !== "article" && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
            <div className="h-10 w-10 rounded bg-white flex items-center justify-center text-gray-900 shadow-md transform group-hover:scale-105 transition-transform">
              <BadgeIcon className="h-4 w-4 text-[#138A0A]" />
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
            <span className="flex items-center space-x-1">
              <Clock className="h-3 w-3 shrink-0 text-gray-400" />
              <span>{formatDate(article.publishedAt || article.createdAt)}</span>
            </span>
            <span className="flex items-center space-x-1.5 px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider bg-gray-50 border-gray-200 text-[#138A0A]">
              <BadgeIcon className="h-2.5 w-2.5" />
              <span>{badge.label}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-black text-gray-900 group-hover:text-[#138A0A] font-serif line-clamp-2 transition-colors duration-200 leading-tight">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Social Share Bar */}
        <div className="flex items-center space-x-2 pt-2 border-t border-dashed border-gray-100">
          <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400">Partager :</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const shareUrl = `${window.location.origin}/?article=${article.id}`;
              const shareTitle = `Alerte Bénin : ${article.title}`;
              const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} : ${shareUrl}`)}`;
              const a = document.createElement("a");
              a.href = waUrl;
              a.target = "_blank";
              a.rel = "noopener noreferrer";
              a.click();
            }}
            className="h-6 w-6 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm border border-emerald-100"
            title="Partager sur WhatsApp"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const shareUrl = `${window.location.origin}/?article=${article.id}`;
              const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
              const a = document.createElement("a");
              a.href = fbUrl;
              a.target = "_blank";
              a.rel = "noopener noreferrer";
              a.click();
            }}
            className="h-6 w-6 rounded bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm border border-blue-100"
            title="Partager sur Facebook"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const shareUrl = `${window.location.origin}/?article=${article.id}`;
              const shareTitle = `Alerte Bénin : ${article.title}`;
              const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
              const a = document.createElement("a");
              a.href = twUrl;
              a.target = "_blank";
              a.rel = "noopener noreferrer";
              a.click();
            }}
            className="h-6 w-6 rounded bg-gray-50 text-gray-800 hover:bg-gray-950 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm border border-gray-200"
            title="Partager sur Twitter / X"
          >
            <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </button>
        </div>

        {/* Footer info (views, comments, read button) */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-sans">
          <div className="flex space-x-3">
            <span className="flex items-center space-x-1">
              <Eye className="h-3.5 w-3.5 shrink-0" />
              <span>{article.views || 0}</span>
            </span>
            <span className="flex items-center space-x-1">
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              <span>{commentsCount || 0}</span>
            </span>
          </div>

          <span className="font-bold text-xs text-[#138A0A] group-hover:translate-x-1 transition-transform inline-flex items-center space-x-0.5 uppercase tracking-widest">
            <span>LIRE</span>
            <span>→</span>
          </span>
        </div>
      </div>
    </article>
  );
}
