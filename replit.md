# K&M Torneadora — Sistema de Controle de Estoque

## Project Overview

Full-stack inventory management system for K&M Torneadora, a micro company that manufactures mining equipment. Built as a university integration project (Gran Faculdade).

## Architecture

- **Frontend:** React 18 + Vite, running on port 5000
- **Backend:** Node.js + Express, running on port 3001
- **Data:** In-memory arrays (no database — data resets on server restart)

## Project Structure

```
/
├── backend/
│   ├── server.js                    # Express app entry point
│   └── controllers/
│       ├── fornecedorController.js  # Supplier CRUD routes
│       ├── produtoController.js     # Equipment/product CRUD routes
│       └── associacaoController.js  # Supplier-equipment link routes
├── frontend/
│   ├── vite.config.js               # Vite config (port 5000, proxy to backend)
│   └── src/
│       ├── App.jsx                  # Main app shell with tab navigation
│       └── pages/
│           ├── Fornecedores.jsx     # Supplier management page
│           ├── Produtos.jsx         # Equipment/machinery management page
│           └── Associacao.jsx       # Link suppliers to equipment page
```

## Workflows

- **Start application** — `cd frontend && npm run dev` (port 5000, webview)
- **Backend** — `cd backend && node server.js` (port 3001, console)

## Proxy Configuration

Vite proxies `/fornecedores`, `/produtos`, and `/associacao` to `http://localhost:3001` so the frontend uses relative API paths instead of hardcoded localhost URLs.

## Key Features

- Supplier (Fornecedor) management: list, add, delete
- Equipment/Machinery (Maquinário) management: list, add, delete with categories
- Supplier-to-equipment association (Associação): link/unlink suppliers to equipment
- Visual alert for equipment without an assigned supplier

## API Routes

| Method | Route                  | Description              |
|--------|------------------------|--------------------------|
| GET    | /fornecedores          | List suppliers           |
| POST   | /fornecedores          | Create supplier          |
| DELETE | /fornecedores/:id      | Delete supplier          |
| GET    | /produtos              | List equipment           |
| GET    | /produtos/categorias   | List categories          |
| POST   | /produtos              | Create equipment         |
| DELETE | /produtos/:id          | Delete equipment         |
| POST   | /associacao            | Link supplier to product |
| DELETE | /associacao/:produtoId | Remove link              |
