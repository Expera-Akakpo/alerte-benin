import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Check, Facebook, Award, Target, Eye, Quote } from "lucide-react";

export default function AboutContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMsg("Veuillez remplir tous les champs obligatoires (Nom, Email, Sujet, Message).");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setErrorMsg(data.error || "Une erreur est survenue.");
      }
    } catch (err) {
      setErrorMsg("Impossible de joindre le serveur de messagerie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fadeIn" id="about-contact-section">
      
      {/* Upper Segment: Mission Statement & Quotes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* About Info */}
        <div className="lg:col-span-7 space-y-5 text-left">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/60 rounded-full text-[10px] font-bold text-[#138A0A] uppercase tracking-wider">
            <span>Qui sommes-nous ?</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Notre Mission pour le Bénin
          </h1>

          <div className="text-xs sm:text-sm text-gray-600 space-y-4 leading-relaxed font-sans">
            <p>
              ALERTE BÉNIN est une plateforme numérique d&#39;information et d&#39;opportunités créée pour rapprocher les citoyens béninois des informations utiles qui impactent leur quotidien.
            </p>
            <p>
              Notre mission est de rendre l&#39;information accessible à tous, de promouvoir les opportunités d&#39;emploi, de formation, de financement et d&#39;entrepreneuriat, tout en valorisant les initiatives, les produits et les services qui contribuent au développement économique et social du Bénin.
            </p>
            <p>
              Nous croyons qu&#39;un citoyen bien informé est mieux préparé à saisir les opportunités qui peuvent transformer sa vie. À travers nos publications quotidiennes, nous nous engageons à fournir une information fiable, utile, rapide et accessible à tous.
            </p>
          </div>

          {/* Golden Quote Panel */}
          <div className="p-5 bg-amber-50 border-l-4 border-[#F5B400] rounded-r-2xl relative overflow-hidden shadow-xs">
            <Quote className="absolute right-3 bottom-1 h-20 w-20 text-amber-100 shrink-0 pointer-events-none" />
            <p className="text-[#222222] font-serif text-sm sm:text-base italic relative z-10 leading-relaxed">
              « À l’ère où l’information est une arme, l’ignorance devient une blessure volontaire. »
            </p>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-amber-700 mt-2 relative z-10">
              — Citation Officielle, Alerte Bénin
            </span>
          </div>
        </div>

        {/* Vision / Values Bento Box */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-4">
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-start space-x-3.5">
            <div className="h-10 w-10 bg-emerald-50 text-[#138A0A] rounded-xl flex items-center justify-center shrink-0 border border-emerald-100">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Fiabilité absolue</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
                Toutes nos offres d&#39;emplois, concours et bourses font l&#39;objet d&#39;une vérification rigoureuse avant publication pour éviter les arnaques.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-start space-x-3.5">
            <div className="h-10 w-10 bg-yellow-50 text-[#F5B400] rounded-xl flex items-center justify-center shrink-0 border border-yellow-100">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Inclusion & Proximité</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
                Nous nous assurons que les ruraux comme les urbains accèdent aux mêmes opportunités d&#39;études et de financements sans discrimination.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-start space-x-3.5">
            <div className="h-10 w-10 bg-red-50 text-[#D62828] rounded-xl flex items-center justify-center shrink-0 border border-red-100">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Transparence & Vision</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
                Nous soutenons l&#39;esprit d&#39;initiative et diffusons des podcasts explicatifs pour démocratiser la compréhension des financements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Segment: Map & Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-gray-100">
        
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4 text-left">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-gray-900">
              Écrivez à la Rédaction
            </h2>
            <p className="text-[11px] text-gray-400">
              Une remarque, un partenariat, un produit à promouvoir au Bénin ? Laissez-nous un message.
            </p>
          </div>

          {submitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <Check className="h-10 w-10 text-emerald-500 mx-auto" />
              <h4 className="text-xs font-bold text-emerald-800">Message transmis avec succès !</h4>
              <p className="text-[11px] text-emerald-600 max-w-sm mx-auto">
                Notre équipe éditoriale basée à Cotonou prendra connaissance de votre courriel et reviendra vers vous sous 48h.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-1.5 bg-[#138A0A] hover:bg-[#0f6f08] text-white text-xs font-bold rounded-lg"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Votre Nom complet <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#138A0A]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Votre adresse Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#138A0A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Numéro de Téléphone (Optionnel)</label>
                  <input
                    type="text"
                    placeholder="Ex: +229 01 40 87 35 89"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#138A0A]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Sujet du Message <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Ex: Demande de partenariat éditorial"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#138A0A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Message détaillé <span className="text-red-500">*</span></label>
                <textarea
                  rows={4}
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Écrivez ici l'objet complet de votre demande..."
                  className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#138A0A]"
                />
              </div>

              {errorMsg && <p className="text-[10px] text-red-500 font-bold">{errorMsg}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#138A0A] hover:bg-[#0f6f08] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all duration-150 flex items-center justify-center space-x-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{loading ? "Envoi en cours..." : "Transmettre le message"}</span>
              </button>
            </form>
          )}
        </div>

        {/* Coordinates & Map Column */}
        <div className="lg:col-span-5 space-y-6 text-left">
          {/* Coordinates Panel */}
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-3xl space-y-4">
            <h3 className="text-xs uppercase font-extrabold text-gray-400 tracking-widest border-b border-gray-200 pb-2">
              Coordonnées Officielles
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-2.5">
                <MapPin className="h-4.5 w-4.5 text-[#138A0A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-800">Siège Social</p>
                  <p className="text-gray-500">BP77, Cotonou, Bénin</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Phone className="h-4.5 w-4.5 text-[#F5B400] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-800">Téléphone Direct</p>
                  <a href="tel:+2290140873589" className="text-gray-500 hover:text-[#138A0A] transition-colors font-medium">
                    +229 01 40 87 35 89
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Mail className="h-4.5 w-4.5 text-[#D62828] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-800">Secrétariat Général</p>
                  <p className="text-gray-500">contact@alertebenin.bj</p>
                </div>
              </div>
            </div>

            {/* Social Channels Block */}
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <h4 className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">
                Nos Réseaux Sociaux & Canal
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <a 
                  href="https://whatsapp.com/channel/0029VahkOQpJkK7DELtEsS3J" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl transition-all shadow-xs group"
                >
                  <div className="h-7 w-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <svg className="h-4 w-4 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.011 0C5.38 0 0 5.379 0 12.01c0 2.116.552 4.182 1.602 6.002L.06 23.94l6.096-1.599A11.96 11.96 0 0012.011 24c6.63 0 12.01-5.379 12.01-12.01 0-6.631-5.38-12.01-12.01-12.01zm6.59 17.022c-.272.766-1.353 1.4-1.88 1.458-.49.053-1.127.108-3.626-.889-2.982-1.192-4.9-4.22-5.05-4.417-.15-.197-1.21-1.61-1.21-3.072 0-1.463.766-2.181 1.038-2.48.272-.3.597-.375.795-.375.197 0 .396.002.57.009.184.007.433-.07.677.516.244.586.834 2.036.907 2.183.073.147.122.322.024.516-.098.194-.147.316-.29.492-.147.176-.312.393-.445.528-.147.147-.301.308-.13.602.172.294.762 1.258 1.636 2.038 1.124.999 2.072 1.31 2.366 1.458.294.147.466.122.639-.074.172-.196.737-.858.932-1.152.196-.294.393-.245.662-.147.27.098 1.714.808 2.008.956.294.147.49.221.563.344.073.123.073.712-.199 1.478z"/>
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-xs font-bold leading-tight">Canal WhatsApp Officiel</p>
                    <p className="text-[10px] text-emerald-100 font-medium">Rejoignez pour recevoir les alertes directes</p>
                  </div>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <a 
                    href="https://www.facebook.com/profile.php?id=100084176231018" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 p-2 bg-white hover:bg-blue-50 border border-gray-200 rounded-xl text-[#1877F2] transition-all text-xs font-bold"
                  >
                    <Facebook className="h-4 w-4 shrink-0" />
                    <span className="truncate">Facebook</span>
                  </a>

                  <a 
                    href="https://www.tiktok.com/@alertebenin229?_r=1&_t=ZN-96MNaVUoskg" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 p-2 bg-white hover:bg-pink-50 border border-gray-200 rounded-xl text-gray-900 transition-all text-xs font-bold"
                  >
                    <svg className="h-4 w-4 fill-current shrink-0 text-[#FE2C55]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.95 1.15 2.27 1.94 3.71 2.23v3.91c-1.3-.12-2.58-.57-3.66-1.31-.9-.63-1.63-1.48-2.12-2.47v7.54c0 1.58-.33 3.16-1.14 4.51-.78 1.34-1.93 2.4-3.31 3.03-1.39.63-2.95.77-4.42.44-1.46-.33-2.81-1.15-3.8-2.31-1.07-1.25-1.63-2.88-1.57-4.52.05-1.52.61-3 1.6-4.16.99-1.17 2.37-1.92 3.88-2.13v3.9c-.64.1-1.25.38-1.74.81-.53.47-.89 1.1-.99 1.8-.13.88.1 1.77.62 2.47.53.68 1.32 1.11 2.17 1.19.86.07 1.73-.18 2.42-.71.74-.58 1.17-1.48 1.17-2.42l-.02-12.72c1.33-.02 2.66-.02 3.99-.02z"/>
                    </svg>
                    <span className="truncate">TikTok</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Block */}
          <div className="bg-white border border-gray-100 p-2.5 rounded-3xl shadow-xs overflow-hidden h-64 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63454.51261545645!2d2.3957268486328114!3d6.370292795856754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10235591d5757575%3A0x138e6e5ebad6ea29!2sCotonou!5e0!3m2!1sfr!2sbj!4v1719360000000!5m2!1sfr!2sbj"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-2xl"
              title="Carte de localisation Cotonou, Bénin"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
}
