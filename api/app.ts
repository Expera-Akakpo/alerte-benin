import express from "express";
import path from "path";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const app = express();
const PORT = 3000;

app.use(express.json());

// Paths for persistent local databases (using process.cwd() for ESM/CJS neutrality)
const DATA_DIR = path.join(process.cwd(), "data");
const ARTICLES_FILE = path.join(DATA_DIR, "articles.json");
const OPPORTUNITIES_FILE = path.join(DATA_DIR, "opportunities.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const CONTACTS_FILE = path.join(DATA_DIR, "contacts.json");
const NEWSLETTER_FILE = path.join(DATA_DIR, "newsletters.json");
const COMMENTS_FILE = path.join(DATA_DIR, "comments.json");

// Ensure data directory and files exist with seed data
function ensureDataStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Pre-seed Users (Admin and standard test users)
  if (!fs.existsSync(USERS_FILE)) {
    const seedUsers = [
      {
        id: "usr_admin",
        email: "admin@alertebenin.bj",
        password: "admin", // Simple password for demo
        fullname: "Administrateur Alerte Bénin",
        role: "admin",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=admin",
        createdAt: new Date().toISOString()
      },
      {
        id: "usr_test",
        email: "citoyen@alertebenin.bj",
        password: "user",
        fullname: "Codjo Gbènamè",
        role: "user",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=citoyen",
        createdAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(seedUsers, null, 2), "utf8");
  }

  // Pre-seed Articles
  if (!fs.existsSync(ARTICLES_FILE)) {
    const seedArticles = [
      {
        id: "art_1",
        title: "Relance de la filière coton au Bénin : Des chiffres records annoncés pour la campagne",
        slug: "relance-filiere-coton-benin-chiffres-records",
        excerpt: "Le ministre de l’Agriculture a présenté le bilan provisoire de la campagne cotonnière, affichant des rendements historiques pour les producteurs locaux.",
        content: `La filière de l’or blanc béninois se porte au mieux de sa forme. Lors d'un point de presse tenu hier à Cotonou, le ministre de l’Agriculture, de l’Élevage et de la Pêche a dévoilé des chiffres particulièrement encourageants pour la campagne cotonnière en cours. 

Grâce à des réformes structurelles rigoureuses, un accès facilité aux intrants de qualité et une météo favorable, la production nationale devrait franchir un nouveau cap historique. 

### Des producteurs mieux rémunérés
L'un des points clés de cette réussite réside dans la revalorisation constante du prix d'achat du coton graine aux producteurs locaux. Cette mesure a permis d'encourager des milliers de familles agricoles à étendre leurs surfaces cultivables au nord et au centre du Bénin.

"Nous voyons le fruit d'un investissement massif de l'État et de ses partenaires. C’est la preuve que notre souveraineté agricole progresse," s'est réjoui un représentant des coopératives agricoles de Banikoara.

### Perspectives industrielles
L’ambition du Bénin ne s'arrête pas à la production brute. À travers la zone industrielle de Glo-Djigbé (GDIZ), une part croissante de cette production est désormais transformée localement en textiles à forte valeur ajoutée, générant des milliers d'emplois pour la jeunesse béninoise.`,
        image: "https://images.unsplash.com/photo-1594901861115-b3a37d61b319?q=80&w=1000",
        category: "Agriculture",
        author: "Équipe Rédactionnelle",
        status: "published",
        mediaType: "article",
        views: 2450,
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
        publishedAt: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: "art_2",
        title: "Cotonou s'arme d'un nouveau centre d'innovation numérique pour la jeunesse",
        slug: "cotonou-nouveau-centre-innovation-numerique-jeunesse",
        excerpt: "Situé au cœur de la capitale économique, ce hub technologique ultramoderne offrira des formations gratuites en codage et intelligence artificielle.",
        content: `Le Bénin poursuit sa transformation numérique à grands pas. Un nouveau jalon vient d'être posé avec l'inauguration d'un grand pôle technologique à Cotonou. Ce centre, financé en partenariat public-privé, est destiné à accueillir les étudiants, les freelances et les jeunes porteurs de projets technologiques.

L'espace propose des postes de travail connectés en haut débit, un fablab pour le prototypage matériel, ainsi que des salles de conférence pour des événements axés sur la tech.

### Des formations de pointe gratuites
Le point fort du centre réside dans ses programmes de certification. Dès le mois prochain, des sessions intensives de formation (bootcamps) débuteront sur des sujets tels que :
* Le développement Full Stack (React, Node.js, Python)
* La science des données et l'Intelligence Artificielle
* Le design d'interface (UI/UX)
* La cybersécurité

"Le Bénin regorge de talents créatifs. Notre rôle est de leur offrir le cadre technique et l'accompagnement pédagogique pour qu'ils conçoivent les solutions africaines de demain," a déclaré la directrice générale du centre lors de la coupure du ruban.`,
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000",
        category: "Technologie",
        author: "Alerte Tech",
        status: "published",
        mediaType: "article",
        views: 1890,
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
        publishedAt: new Date(Date.now() - 3600000 * 48).toISOString()
      },
      {
        id: "art_3",
        title: "Podcast : Comprendre les enjeux du crédit agricole pour les jeunes entrepreneurs du Bénin",
        slug: "podcast-enjeux-credit-agricole-jeunes-entrepreneurs-benin",
        excerpt: "Dans ce nouvel épisode de nos rapports audio, nous recevons un analyste financier pour décrypter les mécanismes d’accès aux financements ruraux.",
        content: `Bienvenue sur le podcast d'Alerte Bénin ! Aujourd'hui, nous plongeons dans une thématique vitale pour le développement rural : le crédit agricole. 

Comment un jeune diplômé peut-il obtenir un prêt pour lancer son exploitation agricole en milieu rural ? Quelles sont les garanties exigées et comment l'État béninois soutient-il ces initiatives à travers le Fonds National de Développement Agricole (FNDA) ?

### Invité spécial
Nous recevons **M. Géraud HOUNDEGNON**, consultant en finance rurale et partenaire des coopératives de production agricole.

*(Écoutez le podcast complet en utilisant le lecteur audio ci-dessus)*

### Points clés abordés dans l'interview :
1. **La structuration du projet :** Pourquoi 80% des demandes de crédit sont rejetées par manque de business plan réaliste.
2. **Le rôle du FNDA :** Comment l'État apporte sa garantie pour réduire le taux d'intérêt auprès des banques locales.
3. **Le suivi technique :** L'importance de se faire accompagner par un conseiller agricole pour rassurer les bailleurs de fonds.`,
        image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1000",
        category: "Économie",
        author: "La Rédaction Audio",
        status: "published",
        mediaType: "podcast",
        mediaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Demo audio
        views: 1220,
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
        publishedAt: new Date(Date.now() - 3600000 * 12).toISOString()
      },
      {
        id: "art_4",
        title: "Reportage Vidéo : immersion à Sèmè City, la cité béninoise du savoir et de l'innovation",
        slug: "reportage-video-immersion-seme-city-cite-savoir-innovation",
        excerpt: "Découvrez à travers nos caméras les projets révolutionnaires nés à Sèmè City, de l'impression 3D médicale au recyclage écologique.",
        content: `Sèmè City est devenue en quelques années le symbole du dynamisme éducatif et entrepreneurial du Bénin. Dans ce reportage vidéo exclusif, notre équipe s'est rendue sur place pour rencontrer ces chercheurs et inventeurs qui changent le quotidien des populations.

### Des innovations locales pour répondre à des défis globaux
Nous vous présentons trois startups phares :
* **Benin 3D Medical :** Qui fabrique des prothèses à bas coût adaptées à la morphologie des patients grâce à la modélisation 3D.
* **EcoPlastic :** Une initiative menée par des étudiantes pour transformer les sachets plastiques usagés en pavés routiers durables.
* **AgriDrone :** Des drones de surveillance thermique pour optimiser l'arrosage et détecter les parasites dans les grands champs de riz.

Regardez l'intégralité du reportage en vidéo pour découvrir les visages de cette jeunesse pionnière.`,
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000",
        category: "Éducation",
        author: "Alerte Vidéo",
        status: "published",
        mediaType: "video",
        mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Demo video
        views: 3100,
        createdAt: new Date(Date.now() - 3600000 * 72).toISOString(), // 3 days ago
        publishedAt: new Date(Date.now() - 3600000 * 72).toISOString()
      },
      {
        id: "art_5",
        title: "L'agriculture biologique : Une opportunité en or pour la jeunesse agricole béninoise",
        slug: "agriculture-biologique-opportunite-or-jeunesse-agricole",
        excerpt: "Face à la demande mondiale croissante, les cultures bio représentent une niche très lucrative pour nos coopératives rurales.",
        content: `Cultiver sans produits chimiques de synthèse n’est plus seulement une pratique de subsistance ancestrale, c’est aujourd’hui un segment économique hautement rentable. Au Bénin, plusieurs réseaux de jeunes agriculteurs se lancent avec succès dans l'ananas pain de sucre bio, la noix de cajou certifiée et le maraîchage écologique.

### Une valeur ajoutée incontestable
Les produits certifiés biologiques se vendent en moyenne 30% à 50% plus cher sur les marchés urbains et à l'exportation vers l'Europe et les États-Unis.

"Au début, c’était difficile d'abandonner les pesticides chimiques car cela demande plus de main d'œuvre pour le désherbage. Mais aujourd’hui, notre marge bénéficiaire a doublé et nos terres restent fertiles," témoigne Christian, maraîcher installé à Allada.`,
        image: "https://images.unsplash.com/photo-1593113598332-cd59c5ad3f90?q=80&w=1000",
        category: "Agriculture",
        author: "Jean Dossou",
        status: "published",
        mediaType: "article",
        views: 940,
        createdAt: new Date(Date.now() - 3600000 * 96).toISOString(), // 4 days ago
        publishedAt: new Date(Date.now() - 3600000 * 96).toISOString()
      }
    ];
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(seedArticles, null, 2), "utf8");
  }

  // Pre-seed Opportunities
  if (!fs.existsSync(OPPORTUNITIES_FILE)) {
    const seedOpportunities = [
      {
        id: "opp_1",
        title: "Recrutement de 25 Conseillers Clientèle Bilingues",
        description: `MTN Bénin procède actuellement au recrutement de vingt-cinq (25) conseillers clientèle pour renforcer ses centres de service client de Cotonou.

### Missions principales :
* Accueillir, conseiller et assister les abonnés au quotidien.
* Traiter les réclamations et proposer des offres adaptées.
* Assurer la fidélisation des clients en offrant un service de haute qualité.

### Profil recherché :
* Être titulaire d'un diplôme équivalent à Bac+2 ou Bac+3 en Communication, Marketing, ou Gestion de la relation client.
* Maîtriser parfaitement le Français (parlé et écrit). La maîtrise d'une langue locale (Fon, Yoruba ou Mina) et de l'Anglais de base est un atout majeur.
* Excellente aisance relationnelle et capacité d'écoute active.

### Avantages :
* Contrat de travail attractif avec assurance maladie complète.
* Cadre de travail moderne et stimulant avec perspectives d'évolution interne.`,
        category: "Recrutements",
        deadline: "2026-08-31",
        country: "Bénin",
        image: "https://images.unsplash.com/photo-1521791136368-1a46827d0adb?q=80&w=1000",
        studyLevel: "Bac+2/3",
        company: "MTN Bénin",
        savedBy: [],
        views: 1450,
        createdAt: new Date().toISOString()
      },
      {
        id: "opp_2",
        title: "Bourses d'excellence de la Fondation Alerte pour Master et Doctorat",
        description: `La Fondation Alerte Bénin, en partenariat avec des universités européennes, lance son programme annuel de bourses d'études d'excellence pour l'année académique 2026/2027.

Ces bourses s'adressent aux étudiants béninois brillants désireux de poursuivre leurs études de Master ou de Doctorat dans des domaines d'avenir.

### Domaines d'études prioritaires :
* Intelligence Artificielle et Technologies Emergentes
* Agroécologie et Transition Alimentaire
* Énergies Renouvelables et Génie Climatique
* Santé Publique et Épidémiologie

### Prise en charge :
La bourse est complète et comprend :
* Les frais de scolarité universitaires pour toute la durée du cursus.
* Une allocation mensuelle de subsistance de 950 € (environ 620 000 FCFA).
* Le billet d'avion aller-retour.
* Une couverture d'assurance médicale internationale.

### Conditions de candidature :
* Être de nationalité béninoise et âgé de moins de 28 ans au 31 décembre 2026.
* Être titulaire d'une Licence ou d'un Master avec mention Très Bien ou Bien.`,
        category: "Bourses",
        deadline: "2026-09-15",
        country: "International",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000",
        studyLevel: "Licence / Master",
        company: "Fondation Alerte Bénin",
        savedBy: [],
        views: 2980,
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: "opp_3",
        title: "Appel à projets : Concours Sèmè Startups - Édition Verte",
        description: `Vous êtes une startup béninoise et vous développez des solutions technologiques ou artisanales pour préserver l'environnement ? Postulez à l'édition verte du Concours Sèmè Startups.

Ce programme vise à accélérer l'émergence des jeunes entreprises béninoises de l'économie circulaire.

### Dotations de l'appel :
* **1er Prix :** Financement non remboursable de 10 000 000 FCFA + 1 an d'incubation gratuite à Sèmè City.
* **2ème Prix :** Financement de 5 000 000 FCFA + 6 mois d'incubation.
* **3ème Prix :** Financement de 3 000 000 FCFA + coaching personnalisé.

### Thématiques éligibles :
* Gestion et valorisation des déchets organiques ou plastiques.
* Agriculture urbaine durable et hors-sol.
* Systèmes d'irrigation solaires et économes en eau.
* Applications mobiles de sensibilisation écologique ou de logistique verte.`,
        category: "Appels à projets",
        deadline: "2026-07-31",
        country: "Bénin",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000",
        studyLevel: "Tous niveaux",
        company: "Sèmè City Hub",
        savedBy: [],
        views: 820,
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
      },
      {
        id: "opp_4",
        title: "Stage Professionnel : Développeur d'Applications React Native",
        description: `Une agence de développement informatique basée à Cotonou recherche un(e) stagiaire passionné(e) pour participer au développement et à l'optimisation d'applications mobiles hybrides.

Ce stage de pré-embauche d'une durée de six (6) mois offre une opportunité unique d'intégrer une équipe de professionnels expérimentés.

### Responsabilités :
* Participer à l'intégration des maquettes Figma sous React Native.
* Connecter les composants de l'interface aux API REST existantes.
* Effectuer les phases de test sur iOS et Android et corriger les bugs signalés.

### Profil requis :
* Avoir une première expérience ou des projets personnels réalisés en JavaScript/TypeScript et React.
* Connaître les bases de Git et de l'intégration continue.
* Esprit d'équipe, curiosité technique et forte envie d'apprendre.

### Conditions du stage :
* Indemnité de stage mensuelle de 75 000 FCFA.
* Prise en charge de la connexion internet et possibilité de télétravail hybride.`,
        category: "Stages",
        deadline: "2026-08-15",
        country: "Bénin",
        image: "https://images.unsplash.com/photo-1581291518655-9523c932dedf?q=80&w=1000",
        studyLevel: "Bac+3 minimum",
        company: "DigiTech Benin",
        savedBy: [],
        views: 610,
        createdAt: new Date(Date.now() - 3600000 * 72).toISOString()
      },
      {
        id: "opp_5",
        title: "Concours National d'Entrée au Lycée Militaire de Jeunes Filles de Natitingou",
        description: `Le Ministère de la Défense Nationale du Bénin informe le public de l'ouverture des registres d'inscription pour le concours d'entrée au Lycée Militaire de Jeunes Filles (Général Mathieu Kérékou) de Natitingou pour l'année scolaire 2026/2027.

Ce concours d'excellence vise à recruter les élèves féminines les plus prometteuses du territoire national pour intégrer un cursus d'études rigoureux alliant formation académique d'élite et éducation civique et physique.

### Conditions de participation :
* Être de nationalité béninoise.
* Être née entre le 1er janvier 2014 et le 31 décembre 2015.
* Avoir obtenu le Certificat d'Études Primaires (CEP) de la session de juin 2026 avec une moyenne supérieure ou égale à 14/20.
* Être indemne de toute affection médicale incompatible avec la discipline militaire.

### Dossier de candidature :
1. Une demande manuscrite signée des parents ou tuteurs légaux.
2. Une copie légalisée de l'acte de naissance de la candidate.
3. Un certificat médical d'aptitude physique délivré par un médecin militaire ou un centre de santé agréé.
4. Une attestation de réussite au CEP (session 2026).`,
        category: "Concours",
        deadline: "2026-07-20",
        country: "Bénin",
        image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=1000",
        studyLevel: "Niveau Primaire (CEP)",
        company: "Ministère de la Défense du Bénin",
        savedBy: [],
        views: 2110,
        createdAt: new Date(Date.now() - 3600000 * 96).toISOString()
      }
    ];
    fs.writeFileSync(OPPORTUNITIES_FILE, JSON.stringify(seedOpportunities, null, 2), "utf8");
  }

  // Pre-seed Empty Databases for Contacts, Newsletters, Comments if not existing
  if (!fs.existsSync(CONTACTS_FILE)) {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify([], null, 2), "utf8");
  }
  if (!fs.existsSync(NEWSLETTER_FILE)) {
    fs.writeFileSync(NEWSLETTER_FILE, JSON.stringify([], null, 2), "utf8");
  }
    if (!fs.existsSync(COMMENTS_FILE)) {
      const seedComments = [
        {
          id: "com_1",
          articleId: "art_1",
          userId: "usr_test",
          userFullName: "Codjo Gbènamè",
          userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=citoyen",
          comment: "C'est une excellente nouvelle pour nos parents agriculteurs ! Nous espérons que l'accompagnement technique va continuer dans l'Alibori.",
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
        }
      ];
      fs.writeFileSync(COMMENTS_FILE, JSON.stringify(seedComments, null, 2), "utf8");
    }
  } catch (err) {
    console.warn("Silent ignore: Local filesystem is read-only (expected in serverless environments):", err);
  }
}

