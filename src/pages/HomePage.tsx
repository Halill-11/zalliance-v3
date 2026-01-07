import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import { Product } from '@shared/types';
import { Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api<{ items: Product[]; next: string | null }>('/api/products?limit=12');
        setProducts(response.items);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load collections. Please try again later.');
        toast.error('Could not load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=2000&auto=format&fit=crop"
          alt="African Luxury Fashion"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
            ZALLIANCE
          </h1>
          <p className="text-lg md:text-2xl text-slate-100 max-w-2xl mb-10 font-light drop-shadow-md">
            Elevating African Luxury Couture. Experience the perfect blend of tradition and modern sophistication.
          </p>
          <Button
            size="lg"
            className="bg-amber-600 hover:bg-amber-700 text-white border-none text-lg px-8 py-6 rounded-none"
            onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Discover Collection
          </Button>
        </div>
      </section>
      {/* Collections Grid */}
      <main id="collections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Latest Arrivals
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Curated pieces for the distinguished gentleman.
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex gap-2">
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        <div className="mt-12 flex justify-center md:hidden">
          <Button variant="outline" className="w-full">
            View All Collections
          </Button>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-display text-2xl font-bold mb-4">ZALLIANCE</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Premium African couture for the modern era. We bring you the finest fabrics and craftsmanship from across the continent.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-amber-500">Customer Service</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-amber-500">Connect</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">WhatsApp</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} ZALLIANCE. All rights reserved.</p>
            <p className="mt-2">Built with ❤️ by Aurelia | Your AI Co-founder</p>
          </div>
        </div>
      </footer>
    </div>
  );
}