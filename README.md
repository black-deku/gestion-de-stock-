# 📦 Gestion de Stock — Stock Management System

A full-stack stock management web application with PDF viewing and downloading capabilities.

## Tech Stack

| Layer      | Technology            |
|------------|----------------------|
| Backend    | Laravel 12 (PHP 8.2) |
| Frontend   | React 18 (Vite)      |
| Database   | MySQL 8              |
| Auth       | Laravel Sanctum      |
| Styling    | Vanilla CSS          |

## Project Structure

```
gestion-de-stock/
├── backend/          # Laravel API
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   └── ...
├── frontend/         # React SPA
│   ├── src/
│   │   ├── api/      # Axios client
│   │   ├── pages/    # Page components
│   │   ├── router/   # React Router config
│   │   └── ...
│   └── ...
└── README.md
```

## Modules (Planned)

1. ✅ Project foundation & scaffolding
2. 🔲 Authentication & role-based access (Admin, Stock Manager, Employee)
3. 🔲 Product management CRUD
4. 🔲 Stock movements (entries & exits)
5. 🔲 PDF upload, protected viewing & download
6. 🔲 Dashboard with stock alerts & charts
7. 🔲 Import/export CSV or Excel
8. 🔲 Reports in PDF

## Prerequisites

- PHP >= 8.2
- Composer >= 2.x
- Node.js >= 18.x
- npm >= 9.x
- MySQL >= 8.0
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/black-deku/gestion-de-stock-.git
cd gestion-de-stock-
```

### 2. Backend setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Create a MySQL database named `gestion_de_stock`, then:

```bash
php artisan migrate
php artisan serve
```

The API will be available at `http://localhost:8000/api`.

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Verify

- API health check: `GET http://localhost:8000/api/health`
- Frontend: Open `http://localhost:5173` in your browser

## Development

- **Backend**: `php artisan serve` (port 8000)
- **Frontend**: `npm run dev` (port 5173, proxies `/api` to backend)

## License

This project is private.
