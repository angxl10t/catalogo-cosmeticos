# Catálogo de Cosméticos & Electrodomésticos

Sistema integral para catálogo B2C y panel de administración de productos, marcas (Cyzone, Unique / Yanbal, Ésika, Natura, Electro) y promociones con checkout por WhatsApp.

## 🏗️ Arquitectura del Monorepo

```text
catalogo-cosmeticos/
├── apps/
│   ├── web/            # Next.js 14+ (App Router, Tailwind CSS, TypeScript)
│   │                   # - Catálogo público para clientes optimizado para SEO
│   │                   # - API Routes (backend)
│   │                   # - Panel web de administración
│   │
│   └── mobile-admin/   # Flutter (Android / iOS / Desktop)
│                       # - Gestión rápida de inventario, fotos y promociones
│
├── supabase/           # Scripts SQL y migraciones
│   └── schema.sql      # Tablas de productos, variantes/tonos, marcas y RLS
│
└── README.md
```

## 🚀 Tecnologías Principales
* **Frontend Web & API:** Next.js, React, Tailwind CSS, TypeScript
* **Base de Datos & Auth:** Supabase (PostgreSQL + RLS + Storage)
* **App Móvil Admin:** Flutter (Dart)
* **Canal de Pedidos:** WhatsApp con generación de carritos dinámicos
