import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api-client';
import { Product } from '@shared/types';
import { useAppStore } from '@/lib/store';
import { Loader2, Trash2, Plus, Lock } from 'lucide-react';
import { toast } from 'sonner';
// Schema for adding a product
const productSchema = z.object({
  name: z.string().min(2, 'Le nom est requis'),
  description: z.string().min(10, 'La description est requise'),
  price: z.number().min(1, 'Le prix doit être positif'),
  category: z.string().min(2, 'La catégorie est requise'),
  imageUrl: z.string().url('Doit être une URL valide'),
  sizes: z.string().optional(), // Comma separated
});
// Explicitly define the interface to match the schema
type ProductFormValues = z.infer<typeof productSchema>;
export function AdminDashboard() {
  const isAdmin = useAppStore((s) => s.isAdmin);
  const login = useAppStore((s) => s.login);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Mock Login State
  const [password, setPassword] = useState('');
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      imageUrl: '',
      sizes: 'S, M, L, XL',
    },
  });
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api<{ items: Product[]; next: string | null }>('/api/products?limit=100');
      setProducts(response.items);
    } catch (err) {
      toast.error('Impossible de charger les produits');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Mock password
      login();
      toast.success('Bienvenue, Admin');
    } else {
      toast.error('Mot de passe invalide');
    }
  };
  const onSubmit = async (values: ProductFormValues) => {
    try {
      const newProduct = {
        ...values,
        images: [values.imageUrl],
        sizes: values.sizes ? values.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        inStock: true,
      };
      // Explicitly typed API call
      await api<Product>('/api/products', {
        method: 'POST',
        body: JSON.stringify(newProduct),
      });
      toast.success('Produit ajouté avec succès');
      setIsDialogOpen(false);
      form.reset();
      fetchProducts();
    } catch (err) {
      toast.error('Erreur lors de l\'ajout du produit');
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    try {
      // Explicitly typed API call
      await api<{ id: string; deleted: boolean }>(`/api/products/${id}`, { method: 'DELETE' });
      toast.success('Produit supprimé');
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 bg-slate-900 rounded-full flex items-center justify-center">
              <Lock className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6 text-slate-900">Accès Admin</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Entrez le mot de passe (admin123)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800">
              Connexion
            </Button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Gestion des Produits</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="mr-2 h-4 w-4" /> Ajouter un Produit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Ajouter un Nouveau Produit</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom du produit" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie</FormLabel>
                        <FormControl>
                          <Input placeholder="ex: Boubou, Sénateur" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix (XOF)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Description du produit..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de l'image</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sizes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tailles (séparées par des virgules)</FormLabel>
                        <FormControl>
                          <Input placeholder="S, M, L, XL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-slate-900">Créer le Produit</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.images?.[0] || 'https://placehold.co/100x100?text=No+Img'}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(product.price)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      Aucun produit trouvé. Ajoutez-en un pour commencer.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}