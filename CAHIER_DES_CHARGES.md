# Cahier des Charges — Application de Gestion de Stock

**Version :** 1.0  
**Date :** 07 juin 2026  
**Projet :** Gestion de Stock  
**Statut :** En développement  

---

## Table des matières

1. [Présentation du projet et objectifs](#1-présentation-du-projet-et-objectifs)
2. [Public cible et rôles utilisateurs](#2-public-cible-et-rôles-utilisateurs)
3. [Exigences fonctionnelles](#3-exigences-fonctionnelles)
4. [Exigences non fonctionnelles](#4-exigences-non-fonctionnelles)
5. [Architecture technique](#5-architecture-technique)
6. [Base de données et modèles de données](#6-base-de-données-et-modèles-de-données)

---

## 1. Présentation du projet et objectifs

### 1.1 Contexte

L'application **Gestion de Stock** est une solution web de gestion d'inventaire destinée aux entreprises souhaitant centraliser et automatiser le suivi de leurs stocks de produits. Elle remplace les processus manuels (feuilles de calcul, registres papier) par une interface numérique unifiée, accessible depuis n'importe quel navigateur.

### 1.2 Objectifs généraux

- Offrir une vue en temps réel de l'état du stock (quantités, valeur totale, alertes de rupture).
- Tracer l'intégralité des mouvements de stock (entrées et sorties) avec horodatage et identification de l'opérateur.
- Permettre la gestion complète du catalogue produits (création, modification, suppression).
- Générer des documents et rapports exportables (CSV, PDF).
- Centraliser la gestion documentaire liée à l'activité logistique.

### 1.3 Périmètre fonctionnel

| Domaine | Inclus | Hors périmètre (v1) |
|---|---|---|
| Gestion produits | Oui | Gestion multi-entrepôt |
| Mouvements de stock | Oui | Gestion des commandes fournisseurs |
| Tableau de bord analytique | Oui | Prévisions et réapprovisionnement automatique |
| Export / Import CSV | Oui | Connecteurs ERP tiers |
| Rapports PDF | Oui | Facturation client |
| Gestion documentaire | Oui | Signature électronique |
| Authentification | Oui | SSO / OAuth2 |
| Contrôle d'accès par rôle | Partiellement | Granularité fine par ressource |

---

## 2. Public cible et rôles utilisateurs

### 2.1 Public cible

L'application s'adresse aux PME et aux équipes logistiques ayant besoin d'une solution légère, déployable rapidement, sans infrastructure lourde. Elle convient particulièrement aux secteurs du commerce, de la distribution et de la production artisanale.

### 2.2 Rôles et permissions

Le système distingue trois niveaux d'accès définis à la création du compte utilisateur.

| Rôle | Libellé | Description |
|---|---|---|
| `admin` | Administrateur | Accès complet à toutes les fonctionnalités, y compris la gestion des utilisateurs et la configuration du système. |
| `manager` | Responsable de stock | Peut créer, modifier et supprimer des produits et enregistrer des mouvements. Accès aux rapports. |
| `employee` | Employé | Peut consulter le stock, enregistrer des mouvements et télécharger des documents. Ne peut pas supprimer de produits. |

> **Note :** La différenciation des droits par rôle est implémentée côté base de données. Le renforcement côté interface et API constitue un objectif de la prochaine itération.

### 2.3 Parcours utilisateur type

```
[Employé]   → Connexion → Tableau de bord → Enregistrement d'un mouvement
[Manager]   → Connexion → Produits → Ajout / modification → Export CSV
[Admin]     → Connexion → Rapports → Génération PDF → Gestion documentaire
```

---

## 3. Exigences fonctionnelles

### 3.1 Module Authentification

| Réf. | Fonctionnalité | Description |
|---|---|---|
| AUTH-01 | Connexion par email/mot de passe | Formulaire de login sécurisé avec gestion des erreurs d'identifiants |
| AUTH-02 | Session persistante | Le jeton d'authentification est conservé en `localStorage` pour maintenir la session entre les rechargements |
| AUTH-03 | Déconnexion sécurisée | Révocation du jeton côté serveur et nettoyage du stockage local |
| AUTH-04 | Protection des routes | Toutes les pages (sauf `/login`) nécessitent une authentification valide |
| AUTH-05 | Expiration de session | Redirection automatique vers `/login` en cas de réponse HTTP 401 |

### 3.2 Module Tableau de bord

| Réf. | Fonctionnalité | Description |
|---|---|---|
| DASH-01 | Indicateurs clés (KPIs) | Affichage du nombre total de produits, de la valeur totale du stock (en MAD) et du nombre de produits en stock faible |
| DASH-02 | Graphique d'activité | Graphique en barres des entrées et sorties de stock sur les derniers jours (via Recharts) |
| DASH-03 | Alertes de stock faible | Liste des produits dont la quantité est inférieure à 10 unités, avec mise en évidence visuelle |
| DASH-04 | Accès rapide aux rapports | Bouton de téléchargement du rapport PDF de stock directement depuis le tableau de bord |

### 3.3 Module Produits

| Réf. | Fonctionnalité | Description |
|---|---|---|
| PROD-01 | Liste des produits | Tableau paginé avec nom, SKU, quantité, statut de stock et prix unitaire |
| PROD-02 | Création de produit | Formulaire avec les champs : nom, SKU (unique), description, quantité initiale, prix unitaire |
| PROD-03 | Modification de produit | Édition en ligne de tous les champs du produit |
| PROD-04 | Suppression de produit | Suppression avec dialogue de confirmation, cascade sur les mouvements associés |
| PROD-05 | Statut de stock | Badge visuel : "Rupture" (0), "Faible" (< 10), "En stock" (≥ 10) |
| PROD-06 | Mouvement rapide | Boutons Entrée / Sortie sur chaque ligne produit pour enregistrer un mouvement directement |
| PROD-07 | Export CSV | Téléchargement de l'ensemble du catalogue en fichier CSV |
| PROD-08 | Import CSV | Chargement en masse de produits via un fichier CSV structuré |

### 3.4 Module Mouvements de stock

| Réf. | Fonctionnalité | Description |
|---|---|---|
| MOV-01 | Historique des mouvements | Tableau chronologique de tous les mouvements : date, produit, type, quantité, opérateur, notes |
| MOV-02 | Enregistrement d'un mouvement | Création d'une entrée ou d'une sortie de stock avec mise à jour atomique de la quantité produit |
| MOV-03 | Traçabilité opérateur | Chaque mouvement est associé à l'utilisateur authentifié qui l'a enregistré |
| MOV-04 | Affichage différencié | Les entrées sont affichées en vert (+), les sorties en orange (−) pour une lecture rapide |

### 3.5 Module Documents

| Réf. | Fonctionnalité | Description |
|---|---|---|
| DOC-01 | Upload de document PDF | Téléversement d'un fichier PDF (max 10 Mo) avec attribution d'un nom |
| DOC-02 | Liste des documents | Tableau des documents avec nom, uploader et date de dépôt |
| DOC-03 | Téléchargement | Téléchargement d'un document stocké depuis le serveur |
| DOC-04 | Suppression | Suppression du document et du fichier physique associé |
| DOC-05 | Validation côté client | Vérification du format (PDF uniquement) et de la taille avant l'envoi |

### 3.6 Module Rapports

| Réf. | Fonctionnalité | Description |
|---|---|---|
| RPT-01 | Rapport de stock PDF | Génération d'un rapport PDF complet de l'état du stock, horodaté, via DomPDF |
| RPT-02 | Nom de fichier dynamique | Le fichier généré est nommé `stock_report_[timestamp].pdf` |

---

## 4. Exigences non fonctionnelles

### 4.1 Performance

| Critère | Objectif |
|---|---|
| Temps de réponse API | < 500 ms pour les requêtes standards (lecture de listes) |
| Temps de génération PDF | < 3 secondes pour un rapport de stock standard |
| Chargement initial de l'application | < 2 secondes sur une connexion standard (grâce au build Vite optimisé) |
| Atomicité des mises à jour | Les mouvements de stock et la mise à jour de la quantité produit sont encapsulés dans une transaction base de données |

### 4.2 Sécurité

| Critère | Mesure implémentée |
|---|---|
| Authentification | Tokens Bearer via Laravel Sanctum |
| Protection des routes API | Middleware `auth:sanctum` sur toutes les routes sensibles |
| Validation des entrées | Validation Laravel (`FormRequest`) sur chaque endpoint POST/PUT |
| Contrôle du type de fichier | Validation MIME et taille des fichiers uploadés côté serveur |
| CORS | Configuration stricte des origines autorisées via `config/cors.php` |
| Hachage des mots de passe | Utilisation du cast `hashed` d'Eloquent (bcrypt par défaut) |
| Exposition minimale | Champs `password` et `remember_token` masqués dans les réponses JSON |

> **Point d'attention :** Le stockage du jeton d'authentification en `localStorage` expose l'application aux attaques XSS. Une migration vers des cookies `httpOnly` est recommandée pour renforcer la sécurité en production.

### 4.3 Disponibilité et fiabilité

- L'application doit être disponible en continu en environnement de production.
- Les opérations critiques (mouvements de stock) utilisent des transactions SQL pour garantir la cohérence des données.
- Les fichiers uploadés sont stockés dans `storage/app/documents`, séparé du code applicatif.

### 4.4 Maintenabilité

- Code backend structuré selon les conventions Laravel (MVC, Eloquent).
- Code frontend organisé par fonctionnalité (pages, composants, contextes, utilitaires).
- Système de design unifié via des variables CSS globales (pas de dépendance à un framework CSS externe).
- ESLint configuré pour le frontend.
- PHP CS Fixer (Laravel Pint) disponible pour le backend.

### 4.5 Compatibilité

- Navigateurs cibles : Chrome, Firefox, Edge, Safari (versions récentes, Evergreen).
- Interface responsive : conçue pour une utilisation sur desktop ; adaptabilité mobile partielle via le layout CSS.
- Aucune dépendance à des plugins navigateur.

### 4.6 Scalabilité

- La base de données est configurable : SQLite pour le développement, MySQL / MariaDB / PostgreSQL pour la production.
- L'architecture API REST permet de connecter des clients supplémentaires (application mobile, intégrations tierces) sans modifier le backend.
- Le backend Laravel supporte nativement les files d'attente (queues) pour les tâches longues (génération de rapports volumeux).

### 4.7 Internationalisation

- L'interface utilisateur est entièrement en français.
- Les montants sont formatés en Dirham Marocain (MAD) selon la convention française (ex. : `1 234,50 DH`).
- Les dates sont affichées au format `JJ/MM/AAAA HH:MM`.

---

## 5. Architecture technique

### 5.1 Vue d'ensemble

L'application adopte une architecture **client-serveur découplée** :

```
┌─────────────────────────────────────────────────────────┐
│                     Navigateur Web                       │
│              React 19 SPA (Single Page App)              │
│           Vite · React Router · Axios · Recharts         │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP / REST (JSON)
                         │ Bearer Token (Sanctum)
┌────────────────────────▼────────────────────────────────┐
│                   Backend Laravel 12                      │
│          API REST · Sanctum · Eloquent ORM               │
│                DomPDF · CORS Middleware                   │
└────────────────────────┬────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
┌─────────▼──────────┐     ┌────────────▼──────────┐
│  SQLite (dev)       │     │  MySQL / MariaDB       │
│  database.sqlite    │     │  (production)          │
└────────────────────┘     └───────────────────────┘
```

### 5.2 Stack technologique

| Couche | Technologie | Version | Rôle |
|---|---|---|---|
| **Langage backend** | PHP | 8.2+ | Logique métier serveur |
| **Framework backend** | Laravel | 12.x | MVC, ORM, authentification, routing |
| **Authentification** | Laravel Sanctum | 4.0 | Tokens API stateless |
| **Génération PDF** | barryvdh/laravel-dompdf | 3.1 | Rendu de rapports PDF côté serveur |
| **Langage frontend** | JavaScript | ES2022+ | Logique interface utilisateur |
| **Framework frontend** | React | 19.2 | Composants UI réactifs |
| **Routing frontend** | React Router DOM | 7.14 | Navigation SPA côté client |
| **Client HTTP** | Axios | 1.15 | Appels API avec intercepteurs |
| **Visualisation** | Recharts | 3.8 | Graphiques (BarChart) |
| **Outil de build** | Vite | 8.0 | Bundling, HMR, proxy dev |
| **Styles** | CSS natif (custom) | — | Système de design via variables CSS |
| **Base de données** | SQLite / MySQL | — | Persistance des données |
| **ORM** | Eloquent | Laravel built-in | Abstraction base de données |
| **Linting backend** | Laravel Pint | — | Style de code PHP |
| **Linting frontend** | ESLint | — | Qualité du code JavaScript |

### 5.3 Structure du projet (monorepo)

```
gestion-de-stock/
├── backend/                    # Application Laravel 12
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/    # AuthController, ProductController,
│   │   │                       # StockMovementController, DocumentController,
│   │   │                       # DashboardController, ReportController
│   │   └── Models/             # User, Product, StockMovement, Document
│   ├── database/
│   │   └── migrations/         # 7 migrations (users, products,
│   │                           # stock_movements, documents, tokens...)
│   ├── routes/
│   │   └── api.php             # Définition de toutes les routes REST
│   ├── resources/views/reports/ # Templates Blade pour DomPDF
│   ├── storage/app/documents/  # Fichiers PDF uploadés
│   └── composer.json
│
├── frontend/                   # Application React 19
│   ├── src/
│   │   ├── api/axios.js        # Instance Axios avec intercepteurs
│   │   ├── contexts/           # AuthContext (session globale)
│   │   ├── router/             # Configuration React Router
│   │   ├── components/         # Layout, ProtectedRoute
│   │   ├── pages/              # Login, Dashboard, Products,
│   │   │                       # Movements, Documents, NotFound
│   │   └── utils/format.js     # Formatage MAD
│   └── package.json
│
└── data/                       # Base SQLite (développement)
```

### 5.4 Endpoints API REST

#### Routes publiques

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/login` | Authentification, retourne le token |
| `GET` | `/api/health` | Vérification de l'état du serveur |

#### Routes protégées (`auth:sanctum` requis)

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/user` | Profil de l'utilisateur connecté |
| `POST` | `/api/logout` | Révocation du token |
| `GET` | `/api/dashboard/stats` | Statistiques du tableau de bord |
| `GET` | `/api/products` | Liste de tous les produits |
| `POST` | `/api/products` | Création d'un produit |
| `GET` | `/api/products/{id}` | Détail d'un produit |
| `PUT` | `/api/products/{id}` | Mise à jour d'un produit |
| `DELETE` | `/api/products/{id}` | Suppression d'un produit |
| `GET` | `/api/products/export/csv` | Export CSV du catalogue |
| `POST` | `/api/products/import/csv` | Import CSV en masse |
| `GET` | `/api/stock-movements` | Historique des mouvements |
| `POST` | `/api/stock-movements` | Enregistrement d'un mouvement |
| `GET` | `/api/documents` | Liste des documents |
| `POST` | `/api/documents` | Upload d'un document PDF |
| `GET` | `/api/documents/{id}` | Téléchargement d'un document |
| `DELETE` | `/api/documents/{id}` | Suppression d'un document |
| `GET` | `/api/reports/stock/pdf` | Génération du rapport PDF |

### 5.5 Environnement de développement

| Commande | Description |
|---|---|
| `composer setup` | Installation complète : dépendances, `.env`, migrations, build frontend |
| `composer dev` | Lance en parallèle : serveur Laravel, queue worker, logs Pail, Vite HMR |

**Proxy Vite :** en développement, Vite proxifie les requêtes `/api` vers le serveur Laravel (`localhost:8000`), éliminant les problèmes CORS en local.

### 5.6 Déploiement production (recommandations)

- **Serveur web :** Nginx ou Apache avec PHP-FPM 8.2+
- **Base de données :** MySQL 8.0+ ou MariaDB 10.6+
- **Variables d'environnement :** `.env` pour `APP_KEY`, `DB_*`, `FRONTEND_URL`, `SANCTUM_STATEFUL_DOMAINS`
- **Build frontend :** `npm run build` génère les assets dans `frontend/dist/`
- **Stockage fichiers :** `php artisan storage:link` pour exposer `storage/app/public`
- **HTTPS :** Obligatoire en production pour sécuriser les tokens Bearer

---

## 6. Base de données et modèles de données

### 6.1 Schéma relationnel

```
┌──────────────┐          ┌─────────────────────┐          ┌──────────────┐
│    users     │          │   stock_movements    │          │   products   │
├──────────────┤          ├─────────────────────┤          ├──────────────┤
│ id (PK)      │◄─────────│ user_id (FK)         │─────────►│ id (PK)      │
│ name         │          │ product_id (FK)      │          │ name         │
│ email        │          │ type (entry/exit)    │          │ sku          │
│ role         │          │ quantity             │          │ description  │
│ password     │          │ notes                │          │ quantity     │
│ created_at   │          │ created_at           │          │ price        │
│ updated_at   │          │ updated_at           │          │ created_at   │
└──────────────┘          └─────────────────────┘          │ updated_at   │
       │                                                     └──────────────┘
       │ 1..N
┌──────▼───────┐
│  documents   │
├──────────────┤
│ id (PK)      │
│ name         │
│ file_path    │
│ user_id (FK) │
│ created_at   │
│ updated_at   │
└──────────────┘
```

### 6.2 Détail des entités

#### Table `users`

| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, Auto-increment | Identifiant unique |
| `name` | `VARCHAR(255)` | NOT NULL | Nom complet |
| `email` | `VARCHAR(255)` | NOT NULL, UNIQUE | Adresse email (identifiant de connexion) |
| `email_verified_at` | `TIMESTAMP` | NULLABLE | Date de vérification de l'email |
| `role` | `ENUM('admin','manager','employee')` | NOT NULL, DEFAULT 'employee' | Rôle applicatif |
| `password` | `VARCHAR(255)` | NOT NULL | Mot de passe hashé (bcrypt) |
| `remember_token` | `VARCHAR(100)` | NULLABLE | Token de reconnexion automatique |
| `created_at` | `TIMESTAMP` | — | Date de création |
| `updated_at` | `TIMESTAMP` | — | Date de dernière modification |

#### Table `products`

| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, Auto-increment | Identifiant unique |
| `name` | `VARCHAR(255)` | NOT NULL | Nom du produit |
| `sku` | `VARCHAR(255)` | NOT NULL, UNIQUE | Référence produit (Stock Keeping Unit) |
| `description` | `TEXT` | NULLABLE | Description détaillée |
| `quantity` | `INT` | NOT NULL, DEFAULT 0 | Quantité en stock |
| `price` | `DECIMAL(10,2)` | NOT NULL, DEFAULT 0 | Prix unitaire en MAD |
| `created_at` | `TIMESTAMP` | — | Date de création |
| `updated_at` | `TIMESTAMP` | — | Date de dernière modification |

#### Table `stock_movements`

| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, Auto-increment | Identifiant unique |
| `product_id` | `BIGINT UNSIGNED` | FK → `products.id`, CASCADE DELETE | Produit concerné |
| `user_id` | `BIGINT UNSIGNED` | FK → `users.id`, SET NULL | Opérateur (NULL si compte supprimé) |
| `type` | `ENUM('entry','exit')` | NOT NULL | Direction du mouvement |
| `quantity` | `INT` | NOT NULL | Quantité déplacée |
| `notes` | `VARCHAR(255)` | NULLABLE | Commentaire libre |
| `created_at` | `TIMESTAMP` | — | Date du mouvement |
| `updated_at` | `TIMESTAMP` | — | Date de dernière modification |

#### Table `documents`

| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, Auto-increment | Identifiant unique |
| `name` | `VARCHAR(255)` | NOT NULL | Nom du document |
| `file_path` | `VARCHAR(255)` | NOT NULL | Chemin physique du fichier PDF |
| `user_id` | `BIGINT UNSIGNED` | FK → `users.id`, CASCADE DELETE | Utilisateur ayant uploadé le document |
| `created_at` | `TIMESTAMP` | — | Date d'upload |
| `updated_at` | `TIMESTAMP` | — | Date de dernière modification |

#### Table `personal_access_tokens` (Laravel Sanctum)

| Colonne | Type | Description |
|---|---|---|
| `id` | `BIGINT UNSIGNED` | Identifiant unique |
| `tokenable_type` | `VARCHAR(255)` | Type du modèle propriétaire (polymorphique) |
| `tokenable_id` | `BIGINT UNSIGNED` | ID du modèle propriétaire |
| `name` | `VARCHAR(255)` | Nom du token |
| `token` | `VARCHAR(64)` | Hash SHA-256 du token |
| `abilities` | `TEXT` | Permissions JSON du token |
| `last_used_at` | `TIMESTAMP` | Dernière utilisation |
| `expires_at` | `TIMESTAMP` | Date d'expiration (NULL = pas d'expiration) |

### 6.3 Relations entre entités (Eloquent)

| Modèle | Relation | Modèle lié |
|---|---|---|
| `StockMovement` | `belongsTo` | `Product` |
| `StockMovement` | `belongsTo` | `User` |
| `Document` | `belongsTo` | `User` |

### 6.4 Règles métier sur les données

- **SKU unique :** Deux produits ne peuvent pas partager le même code SKU.
- **Quantité cohérente :** Lors d'un mouvement de type `exit`, la quantité du produit est décrémentée. Aucune garde-fou n'empêche actuellement une quantité négative — une validation métier est recommandée.
- **Transaction atomique :** La création d'un mouvement de stock et la mise à jour de `products.quantity` s'effectuent dans une même transaction SQL pour garantir la cohérence.
- **Cascade sur suppression produit :** La suppression d'un produit entraîne la suppression en cascade de tous ses mouvements associés.
- **Nullification sur suppression utilisateur :** La suppression d'un utilisateur met à `NULL` le `user_id` des mouvements de stock qu'il a enregistrés (traçabilité partielle conservée).
- **Cascade sur suppression utilisateur (documents) :** La suppression d'un utilisateur supprime également tous les documents qu'il a uploadés.

---

*Document généré automatiquement à partir de l'analyse du code source — Projet Gestion de Stock, branche `chore/sqlite`.*
