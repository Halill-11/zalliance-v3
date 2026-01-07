import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import { Product } from '@shared/types';
import { Loader2, ArrowLeft, MessageCircle, Check, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api<Product>(`/api/products/${id}`);
        setProduct(data);
        if (data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        toast.error('Could not load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  const handleWhatsAppOrder = () => {
    if (!product) return;
    const phoneNumber = "221770000000"; // Replace with real number
    const productUrl = window.location.href;
    const sizeText = selectedSize ? ` (Taille: ${selectedSize})` : '';
    const message = `Bonjour ZALLIANCE, je souhaite commander ce produit : ${product.name}${sizeText}. Voici le lien : ${productUrl}`;
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Product Not Found</h2>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-amber-600 mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Collection
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] w-full overflow-hidden rounded-sm bg-slate-100 relative group">
              <img
                src={product.images[activeImageIndex]}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-transform duration-500"
              />
            </div>
            {product.images.length > 1 && (
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
                <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-4">Select Size</h3>
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
              <Button
                size="lg"
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-6 text-lg gap-2 shadow-lg hover:shadow-xl transition-all"
                onClick={handleWhatsAppOrder}
                disabled={!product.inStock}
              >
                <MessageCircle className="h-6 w-6" />
                {product.inStock ? 'Commander sur WhatsApp' : 'Out of Stock'}
              </Button>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mt-4">
                <ShieldCheck className="h-4 w-4" />
                <span>Secure checkout via WhatsApp • Authentic Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}