ensureDataStore();

// Helper to read and write database files safely
function readDB(filePath: string): any[] {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
}

function writeDB(filePath: string, data: any[]): boolean {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    return false;
  }
}

// Sluggify helper
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9 -]/g, '')     // Remove non-alphanumeric chars
    .replace(/\s+/g, '-')            // Replace spaces with hyphens
    .replace(/-+/g, '-');            // Remove duplicate hyphens
}

// ----------------------------------------
// SUPABASE CLIENT & DB ADAPTERS
// ----------------------------------------

const SUPABASE_URL = process.env.SUPABASE_URL || "https://xfbgqhgtdmpqqnwnpogx.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmYmdxaGd0ZG1wcXFud25wb2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNTA5ODcsImV4cCI6MjA5NzgyNjk4N30.7nb842UN9VzQH-BqalsEYkIO-qS2ZOUAQ2JEmaElcls";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

// Use the Service Role Key in the backend to bypass Row-Level Security (RLS) safely.
// This allows enabling strict RLS policies on all database tables to protect direct client connections.
let supabase: any = null;
try {
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  } else {
    console.warn("Supabase credentials missing or invalid.");
  }
} catch (e) {
  console.error("Failed to initialize Supabase client:", e);
}

// ----------------------------------------
// SUPABASE KEEP-ALIVE / PING ROUTINE
// ----------------------------------------

