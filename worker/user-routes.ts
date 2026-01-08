import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, ProductEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { Product } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CF Workers Demo' }}));
  // USERS
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await UserEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/users', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    if (!name?.trim()) return bad(c, 'name required');
    return ok(c, await UserEntity.create(c.env, { id: crypto.randomUUID(), name: name.trim() }));
  });
  // CHATS
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await ChatBoardEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/chats', async (c) => {
    const { title } = (await c.req.json()) as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const created = await ChatBoardEntity.create(c.env, { id: crypto.randomUUID(), title: title.trim(), messages: [] });
    return ok(c, { id: created.id, title: created.title });
  });
  // MESSAGES
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });
  app.post('/api/chats/:chatId/messages', async (c) => {
    const chatId = c.req.param('chatId');
    const { userId, text } = (await c.req.json()) as { userId?: string; text?: string };
    if (!isStr(userId) || !text?.trim()) return bad(c, 'userId and text required');
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text.trim()));
  });
  // PRODUCTS
  app.get('/api/products', async (c) => {
    await ProductEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    // Default limit to 20 for products
    const limit = lq ? Math.max(1, (Number(lq) | 0)) : 20;
    const page = await ProductEntity.list(c.env, cq ?? null, limit);
    return ok(c, page);
  });
  app.get('/api/products/:id', async (c) => {
    const id = c.req.param('id');
    const product = new ProductEntity(c.env, id);
    if (!await product.exists()) return notFound(c, 'Product not found');
    return ok(c, await product.getState());
  });
  app.post('/api/products', async (c) => {
    const body = await c.req.json() as Partial<Product>;
    if (!body.name || !body.price) return bad(c, 'Name and price are required');
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: body.name,
      description: body.description || '',
      price: Number(body.price),
      category: body.category || 'Uncategorized',
      images: body.images || [],
      sizes: body.sizes || [],
      inStock: body.inStock ?? true,
      createdAt: Date.now()
    };
    return ok(c, await ProductEntity.create(c.env, newProduct));
  });
  app.put('/api/products/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json() as Partial<Product>;
    const product = new ProductEntity(c.env, id);
    if (!await product.exists()) return notFound(c, 'Product not found');
    const updated = await product.mutate(state => ({
      ...state,
      ...body,
      id: state.id // Ensure ID doesn't change
    }));
    return ok(c, updated);
  });
  app.delete('/api/products/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await ProductEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
  // --- NEW ROUTES FOR WHATSAPP PREVIEWS ---
  // 1. Image Proxy (Handles Base64 decoding for OG tags)
  app.get('/api/images/product/:id/:index', async (c) => {
    const id = c.req.param('id');
    const indexStr = c.req.param('index');
    const index = parseInt(indexStr || '0');
    const product = new ProductEntity(c.env, id);
    if (!await product.exists()) return notFound(c, 'Product not found');
    const data = await product.getState();
    const image = data.images?.[index];
    if (!image) return notFound(c, 'Image not found');
    // Check if Base64
    if (image.startsWith('data:')) {
      try {
        const matches = image.match('^data:([-A-Za-z+/]+);base64,(.+)$');
        if (!matches || matches.length !== 3) {
          return bad(c, 'Invalid base64 image');
        }
        const type = matches[1];
        const base64Data = matches[2];
        // Decode base64 to binary
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return c.body(bytes, 200, {
          'Content-Type': type,
          'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
        });
      } catch (e) {
        console.error('Image decode error:', e);
        return bad(c, 'Failed to decode image');
      }
    } else {
      // It's a URL, redirect to it
      return c.redirect(image);
    }
  });
  // 2. Share Proxy (Generates HTML with OG tags)
  app.get('/api/share/product/:id', async (c) => {
    const id = c.req.param('id');
    const imgIndex = c.req.query('img') || '0';
    const product = new ProductEntity(c.env, id);
    // If product doesn't exist, we can still redirect to home to avoid broken links
    if (!await product.exists()) {
       return c.html(`<html><head><script>window.location.href="/";</script></head><body>Redirecting...</body></html>`);
    }
    const data = await product.getState();
    const origin = new URL(c.req.url).origin;
    // Construct URLs
    // Use the image proxy so that even base64 images work in OG tags
    const imageUrl = `${origin}/api/images/product/${id}/${imgIndex}`;
    const frontendUrl = `${origin}/product/${id}`;
    const price = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(data.price);
    const title = `${data.name} - ${price}`;
    const description = data.description ? data.description.substring(0, 200) + (data.description.length > 200 ? '...' : '') : 'Découvrez ce produit sur ZALLIANCE';
    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- Open Graph / Facebook / WhatsApp -->
        <meta property="og:type" content="product" />
        <meta property="og:url" content="${frontendUrl}" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="800" />
        <meta property="og:site_name" content="ZALLIANCE" />
        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="${frontendUrl}" />
        <meta property="twitter:title" content="${title}" />
        <meta property="twitter:description" content="${description}" />
        <meta property="twitter:image" content="${imageUrl}" />
        <!-- Redirect to actual product page -->
        <script>
          window.location.href = "${frontendUrl}";
        </script>
      </head>
      <body>
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; flex-direction: column; gap: 20px;">
          <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #D97706; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <p>Redirection vers ZALLIANCE...</p>
          <a href="${frontendUrl}" style="color: #D97706; text-decoration: none;">Cliquez ici si la redirection ne fonctionne pas</a>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </body>
      </html>
    `;
    return c.html(html);
  });
  // DELETE: Users
  app.delete('/api/users/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await UserEntity.delete(c.env, c.req.param('id')) }));
  app.post('/api/users/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await UserEntity.deleteMany(c.env, list), ids: list });
  });
  // DELETE: Chats
  app.delete('/api/chats/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await ChatBoardEntity.delete(c.env, c.req.param('id')) }));
  app.post('/api/chats/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await ChatBoardEntity.deleteMany(c.env, list), ids: list });
  });
}