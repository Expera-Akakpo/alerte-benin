import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Check, Facebook, Sun, Moon } from "lucide-react";

interface FooterProps {
  setActiveTab: (tab: any) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function Footer({ setActiveTab, darkMode = false, onToggleDarkMode }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Veuillez saisir une adresse email valide.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubscribed(true);
        setEmail("");
      } else {
        setErrorMsg(data.error || "Une erreur est survenue.");
      }
    } catch (err) {
      setErrorMsg("Impossible de joindre le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#111111] text-gray-300 border-t border-gray-800 font-sans" id="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setActiveTab("home")}>
              <img 
                src="/logo.png" 
                alt="Alerte Bénin Logo" 
                className="h-9 w-auto object-contain bg-white p-1 rounded"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed italic">
              &quot;L&#39;information utile, les opportunités réelles.&quot;
            </p>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              Média béninois indépendant dédié à la diffusion des opportunités de recrutement, stages, bourses, concours et de l&#39;actualité locale.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3 pt-2">
              <a 
                href="https://www.facebook.com/people/Alerte-B%C3%A9nin/100084176231018/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-8 w-8 rounded bg-gray-800 flex items-center justify-center hover:bg-[#138A0A] hover:text-white transition-colors border border-gray-700"
                title="Suivez-nous sur Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="https://www.tiktok.com/@Alerte%20B%C3%A9nin" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-8 w-8 rounded bg-gray-800 flex items-center justify-center hover:bg-[#000000] hover:text-white transition-colors border border-gray-700 text-gray-300"
                title="Suivez-nous sur TikTok"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.95 1.15 2.27 1.94 3.71 2.23v3.91c-1.3-.12-2.58-.57-3.66-1.31-.9-.63-1.63-1.48-2.12-2.47v7.54c0 1.58-.33 3.16-1.14 4.51-.78 1.34-1.93 2.4-3.31 3.03-1.39.63-2.95.77-4.42.44-1.46-.33-2.81-1.15-3.8-2.31-1.07-1.25-1.63-2.88-1.57-4.52.05-1.52.61-3 1.6-4.16.99-1.17 2.37-1.92 3.88-2.13v3.9c-.64.1-1.25.38-1.74.81-.53.47-.89 1.1-.99 1.8-.13.88.1 1.77.62 2.47.53.68 1.32 1.11 2.17 1.19.86.07 1.73-.18 2.42-.71.74-.58 1.17-1.48 1.17-2.42l-.02-12.72c1.33-.02 2.66-.02 3.99-.02z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 border-l-2 border-[#138A0A] pl-2 font-mono">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab("home")} className="hover:text-[#138A0A] transition-colors font-medium">
                  Accueil principal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("news")} className="hover:text-[#138A0A] transition-colors font-medium">
                  Actualités nationales
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("opportunities")} className="hover:text-[#138A0A] transition-colors font-medium">
                  Offres & Opportunités
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("about")} className="hover:text-[#138A0A] transition-colors font-medium">
                  À propos d&#39;Alerte Bénin
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("dashboard")} className="hover:text-[#138A0A] transition-colors font-medium">
                  Espace Candidat (Profil)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 border-l-2 border-[#F5B400] pl-2 font-mono">
              Contact & Siège
            </h3>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start space-x-2.5">
                <MapPin className="h-4 w-4 text-[#138A0A] shrink-0 mt-0.5" />
                <span className="font-medium">BP77, Cotonou, Bénin</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-[#F5B400] shrink-0" />
                <a href="tel:+2290140873589" className="hover:text-white transition-colors font-medium">
                  +229 01 40 87 35 89
                </a>
              </li>
              <li className="flex items-start space-x-2.5">
                <Mail className="h-4 w-4 text-[#D62828] shrink-0 mt-0.5" />
                <span className="font-medium">contact@alertebenin.bj</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Widget */}
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 border-l-2 border-[#D62828] pl-2 font-mono">
              Newsletter Gratuite
            </h3>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed font-medium">
              Recevez gratuitement les dernières actualités et opportunités directement dans votre boîte mail.
            </p>
            {subscribed ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded text-emerald-400 text-xs flex items-center space-x-2">
                <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>Merci de votre inscription à notre lettre !</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Votre adresse email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 text-xs bg-gray-900 border border-gray-800 rounded text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#138A0A]"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-1 top-1 h-7 w-7 bg-[#138A0A] hover:bg-[#0f6f08] rounded flex items-center justify-center text-white transition-colors"
                  >
                    <Send className="h-3 w-3" />
                  </button>
                </div>
                {errorMsg && <p className="text-[10px] text-red-500">{errorMsg}</p>}
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} ALERTE BÉNIN. Tous droits réservés.</p>
          
          {/* Interrupteur Mode Sombre */}
          {onToggleDarkMode && (
            <button 
              onClick={onToggleDarkMode}
              className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 px-3.5 py-1.5 rounded-full text-gray-300 hover:text-white transition-all cursor-pointer focus:outline-none font-sans shadow-sm"
              title={darkMode ? "Passer au mode clair" : "Passer au mode sombre"}
            >
              {darkMode ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-[10px] uppercase tracking-wider font-bold">Mode Clair</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="text-[10px] uppercase tracking-wider font-bold">Mode Sombre</span>
                </>
              )}
            </button>
          )}

          <div className="flex space-x-4">
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveTab("about")}>Mentions Légales</span>
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveTab("about")}>Politique de confidentialité</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