async function pingSupabase(): Promise<{ success: boolean; message: string; timestamp: string }> {
  const timestamp = new Date().toISOString();
  if (!supabase) {
    return { success: false, message: "Supabase client uninitialized", timestamp };
  }
  try {
    const { data, error } = await supabase.from("users").select("id").limit(1);
    if (error) {
      console.error("[KeepAlive] Supabase ping failed:", error.message);
      return { success: false, message: error.message, timestamp };
    }
    console.log("[KeepAlive] Supabase ping successful at", timestamp);
    return { success: true, message: "Supabase project active", timestamp };
  } catch (err: any) {
    console.error("[KeepAlive] Supabase ping exception:", err?.message || err);
    return { success: false, message: err?.message || String(err), timestamp };
  }
}

// Background ping every 6 hours if the node server stays alive
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    pingSupabase().catch(() => {});
  }, 6 * 60 * 60 * 1000); // 6 hours
}

// Public API endpoint for Cron-Job.org, UptimeRobot, or Vercel Cron
app.get("/api/ping-supabase", async (req, res) => {
  const result = await pingSupabase();
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

app.get("/api/health", async (req, res) => {
  const result = await pingSupabase();
  res.json({
    status: "ok",
    supabase: result,
    environment: process.env.NODE_ENV || "development"
  });
});

function formatError(e: any): string {
  if (!e) return "Unknown error";
  if (typeof e === "object") {
    try {
      return JSON.stringify(e, Object.getOwnPropertyNames(e));
    } catch {
      return String(e);
    }
  }
  return String(e);
}

// Users DB Wrapper
async function dbGetUsers(): Promise<any[]> {
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return (data || []).map((u: any) => ({
      id: u.id,
      email: u.email,
      password: u.password,
      fullname: u.fullname,
      role: u.role,
      avatar: u.avatar,
      createdAt: u.created_at
    }));
  } catch (e) {
    console.warn("Supabase getUsers failed, falling back to local file:", formatError(e));
    return readDB(USERS_FILE);
  }
}

async function dbSaveUser(user: any): Promise<void> {
  const users = readDB(USERS_FILE);
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx === -1) users.push(user);
  else users[idx] = user;
  writeDB(USERS_FILE, users);

  try {
    const { error } = await supabase.from("users").upsert({
      id: user.id,
      email: user.email,
      password: user.password,
      fullname: user.fullname,
      role: user.role,
      avatar: user.avatar,
      created_at: user.createdAt
    });
    if (error) throw error;
  } catch (e) {
    console.error("Supabase saveUser failed:", formatError(e));
  }
}

