import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@shared/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
interface ProductCardProps {
  product: Product;
}
export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/product/${product.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900">
        <div className="aspect-[3/4] w-full overflow-hidden bg-slate-100 relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {!product.inStock && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive" className="uppercase text-xs font-bold tracking-wider">
                Sold Out
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-xs font-medium text-amber-600 dark:text-amber-500 mb-1 uppercase tracking-wide">
                {product.category}
              </p>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-600 transition-colors">
                {product.name}
              </h3>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(product.price)}
          </p>
          <span className="text-sm text-slate-500 dark:text-slate-400 group-hover:translate-x-1 transition-transform">
            View Details →
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}