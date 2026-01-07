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