// Articles DB Wrapper
async function dbGetArticles(): Promise<any[]> {
  try {
    const { data, error } = await supabase.from("articles").select("*");
    if (error) throw error;
    return (data || []).map((art: any) => ({
      id: art.id,
      title: art.title,
      slug: art.slug,
      excerpt: art.excerpt,
      content: art.content,
      image: art.image,
      category: art.category,
      author: art.author,
      status: art.status,
      mediaType: art.media_type || "article",
      mediaUrl: art.media_url,
      views: art.views || 0,
      createdAt: art.created_at,
      publishedAt: art.published_at
    }));
  } catch (e) {
    console.warn("Supabase getArticles failed, falling back to local file:", formatError(e));
    return readDB(ARTICLES_FILE);
  }
}

async function dbSaveArticle(art: any): Promise<void> {
  const articles = readDB(ARTICLES_FILE);
  const idx = articles.findIndex((a) => a.id === art.id);
  if (idx === -1) articles.push(art);
  else articles[idx] = art;
  writeDB(ARTICLES_FILE, articles);

  try {
    const { error } = await supabase.from("articles").upsert({
      id: art.id,
      title: art.title,
      slug: art.slug,
      excerpt: art.excerpt,
      content: art.content,
      image: art.image,
      category: art.category,
      author: art.author,
      status: art.status,
      media_type: art.mediaType,
      media_url: art.mediaUrl,
      views: art.views,
      created_at: art.createdAt,
      published_at: art.publishedAt
    });
    if (error) throw error;
  } catch (e) {
    console.error("Supabase saveArticle failed:", formatError(e));
  }
}

