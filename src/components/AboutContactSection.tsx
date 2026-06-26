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
