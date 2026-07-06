import { motion } from "motion/react";
import { Newspaper, Briefcase, Bell, ArrowRight, Award } from "lucide-react";

interface HeroProps {
  setActiveTab: (tab: "home" | "news" | "opportunities" | "about" | "dashboard" | "admin") => void;
}

export default function Hero({ setActiveTab }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-emerald-50/20 border-b border-gray-100 py-12 sm:py-16 md:py-20" id="hero-section">
      {/* Decorative Grid or Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#138A0A_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-10"></div>
      <div className="absolute top-2/3 right-10 w-72 h-72 rounded-full bg-yellow-400/5 blur-3xl"></div>
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tag / Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-white border border-[#D62828] rounded text-[10px] font-black text-[#D62828] uppercase tracking-widest"
            >
              <Bell className="h-3 w-3 animate-pulse" />
              <span>L&#39;information utile, les opportunités réelles.</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#222222] leading-tight font-serif"
            >
              Les actualités et <span className="text-[#138A0A] underline decoration-[#F5B400] decoration-3">opportunités</span> du Bénin en temps réel
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl font-medium"
            >
              Restez informé des dernières nouvelles, offres d&#39;emplois, stages, recrutements, concours nationaux, bourses d&#39;études et appels à projets disponibles au Bénin et à l&#39;international.
            </motion.p>

            {/* Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2 font-sans"
            >
              <button
                onClick={() => setActiveTab("news")}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-[#138A0A] hover:bg-[#0f6f08] text-white text-xs font-bold uppercase tracking-wider rounded transition-all duration-200 shadow-xs"
                id="hero-view-news-btn"
              >
                <Newspaper className="h-4 w-4" />
                <span>Voir les actualités</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => setActiveTab("opportunities")}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-white hover:bg-gray-50 text-[#222222] border border-gray-200 text-xs font-bold uppercase tracking-wider rounded transition-all duration-200"
                id="hero-view-opps-btn"
              >
                <Briefcase className="h-4 w-4 text-[#F5B400]" />
                <span>Voir les opportunités</span>
              </button>

              <a
                href="https://whatsapp.com/channel/0029VahkOQpJkK7DELtEsS3J"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 px-5 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold uppercase tracking-wider rounded transition-all duration-200 shadow-xs"
                id="hero-whatsapp-btn"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.011 0C5.38 0 0 5.379 0 12.01c0 2.116.552 4.182 1.602 6.002L.06 23.94l6.096-1.599A11.96 11.96 0 0012.011 24c6.63 0 12.01-5.379 12.01-12.01 0-6.631-5.38-12.01-12.01-12.01zm6.59 17.022c-.272.766-1.353 1.4-1.88 1.458-.49.053-1.127.108-3.626-.889-2.982-1.192-4.9-4.22-5.05-4.417-.15-.197-1.21-1.61-1.21-3.072 0-1.463.766-2.181 1.038-2.48.272-.3.597-.375.795-.375.197 0 .396.002.57.009.184.007.433-.07.677.516.244.586.834 2.036.907 2.183.073.147.122.322.024.516-.098.194-.147.316-.29.492-.147.176-.312.393-.445.528-.147.147-.301.308-.13.602.172.294.762 1.258 1.636 2.038 1.124.999 2.072 1.31 2.366 1.458.294.147.466.122.639-.074.172-.196.737-.858.932-1.152.196-.294.393-.245.662-.147.27.098 1.714.808 2.008.956.294.147.49.221.563.344.073.123.073.712-.199 1.478z"/>
                </svg>
                <span>Canal WhatsApp</span>
              </a>
            </motion.div>

            {/* Stat Counters Row */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 max-w-md font-sans"
            >
              <div>
                <span className="block text-xl sm:text-2xl font-black text-[#222222] font-serif">24/24</span>
                <span className="block text-[9px] uppercase font-black tracking-widest text-[#D62828]">Infos en continu</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-black text-[#138A0A] font-serif">100%</span>
                <span className="block text-[9px] uppercase font-black tracking-widest text-gray-500">Réelles</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-black text-[#F5B400] font-serif">+10k</span>
                <span className="block text-[9px] uppercase font-black tracking-widest text-gray-500">Abonnés</span>
              </div>
            </motion.div>
          </div>

          {/* Right Side Visual Grid or Highlight */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative mx-auto max-w-md"
            >
              {/* Outer frame */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#138A0A] via-[#F5B400] to-[#D62828] opacity-30 blur-md"></div>
              
              {/* Main Card Content */}
              <div className="relative bg-white border border-gray-100 rounded-2xl p-5 shadow-2xl space-y-4 text-xs">
                {/* Visual Banner */}
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600" 
                    alt="Jeunesse active"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-[#F5B400]">Dernier Rapport</span>
                    <h4 className="text-sm font-bold tracking-tight">Cotonou s&#39;arme d&#39;un nouveau centre numérique d&#39;innovation</h4>
                  </div>
                </div>

                {/* Micro Feed */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer" onClick={() => setActiveTab("opportunities")}>
                    <div className="h-8 w-8 rounded bg-emerald-50 flex items-center justify-center text-[#138A0A] shrink-0 font-bold">
                      💼
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 truncate">MTN Bénin recrute des Conseillers Clientèle</p>
                      <p className="text-[10px] text-gray-400">Date limite: 31 août 2026</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer" onClick={() => setActiveTab("opportunities")}>
                    <div className="h-8 w-8 rounded bg-yellow-50 flex items-center justify-center text-[#F5B400] shrink-0 font-bold">
                      🎓
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 truncate">Bourses d&#39;études d&#39;Excellence de la Fondation Alerte</p>
                      <p className="text-[10px] text-gray-400">Master & Doctorat européens</p>
                    </div>
                  </div>
                </div>

                {/* Banner Badge */}
                <div className="flex items-center justify-between text-[10px] text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                  <div className="flex items-center space-x-1.5">
                    <Award className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="font-medium text-gray-700">Média Certifié Conforme</span>
                  </div>
                  <span className="text-gray-400 font-mono">ID: 229-ALERTE</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
