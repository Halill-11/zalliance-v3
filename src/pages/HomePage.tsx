import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import { Product } from '@shared/types';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api<{ items: Product[]; next: string | null }>('/api/products?limit=12');
        setProducts(response.items);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Impossible de charger les collections. Veuillez réessayer plus tard.');
        toast.error('Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  // Handle hash scrolling on mount or location change
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Small delay to ensure layout is stable
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);
  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/40 z-10" />
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear" }}
          src="src/assets/accueille.jpg"
          alt="African Luxury Fashion"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl"
          >
            <motion.h1
              variants={fadeInUp}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight drop-shadow-lg"
            >
              ZALLIANCE
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-2xl text-slate-100 max-w-2xl mx-auto mb-10 font-light drop-shadow-md"
            >
              L'élégance de la haute couture africaine. Découvrez l'alliance parfaite entre tradition et sophistication moderne.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white border-none text-lg px-8 py-6 rounded-none transition-all duration-300 hover:scale-105"
                onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Découvrir la Collection
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Collections Grid */}
      <main id="collections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Dernières Arrivées
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Des pièces sélectionnées pour l'homme distingué.
            </p>
          </motion.div>
          <Button variant="outline" className="hidden md:flex gap-2">
            Voir Tout <ArrowRight className="h-4 w-4" />
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
              Réessayer
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Aucun produit trouvé.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={fadeInUp}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
        <div className="mt-12 flex justify-center md:hidden">
          <Button variant="outline" className="w-full">
            Voir Toutes les Collections
          </Button>
        </div>
      </main>
      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-slate-100 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] w-full rounded-sm overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1507120410856-1f35574c3b45?q=80&w=1000&auto=format&fit=crop" 
                  alt="ZALLIANCE Atelier" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-amber-600 rounded-sm -z-10 hidden md:block" />
              <div className="absolute -top-6 -left-6 w-48 h-48 border-2 border-slate-300 dark:border-slate-700 rounded-sm -z-10 hidden md:block" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                L'Art de l'Élégance Africaine
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Chez ZALLIANCE, nous croyons que le vêtement est plus qu'une simple parure ; c'est une expression d'identité, d'héritage et d'ambition.
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Fondée avec la vision de redéfinir le luxe africain, notre maison combine des techniques de couture traditionnelles avec des coupes contemporaines. Chaque pièce est méticuleusement conçue pour l'homme moderne qui valorise l'authenticité sans compromettre le style.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Matériaux Premium</h4>
                    <p className="text-sm text-slate-500">Tissus importés de haute qualité et textiles africains authentiques.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Artisanat d'Excellence</h4>
                    <p className="text-sm text-slate-500">Chaque couture est réalisée avec précision par nos maîtres tailleurs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Service Personnalisé</h4>
                    <p className="text-sm text-slate-500">Une expérience d'achat sur mesure, de la sélection à la livraison.</p>
                  </div>
                </div>
              </div>
              <Button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg">
                Notre Histoire
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-display text-2xl font-bold mb-4">ZALLIANCE</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Haute couture africaine premium pour l'ère moderne. Nous vous apportons les tissus les plus fins et l'artisanat de tout le continent.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-amber-500">Service Client</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Nous Contacter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Politique de Livraison</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Retours & Échanges</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guide des Tailles</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-amber-500">Suivez-nous</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">WhatsApp</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} ZALLIANCE. Tous droits réservés.</p>
            <p className="mt-2">Developpé par DIGITALL +22178242211</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
