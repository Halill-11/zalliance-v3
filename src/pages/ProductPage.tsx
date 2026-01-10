import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import { Product } from '@shared/types';
import { Loader2, ArrowLeft, MessageCircle, ShieldCheck, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const addToCart = useAppStore((s) => s.addToCart);
  useEffect(() => {
    const fetchProductAndRelated = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // Fetch main product
        const data = await api<Product>(`/api/products/${id}`);
        setProduct(data);
        if (data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        setActiveImageIndex(0);
        // Fetch related products (simple implementation: fetch recent items and exclude current)
        const relatedData = await api<{ items: Product[] }>('/api/products?limit=5');
        const filtered = relatedData.items
          .filter(p => p.id !== id)
          .slice(0, 4);
        setRelatedProducts(filtered);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        toast.error('Impossible de charger les détails du produit');
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndRelated();
    // Scroll to top when ID changes
    window.scrollTo(0, 0);
  }, [id]);
  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize && product.sizes.length > 0) {
      toast.error('Veuillez sélectionner une taille');
      return;
    }
    addToCart(product, selectedSize || 'Unique');
    toast.success('Produit ajouté au panier');
  };
  const handleWhatsAppOrder = () => {
    if (!product) return;
    const phoneNumber = "221782412211"; // Replace with real number
    // Use the share proxy URL for the link preview
    // We use window.location.origin to ensure it points to the current deployment
    const shareUrl = `${window.location.origin}/api/share/product/${product.id}?img=${activeImageIndex}`;
    const sizeText = selectedSize ? ` (Taille: ${selectedSize})` : '';
    const price = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(product.price);
    // Message construction
    const message = `Bonjour ZALLIANCE, je souhaite commander ce produit :
Nom: ${product.name}${sizeText}
Prix: ${price}
Lien: ${shareUrl}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
        </div>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center p-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Produit introuvable</h2>
          <Link to="/">
            <Button>Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );
  }
  // Fallback for main image
  const mainImage = product.images?.[activeImageIndex] || 'https://placehold.co/600x800?text=No+Image';
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-amber-600 mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la collection
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] w-full overflow-hidden rounded-sm bg-slate-100 relative group">
              <img
                src={mainImage}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-transform duration-500"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={cn(
                      "aspect-[3/4] w-full overflow-hidden rounded-sm bg-slate-100 border-2 transition-all",
                      activeImageIndex === idx ? "border-amber-600 ring-1 ring-amber-600" : "border-transparent hover:border-slate-300"
                    )}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Product Details */}
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="text-sm font-bold text-amber-600 uppercase tracking-wider">{product.category}</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              {product.name}
            </h1>
            <p className="text-2xl md:text-3xl font-medium text-slate-900 dark:text-white mb-8">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(product.price)}
            </p>
            <div className="prose prose-slate dark:prose-invert mb-8 text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>{product.description}</p>
            </div>
            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-4">Choisir la taille</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "h-12 w-12 flex items-center justify-center rounded-sm border text-sm font-medium transition-all",
                        selectedSize === size
                          ? "border-amber-600 bg-amber-600 text-white"
                          : "border-slate-200 text-slate-900 hover:border-amber-600 hover:text-amber-600 dark:border-slate-700 dark:text-slate-100"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Actions */}
            <div className="mt-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full font-bold py-6 text-lg gap-2 border-slate-300 hover:border-amber-600 hover:text-amber-600"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingBag className="h-5 w-5" />
                  Ajouter au panier
                </Button>
                <Button
                  size="lg"
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-6 text-lg gap-2 shadow-lg hover:shadow-xl transition-all"
                  onClick={handleWhatsAppOrder}
                  disabled={!product.inStock}
                >
                  <MessageCircle className="h-6 w-6" />
                  Commander sur WhatsApp
                </Button>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mt-4">
                <ShieldCheck className="h-4 w-4" />
                <span>Paiement sécurisé via WhatsApp • Qualité Authentique Garantie</span>
              </div>
            </div>
          </div>
        </div>
        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-800 pt-16">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">
              Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
