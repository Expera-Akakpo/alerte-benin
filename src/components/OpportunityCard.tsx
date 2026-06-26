import React, { useState } from "react";
import { Heart, Share2, Calendar, MapPin, Award, Check, ExternalLink } from "lucide-react";
import { Opportunity, User } from "../types";

interface OpportunityCardProps {
  key?: any;
  opportunity: Opportunity;
  currentUser: User | null;
  onSelect: (opp: Opportunity) => void;
  onToggleSave: (oppId: string) => Promise<void>;
  isSaved: boolean;
}

export default function OpportunityCard({
  opportunity,
  currentUser,
  onSelect,
  onToggleSave,
  isSaved,
}: OpportunityCardProps) {
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savingInProcess, setSavingInProcess] = useState(false);

  // Format deadline date
  const formatDeadline = (dateStr: string) => {
    const d = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
    return d.toLocaleDateString("fr-BJ", options);
  };

  const isExpired = new Date(opportunity.deadline).getTime() < Date.now();

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      alert("Veuillez vous connecter pour enregistrer cette opportunité.");
      return;
    }
    setSavingInProcess(true);
    await onToggleSave(opportunity.id);
    setSavingInProcess(false);
  };

  const handleShareClick = (e: React.MouseEvent, type: "copy" | "whatsapp" | "facebook" | "twitter") => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/?oppId=${opportunity.id}`;
    const shareTitle = `Alerte Bénin : ${opportunity.title}`;
    let url = "";

    if (type === "copy") {
      navigator.clipboard.writeText(`${shareTitle} - Consulter sur : ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    } else if (type === "whatsapp") {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} : ${shareUrl}`)}`;
    } else if (type === "facebook") {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    } else if (type === "twitter") {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
    }

    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.click();
    }
  };

  return (
    <div 
      onClick={() => onSelect(opportunity)}
      className={`group bg-white border rounded overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer relative flex flex-col justify-between h-full ${
        isExpired ? "border-gray-200 opacity-80" : "border-gray-200"
      }`}
      id={`opp-card-${opportunity.id}`}
    >
      {/* Upper Segment: Banner Image & Badges */}
      <div className="relative h-40 w-full bg-gray-100 overflow-hidden shrink-0">
        <img
          src={opportunity.image || "https://images.unsplash.com/photo-1521791136368-1a46827d0adb?q=80&w=600"}
          alt={opportunity.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {/* Overlay category badge */}
        <div className="absolute top-3 left-3 bg-[#138A0A] text-white px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest shadow-sm">
          {opportunity.category}
        </div>

        {/* Saved Trigger */}
        <button
          onClick={handleSaveClick}
          disabled={savingInProcess}
          className={`absolute top-3 right-3 h-8 w-8 rounded flex items-center justify-center border transition-colors shadow-sm ${
            isSaved
              ? "bg-red-50 border-red-100 text-[#D62828] hover:bg-red-100"
              : "bg-white/90 backdrop-blur-xs border-gray-200 text-gray-500 hover:text-[#D62828]"
          }`}
          title={isSaved ? "Retirer des favoris" : "Enregistrer dans mes opportunités"}
        >
          <Heart className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
        </button>

        {/* Expired overlay warning */}
        {isExpired && (
          <div className="absolute inset-0 bg-gray-950/50 backdrop-blur-[1px] flex items-center justify-center">
            <span className="px-2.5 py-1 bg-[#D62828] text-white rounded-sm text-[9px] font-black uppercase tracking-widest shadow-sm">
              Date Limite Dépassée
            </span>
          </div>
        )}
      </div>

      {/* Main Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Company / Recruiter Name */}
          <span className="text-[10px] font-black tracking-widest text-amber-600 uppercase flex items-center space-x-1 font-mono">
            <Award className="h-3 w-3 shrink-0" />
            <span className="truncate">{opportunity.company || "Non Spécifié"}</span>
          </span>

          {/* Title */}
          <h3 className="text-base font-black text-gray-900 group-hover:text-[#138A0A] font-serif line-clamp-2 transition-colors leading-tight">
            {opportunity.title}
          </h3>

          {/* Details Row (Location / Level) */}
          <div className="flex flex-wrap gap-y-1.5 gap-x-3 text-[10px] text-gray-500 pt-1 font-medium font-sans">
            <span className="flex items-center space-x-1">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span>{opportunity.country}</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="px-1.5 py-0.5 rounded-sm bg-gray-100 text-gray-600 border border-gray-200 font-mono text-[9px]">
                {opportunity.studyLevel}
              </span>
            </span>
          </div>
        </div>

        {/* Footer info & Actions */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] font-sans">
          {/* Deadline counter */}
          <span className={`flex items-center space-x-1 ${isExpired ? "text-[#D62828] font-bold" : "text-gray-500 font-medium"}`}>
            <Calendar className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <span>Limite : {formatDeadline(opportunity.deadline)}</span>
          </span>

          {/* Share Actions Panel */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShareMenuOpen(!shareMenuOpen);
              }}
              className="p-1.5 text-gray-400 hover:text-[#138A0A] hover:bg-gray-50 rounded transition-colors border border-gray-200"
              title="Partager l'opportunité"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>

            {shareMenuOpen && (
              <div 
                className="absolute bottom-full right-0 mb-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-40 text-left animate-fadeIn font-sans"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => { handleShareClick(e, "copy"); setShareMenuOpen(false); }}
                  className="flex items-center space-x-2 w-full px-3 py-1.5 hover:bg-gray-50 text-gray-700 text-[10px] font-semibold"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> : <ExternalLink className="h-3.5 w-3.5 text-gray-400 shrink-0" />}
                  <span>{copied ? "Copié !" : "Copier le lien"}</span>
                </button>
                <button
                  onClick={(e) => { handleShareClick(e, "whatsapp"); setShareMenuOpen(false); }}
                  className="flex items-center space-x-2 w-full px-3 py-1.5 hover:bg-gray-50 text-gray-700 text-[10px] font-semibold"
                >
                  <svg className="h-3.5 w-3.5 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={(e) => { handleShareClick(e, "facebook"); setShareMenuOpen(false); }}
                  className="flex items-center space-x-2 w-full px-3 py-1.5 hover:bg-gray-50 text-gray-700 text-[10px] font-semibold"
                >
                  <svg className="h-3.5 w-3.5 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </button>
                <button
                  onClick={(e) => { handleShareClick(e, "twitter"); setShareMenuOpen(false); }}
                  className="flex items-center space-x-2 w-full px-3 py-1.5 hover:bg-gray-50 text-gray-700 text-[10px] font-semibold"
                >
                  <svg className="h-3 w-3 text-gray-800 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>Twitter / X</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