async function dbDeleteArticle(id: string): Promise<void> {
  const articles = readDB(ARTICLES_FILE);
  const filtered = articles.filter((a) => a.id !== id);
  writeDB(ARTICLES_FILE, filtered);

  try {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) throw error;
  } catch (e) {
    console.error("Supabase deleteArticle failed:", formatError(e));
  }
}

// Opportunities DB Wrapper
async function dbGetOpportunities(): Promise<any[]> {
  try {
    const { data, error } = await supabase.from("opportunities").select("*");
    if (error) throw error;
    return (data || []).map((opp: any) => ({
      id: opp.id,
      title: opp.title,
      description: opp.description,
      category: opp.category,
      deadline: opp.deadline,
      country: opp.country,
      image: opp.image,
      studyLevel: opp.study_level,
      company: opp.company,
      savedBy: opp.saved_by || [],
      views: opp.views || 0,
      createdAt: opp.created_at
    }));
  } catch (e) {
    console.warn("Supabase getOpportunities failed, falling back to local file:", formatError(e));
    return readDB(OPPORTUNITIES_FILE);
  }
}

async function dbSaveOpportunity(opp: any): Promise<void> {
  const opportunities = readDB(OPPORTUNITIES_FILE);
  const idx = opportunities.findIndex((o) => o.id === opp.id);
  if (idx === -1) opportunities.push(opp);
  else opportunities[idx] = opp;
  writeDB(OPPORTUNITIES_FILE, opportunities);

  try {
    const { error } = await supabase.from("opportunities").upsert({
      id: opp.id,
      title: opp.title,
      description: opp.description,
      category: opp.category,
      deadline: opp.deadline,
      country: opp.country,
      image: opp.image,
      study_level: opp.studyLevel,
      company: opp.company,
      saved_by: opp.savedBy || [],
      views: opp.views,
      created_at: opp.createdAt
    });
    if (error) throw error;
  } catch (e) {
    console.error("Supabase saveOpportunity failed:", formatError(e));
  }
}

async function dbDeleteOpportunity(id: string): Promise<void> {
  const opportunities = readDB(OPPORTUNITIES_FILE);
  const filtered = opportunities.filter((o) => o.id !== id);
  writeDB(OPPORTUNITIES_FILE, filtered);

  try {
    const { error } = await supabase.from("opportunities").delete().eq("id", id);
    if (error) throw error;
  } catch (e) {
    console.error("Supabase deleteOpportunity failed:", formatError(e));
  }
}

async function getUserSavedOpportunities(userId: string): Promise<string[]> {
  const opportunities = await dbGetOpportunities();
  return opportunities
    .filter((o) => o.savedBy && o.savedBy.includes(userId))
    .map((o) => o.id);
}

// Comments DB Wrapper
async function dbGetComments(): Promise<any[]> {
  try {
    const { data, error } = await supabase.from("comments").select("*");
    if (error) throw error;
    return (data || []).map((c: any) => ({
      id: c.id,
      articleId: c.article_id,
      userId: c.user_id,
      userFullName: c.user_full_name,
      userAvatar: c.user_avatar,
      comment: c.comment,
      createdAt: c.created_at
    }));
  } catch (e) {
    console.warn("Supabase getComments failed, falling back to local file:", formatError(e));
    return readDB(COMMENTS_FILE);
  }
}

async function dbSaveComment(comment: any): Promise<void> {
  const comments = readDB(COMMENTS_FILE);
  comments.push(comment);
  writeDB(COMMENTS_FILE, comments);

  try {
    const { error } = await supabase.from("comments").upsert({
      id: comment.id,
      article_id: comment.articleId,
      user_id: comment.userId,
      user_full_name: comment.userFullName,
      user_avatar: comment.userAvatar,
      comment: comment.comment,
      created_at: comment.createdAt
    });
    if (error) throw error;
  } catch (e) {
    console.error("Supabase saveComment failed:", formatError(e));
  }
}

