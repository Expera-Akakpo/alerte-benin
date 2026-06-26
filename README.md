# Alerte Bénin — L'information utile, les opportunités réelles

Alerte Bénin est une plateforme web moderne et performante centralisant l'actualité journalistique de qualité et les opportunités professionnelles ou académiques réelles au Bénin.

## 🌟 Fonctionnalités

### Espace Public
- **Fils d'Actualités** : Des articles et reportages structurés classés par catégories (Économie, Éducation, Technologie, etc.).
- **Tableau des Opportunités** : Offres d'emploi, bourses d'études, stages et concours vérifiés.
- **Interactions Sociales** : Possibilité de laisser des commentaires sur les articles.
- **Newsletter & Contact** : Formulaires d'abonnement à l'infolettre et de contact direct avec l'équipe de rédaction.

### Espace Administration
- **Tableau de Bord Analytique** : Statistiques en temps réel sur les vues d'articles, la répartition des catégories et le nombre de abonnés.
- **Gestion des Contenus** : Création, modification (brouillons/publiés) et suppression simplifiées d'articles et d'opportunités.
- **Gestion des Données** : Lecture et tri des messages de contact et de la liste des abonnés de la newsletter.

---

## 🔒 Base de Données & Sécurité (Supabase RLS)

L'application utilise **Supabase** (PostgreSQL) comme moteur de persistance de données.

### Configuration RLS (Row-Level Security)
Pour garantir l'intégrité et la sécurité absolue des données, **toutes les tables de la base de données ont la sécurité de niveau ligne (RLS) activée**.

- **Accès Client Public** : Les utilisateurs de l'application frontale accèdent en lecture seule aux articles publiés et aux opportunités. Ils peuvent insérer des commentaires ou des soumissions de contact de manière sécurisée grâce aux règles SQL définies dans `supabase_sql.sql`.
- **Accès Backend Sécurisé** : Le serveur d'API backend (Express) utilise la clé `SUPABASE_SERVICE_ROLE_KEY` pour interagir avec Supabase. Cette clé d'administration permet de contourner les politiques RLS de manière parfaitement sécurisée côté serveur pour exécuter les opérations d'administration (CRUD complet de l'espace admin) sans jamais exposer de privilèges élevés aux clients frontaux.

Le fichier d'initialisation SQL complet avec l'ensemble des structures de tables et des politiques de sécurité est disponible sous `./supabase_sql.sql`.

---

## 🛠️ Stack Technique

- **Frontend** : React 19, Vite, Tailwind CSS v4, Motion (animations), Lucide React (icônes).
- **Backend** : Express (TypeScript via `tsx` en développement), `esbuild` (pour l'assemblage de production).
- **Base de Données** : Supabase (Client JS).

---

## 🚀 Installation et Démarrage

### 1. Variables d'Environnement
Créez un fichier `.env` à la racine du projet en vous inspirant de `.env.example` :

```env
# URL de l'application
APP_URL="http://localhost:3000"

# Configuration Supabase
SUPABASE_URL="https://votre-projet.supabase.co"
SUPABASE_ANON_KEY="votre_cle_publique_anonyme"
SUPABASE_SERVICE_ROLE_KEY="votre_cle_de_service_role" # Crucial pour contourner le RLS en toute sécurité côté serveur
```

### 2. Démarrage en Mode Développement
Installez les dépendances et lancez le serveur de développement :

```bash
npm install
npm run dev
```
Le serveur démarrera sur le port **3000** (`http://localhost:3000`).

### 3. Compilation pour la Production
Pour compiler l'application de bout en bout (génération des fichiers statiques et bundle CJS du serveur backend) :

```bash
npm run build
```

### 4. Démarrage en Production
Une fois la compilation réussie, lancez l'application compilée :

```bash
npm run start
```
