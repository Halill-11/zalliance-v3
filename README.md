# ZALLIANCE - African Luxury Couture Platform

[aureliabutton]

## Overview

ZALLIANCE is a premium e-commerce platform dedicated to African high-fashion suits and traditional attire. Designed with a "Modern African Luxury" aesthetic, the platform features a stunning public storefront for customers to browse collections and a robust admin dashboard for inventory management.

The application leverages Cloudflare Durable Objects for low-latency product data storage and retrieval, ensuring a seamless and fast user experience. A key feature is the "Order via WhatsApp" integration, facilitating direct-to-merchant sales and personalized customer service.

## Key Features

- **Luxury Storefront:** A visually immersive interface with high-quality imagery, sophisticated typography, and a deep navy blue and gold color palette.
- **WhatsApp Ordering Integration:** Seamless "Commander sur WhatsApp" functionality that pre-fills messages with product details for direct sales.
- **Product Management:** Detailed product views with multi-image galleries, size guides, and specifications.
- **Admin Dashboard:** A protected interface for boutique owners to manage the catalog, update pricing, and track inventory.
- **High Performance:** Built on Cloudflare Workers and Durable Objects for edge-based low-latency data access.
- **Responsive Design:** Flawless layouts across all device sizes, from mobile phones to ultra-wide desktop screens.

## Technology Stack

This project is built using a modern, high-performance stack:

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS v3
- **UI Components:** Shadcn UI (Radix Primitives)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **State Management:** Zustand
- **Routing:** React Router DOM
- **Forms:** React Hook Form + Zod

### Backend & Infrastructure
- **Runtime:** Cloudflare Workers
- **Framework:** Hono
- **Storage:** Cloudflare Durable Objects (for consistent, transactional state)
- **Language:** TypeScript (Full-stack type safety)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0.0 or higher)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (Cloudflare CLI)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/zalliance-couture.git
   cd zalliance-couture
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

### Development

To start the development server (which runs both the frontend and the worker proxy):

```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

### Project Structure

- `/src`: React frontend application.
  - `/components`: Reusable UI components (Shadcn).
  - `/pages`: Application views (Home, Product Detail, Admin).
  - `/lib`: Utilities and API clients.
- `/worker`: Cloudflare Worker backend.
  - `index.ts`: Entry point.
  - `user-routes.ts`: API route definitions.
  - `entities.ts`: Durable Object entity definitions.
- `/shared`: Types and constants shared between frontend and backend.

## Deployment

This project is configured for seamless deployment to Cloudflare Workers.

[aureliabutton]

### Manual Deployment

To deploy the application to your Cloudflare account:

1. Login to Cloudflare (if not already logged in):
   ```bash
   npx wrangler login
   ```

2. Deploy the project:
   ```bash
   bun run deploy
   ```

This command builds the frontend assets and deploys the Worker with the static assets.

## License

This project is licensed under the MIT License.