// Contacts DB Wrapper
async function dbGetContacts(): Promise<any[]> {
  try {
    const { data, error } = await supabase.from("contacts").select("*");
    if (error) throw error;
    return (data || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      subject: c.subject,
      message: c.message,
      createdAt: c.created_at
    }));
  } catch (e) {
    console.warn("Supabase getContacts failed, falling back to local file:", formatError(e));
    return readDB(CONTACTS_FILE);
  }
}

async function dbSaveContact(cnt: any): Promise<void> {
  const contacts = readDB(CONTACTS_FILE);
  contacts.push(cnt);
  writeDB(CONTACTS_FILE, contacts);

  try {
    const { error } = await supabase.from("contacts").upsert({
      id: cnt.id,
      name: cnt.name,
      email: cnt.email,
      phone: cnt.phone,
      subject: cnt.subject,
      message: cnt.message,
      created_at: cnt.createdAt
    });
    if (error) throw error;
  } catch (e) {
    console.error("Supabase saveContact failed:", formatError(e));
  }
}

// Newsletter DB Wrapper
async function dbGetSubscribers(): Promise<any[]> {
  try {
    const { data, error } = await supabase.from("newsletter_subscribers").select("*");
    if (error) throw error;
    return (data || []).map((s: any) => ({
      id: s.id,
      email: s.email,
      createdAt: s.created_at
    }));
  } catch (e) {
    console.warn("Supabase getSubscribers failed, falling back to local file:", formatError(e));
    return readDB(NEWSLETTER_FILE);
  }
}

async function dbSaveSubscriber(sub: any): Promise<void> {
  const subscribers = readDB(NEWSLETTER_FILE);
  subscribers.push(sub);
  writeDB(NEWSLETTER_FILE, subscribers);

  try {
    const { error } = await supabase.from("newsletter_subscribers").upsert({
      id: sub.id,
      email: sub.email,
      created_at: sub.createdAt
    });
    if (error) throw error;
  } catch (e) {
    console.error("Supabase saveSubscriber failed:", formatError(e));
  }
}

// ----------------------------------------

// ----------------------------------------
// API ENDPOINTS
// ----------------------------------------

// Auth API
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis." });
  }

  const users = await dbGetUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Identifiants incorrects." });
  }

  // Exclude password in response
  const { password: _, ...userWithoutPassword } = user;
  const savedOpportunities = await getUserSavedOpportunities(user.id);
  res.json({ token: `session_token_${user.id}`, user: { ...userWithoutPassword, savedOpportunities } });
});

