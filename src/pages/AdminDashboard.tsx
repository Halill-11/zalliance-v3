import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api-client';
import { Product } from '@shared/types';
import { useAppStore } from '@/lib/store';
import { Loader2, Trash2, Plus, Lock, Pencil, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ImageUpload';
// Schema for adding/editing a product
const productSchema = z.object({
  name: z.string().min(2, 'Le nom est requis'),
  description: z.string().min(10, 'La description est requise'),
  price: z.number().min(1, 'Le prix doit être positif'),
  category: z.string().min(2, 'La catégorie est requise'),
  images: z.array(z.string()).min(1, 'Au moins une image est requise'),
  sizes: z.string().optional(), // Comma separated
});
// Explicitly define the interface to match the schema
type ProductFormValues = z.infer<typeof productSchema>;
const defaultValues: ProductFormValues = {
  name: '',
  description: '',
  price: 0,
  category: '',
  images: [],
  sizes: 'S, M, L, XL',
};
export function AdminDashboard() {
  const isAdmin = useAppStore((s) => s.isAdmin);
  const login = useAppStore((s) => s.login);
  const logout = useAppStore((s) => s.logout);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  // Mock Login State
  const [password, setPassword] = useState('');
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
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
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images || [],
      sizes: product.sizes.join(', '),
    });
    setIsDialogOpen(true);
  };
  const onSubmit = async (values: ProductFormValues) => {
    try {
      const productData = {
        ...values,
        images: values.images,
        sizes: values.sizes ? values.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        inStock: true,
      };
      if (editingProduct) {
        // Update existing product
        await api<Product>(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify(productData),
        });
        toast.success('Produit modifié avec succ��s');
      } else {
        // Create new product
        await api<Product>('/api/products', {
          method: 'POST',
          body: JSON.stringify(productData),
        });
        toast.success('Produit ajouté avec succès');
      }
      setIsDialogOpen(false);
      form.reset(defaultValues);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error(editingProduct ? 'Erreur lors de la modification' : 'Erreur lors de l\'ajout');
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    try {
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-slate-900">Gestion des Produits</h1>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              onClick={() => logout()} 
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </Button>
            <Dialog 
              open={isDialogOpen} 
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                  setEditingProduct(null);
                  form.reset(defaultValues);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-amber-600 hover:bg-amber-700 flex-1 md:flex-none">
                  <Plus className="mr-2 h-4 w-4" /> Ajouter un Produit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations ci-dessous pour {editingProduct ? 'modifier' : 'créer'} un produit.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Images du Produit</FormLabel>
                          <FormControl>
                            <ImageUpload 
                              value={field.value} 
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>
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
                            <Textarea placeholder="Description du produit..." className="h-24" {...field} />
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
                    <Button type="submit" className="w-full bg-slate-900">
                      {editingProduct ? 'Enregistrer les modifications' : 'Créer le Produit'}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
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
                      <div className="h-12 w-12 rounded overflow-hidden bg-slate-100">
                        <img 
                          src={product.images?.[0] || 'https://placehold.co/100x100?text=No+Img'} 
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(product.price)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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