app.post("/api/auth/signup", async (req, res) => {
  const { email, password, fullname } = req.body;
  if (!email || !password || !fullname) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  const users = await dbGetUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "Cette adresse email est déjà enregistrée." });
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    email: email.toLowerCase(),
    password,
    fullname,
    role: "user", // Default is user, admin is pre-seeded
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullname)}`,
    createdAt: new Date().toISOString()
  };

  await dbSaveUser(newUser);

  const { password: _, ...userWithoutPassword } = newUser;
  res.json({ token: `session_token_${newUser.id}`, user: { ...userWithoutPassword, savedOpportunities: [] } });
});

app.get("/api/auth/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer session_token_")) {
    return res.status(401).json({ error: "Non connecté." });
  }

  const userId = authHeader.replace("Bearer session_token_", "");
  const users = await dbGetUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(401).json({ error: "Utilisateur introuvable." });
  }

  const { password: _, ...userWithoutPassword } = user;
  const savedOpportunities = await getUserSavedOpportunities(userId);
  res.json({ ...userWithoutPassword, savedOpportunities });
});

// Update Profile
app.put("/api/auth/profile", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer session_token_")) {
    return res.status(401).json({ error: "Non connecté." });
  }

  const userId = authHeader.replace("Bearer session_token_", "");
  const { fullname, avatar } = req.body;

  const users = await dbGetUsers();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: "Utilisateur introuvable." });
  }

  if (fullname) users[userIndex].fullname = fullname;
  if (avatar) users[userIndex].avatar = avatar;

  await dbSaveUser(users[userIndex]);

  const { password: _, ...userWithoutPassword } = users[userIndex];
  const savedOpportunities = await getUserSavedOpportunities(userId);
  res.json({ ...userWithoutPassword, savedOpportunities });
});

// Articles API
app.get("/api/articles", async (req, res) => {
  const { search, category, status, mediaType } = req.query;
  let articles = await dbGetArticles();

  // Filter out drafts unless administrative request or specified
  if (status !== "all") {
    articles = articles.filter(art => art.status === "published");
  }

  if (category) {
    articles = articles.filter((art) => art.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (mediaType) {
    articles = articles.filter((art) => art.mediaType === (mediaType as string));
  }

  if (search) {
    const query = (search as string).toLowerCase();
    articles = articles.filter(
      (art) =>
        art.title.toLowerCase().includes(query) ||
        art.excerpt.toLowerCase().includes(query) ||
        art.content.toLowerCase().includes(query)
    );
  }

  // Sort by date descending
  articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(articles);
});

app.get("/api/articles/:slug", async (req, res) => {
  const { slug } = req.params;
  const articles = await dbGetArticles();
  const articleIndex = articles.findIndex((art) => art.slug === slug);

  if (articleIndex === -1) {
    return res.status(404).json({ error: "Article introuvable." });
  }

  // Increment views
  articles[articleIndex].views = (articles[articleIndex].views || 0) + 1;
  await dbSaveArticle(articles[articleIndex]);

  res.json(articles[articleIndex]);
});

// Article Create (Admin)
app.post("/api/articles", async (req, res) => {
  const { title, excerpt, content, image, category, mediaType, mediaUrl, status } = req.body;
  if (!title || !content || !category) {
    return res.status(400).json({ error: "Titre, contenu et catégorie obligatoires." });
  }

  const articles = await dbGetArticles();
  let slug = slugify(title);

  // Avoid duplicate slugs
  let count = 1;
  while (articles.some((art) => art.slug === slug)) {
    slug = `${slugify(title)}-${count}`;
    count++;
  }

  const newArticle = {
    id: `art_${Date.now()}`,
    title,
    slug,
    excerpt: excerpt || content.substring(0, 150) + "...",
    content,
    image: image || "https://images.unsplash.com/photo-1594901861115-b3a37d61b319?q=80&w=1000",
    category,
    author: "Administration",
    status: status || "published",
    mediaType: mediaType || "article",
    mediaUrl: mediaUrl || "",
    views: 0,
    createdAt: new Date().toISOString(),
    publishedAt: status === "published" ? new Date().toISOString() : undefined
  };

  await dbSaveArticle(newArticle);

  res.status(201).json(newArticle);
});

// Article Update (Admin)
app.put("/api/articles/:id", async (req, res) => {
  const { id } = req.params;
  const { title, excerpt, content, image, category, mediaType, mediaUrl, status } = req.body;

  const articles = await dbGetArticles();
  const index = articles.findIndex((art) => art.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Article introuvable." });
  }

  const current = articles[index];

  if (title && title !== current.title) {
    let slug = slugify(title);
    let count = 1;
    while (articles.some((art) => art.slug === slug && art.id !== id)) {
      slug = `${slugify(title)}-${count}`;
      count++;
    }
    current.slug = slug;
    current.title = title;
  }

  if (excerpt !== undefined) current.excerpt = excerpt;
  if (content !== undefined) current.content = content;
  if (image !== undefined) current.image = image;
  if (category !== undefined) current.category = category;
  if (mediaType !== undefined) current.mediaType = mediaType;
  if (mediaUrl !== undefined) current.mediaUrl = mediaUrl;
  
  if (status !== undefined && status !== current.status) {
    current.status = status;
    if (status === "published" && !current.publishedAt) {
      current.publishedAt = new Date().toISOString();
    }
  }

  await dbSaveArticle(current);

  res.json(current);
});

// Article Delete (Admin)
app.delete("/api/articles/:id", async (req, res) => {
  const { id } = req.params;
  const articles = await dbGetArticles();
  const index = articles.findIndex((art) => art.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Article introuvable." });
  }

  await dbDeleteArticle(id);
  res.json({ success: true, message: "Article supprimé." });
});

// Opportunities API
app.get("/api/opportunities", async (req, res) => {
  const { search, category, country, studyLevel } = req.query;
  let opportunities = await dbGetOpportunities();

  if (category) {
    opportunities = opportunities.filter((o) => o.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (country) {
    opportunities = opportunities.filter((o) => o.country.toLowerCase() === (country as string).toLowerCase());
  }

  if (studyLevel) {
    opportunities = opportunities.filter((o) => o.studyLevel.toLowerCase().includes((studyLevel as string).toLowerCase()));
  }

  if (search) {
    const query = (search as string).toLowerCase();
    opportunities = opportunities.filter(
      (o) =>
        o.title.toLowerCase().includes(query) ||
        o.description.toLowerCase().includes(query) ||
        (o.company && o.company.toLowerCase().includes(query))
    );
  }

  // Sort by created descending
  opportunities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(opportunities);
});

app.get("/api/opportunities/:id", async (req, res) => {
  const { id } = req.params;
  const opportunities = await dbGetOpportunities();
  const oppIndex = opportunities.findIndex((o) => o.id === id);

  if (oppIndex === -1) {
    return res.status(404).json({ error: "Opportunité introuvable." });
  }

  // Increment views
  opportunities[oppIndex].views = (opportunities[oppIndex].views || 0) + 1;
  await dbSaveOpportunity(opportunities[oppIndex]);

  res.json(opportunities[oppIndex]);
});

// Opportunities Create (Admin)
app.post("/api/opportunities", async (req, res) => {
  const { title, description, category, deadline, country, image, studyLevel, company } = req.body;
  if (!title || !description || !category || !deadline || !country) {
    return res.status(400).json({ error: "Champs obligatoires manquants." });
  }

  const newOpp = {
    id: `opp_${Date.now()}`,
    title,
    description,
    category,
    deadline,
    country,
    image: image || "https://images.unsplash.com/photo-1521791136368-1a46827d0adb?q=80&w=1000",
    studyLevel: studyLevel || "Tous niveaux",
    company: company || "Anonyme",
    savedBy: [],
    views: 0,
    createdAt: new Date().toISOString()
  };

  await dbSaveOpportunity(newOpp);

  res.status(201).json(newOpp);
});

// Opportunities Update (Admin)
app.put("/api/opportunities/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, category, deadline, country, image, studyLevel, company } = req.body;

  const opportunities = await dbGetOpportunities();
  const index = opportunities.findIndex((o) => o.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Opportunité introuvable." });
  }

  const current = opportunities[index];

  if (title !== undefined) current.title = title;
  if (description !== undefined) current.description = description;
  if (category !== undefined) current.category = category;
  if (deadline !== undefined) current.deadline = deadline;
  if (country !== undefined) current.country = country;
  if (image !== undefined) current.image = image;
  if (studyLevel !== undefined) current.studyLevel = studyLevel;
  if (company !== undefined) current.company = company;

  await dbSaveOpportunity(current);

  res.json(current);
});

// Opportunities Delete (Admin)
app.delete("/api/opportunities/:id", async (req, res) => {
  const { id } = req.params;
  const opportunities = await dbGetOpportunities();
  const index = opportunities.findIndex((o) => o.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Opportunité introuvable." });
  }

  await dbDeleteOpportunity(id);
  res.json({ success: true, message: "Opportunité supprimée." });
});

// Toggle Save Opportunity for User
app.post("/api/opportunities/:id/save", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer session_token_")) {
    return res.status(401).json({ error: "Non connecté." });
  }

  const userId = authHeader.replace("Bearer session_token_", "");
  const { id } = req.params;

  const opportunities = await dbGetOpportunities();
  const index = opportunities.findIndex((o) => o.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Opportunité introuvable." });
  }

  const savedBy = opportunities[index].savedBy || [];
  const savedIndex = savedBy.indexOf(userId);

  if (savedIndex === -1) {
    savedBy.push(userId); // Save
  } else {
    savedBy.splice(savedIndex, 1); // Unsave
  }

  opportunities[index].savedBy = savedBy;
  await dbSaveOpportunity(opportunities[index]);

  const savedOpportunities = await getUserSavedOpportunities(userId);
  res.json({ saved: savedIndex === -1, savedBy, savedOpportunities });
});

// Get Saved Opportunities for User
app.get("/api/opportunities/saved/user", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer session_token_")) {
    return res.status(401).json({ error: "Non connecté." });
  }

  const userId = authHeader.replace("Bearer session_token_", "");
  const opportunities = await dbGetOpportunities();
  const savedOpps = opportunities.filter((o) => o.savedBy && o.savedBy.includes(userId));

  res.json(savedOpps);
});

// Comments API
app.get("/api/articles/:id/comments", async (req, res) => {
  const { id } = req.params;
  const comments = await dbGetComments();
  const articleComments = comments.filter((c) => c.articleId === id);

  // Sort chronologically descending
  articleComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(articleComments);
});

app.post("/api/articles/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const authHeader = req.headers.authorization;

  if (!comment || comment.trim() === "") {
    return res.status(400).json({ error: "Le commentaire ne peut pas être vide." });
  }

  if (!authHeader || !authHeader.startsWith("Bearer session_token_")) {
    return res.status(401).json({ error: "Veuillez vous connecter pour laisser un commentaire." });
  }

  const userId = authHeader.replace("Bearer session_token_", "");
  const users = await dbGetUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(401).json({ error: "Utilisateur introuvable." });
  }

  const newComment = {
    id: `com_${Date.now()}`,
    articleId: id,
    userId: user.id,
    userFullName: user.fullname,
    userAvatar: user.avatar,
    comment,
    createdAt: new Date().toISOString()
  };

  await dbSaveComment(newComment);

  res.status(201).json(newComment);
});

// Contact Form Submission
app.post("/api/contacts", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Veuillez remplir tous les champs obligatoires (Nom, Email, Sujet, Message)." });
  }

  const newContact = {
    id: `cnt_${Date.now()}`,
    name,
    email,
    phone: phone || "",
    subject,
    message,
    createdAt: new Date().toISOString()
  };

  await dbSaveContact(newContact);

  res.status(201).json({ success: true, message: "Message envoyé avec succès." });
});

app.get("/api/contacts", async (req, res) => {
  const contacts = await dbGetContacts();
  contacts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(contacts);
});

// Newsletter Subscription
app.post("/api/newsletter/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Veuillez fournir une adresse email valide." });
  }

  const subscribers = await dbGetSubscribers();
  const exists = subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase());

  if (exists) {
    return res.status(200).json({ success: true, message: "Vous êtes déjà inscrit à notre newsletter." });
  }

  const newSub = {
    id: `sub_${Date.now()}`,
    email: email.toLowerCase(),
    createdAt: new Date().toISOString()
  };

  await dbSaveSubscriber(newSub);

  res.status(201).json({ success: true, message: "Inscription à la newsletter validée avec succès !" });
});

app.get("/api/newsletter/subscribers", async (req, res) => {
  const subscribers = await dbGetSubscribers();
  subscribers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(subscribers);
});

// Stats API (Admin Dashboard)
app.get("/api/admin/stats", async (req, res) => {
  const articles = await dbGetArticles();
  const opportunities = await dbGetOpportunities();
  const subscribers = await dbGetSubscribers();
  const contacts = await dbGetContacts();

  const totalViews = articles.reduce((acc, art) => acc + (art.views || 0), 0) +
                     opportunities.reduce((acc, opp) => acc + (opp.views || 0), 0);

  // Popular articles
  const articlesByViews = [...articles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
    .map(art => ({ title: art.title, views: art.views || 0, slug: art.slug }));

  // Category distributions
  const categories: { [key: string]: number } = {};
  articles.forEach(art => {
    categories[art.category] = (categories[art.category] || 0) + 1;
  });
  opportunities.forEach(opp => {
    categories[opp.category] = (categories[opp.category] || 0) + 1;
  });

  const categoryDistribution = Object.keys(categories).map(cat => ({
    name: cat,
    value: categories[cat]
  }));

  res.json({
    articleCount: articles.length,
    opportunityCount: opportunities.length,
    newsletterCount: subscribers.length,
    contactCount: contacts.length,
    totalViews,
    articlesByViews,
    categoryDistribution
  });
});

// ----------------------------------------
// VITE OR STATIC FILES MIDDLEWARE
// ----------------------------------------

async function bootstrap() {
  // On Vercel, static files are served by Vercel directly, and api requests are routed to this serverless function.
  // We do not need Vite development server or Express static file serving on Vercel.
  if (!process.env.VERCEL) {
    if (process.env.NODE_ENV !== "production") {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on http://0.0.0.0:${PORT}`);
    });
  }
}

bootstrap().catch((err) => {
  console.error("Erreur de démarrage du serveur :", err);
});

export default app;
