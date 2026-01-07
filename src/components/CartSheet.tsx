import React from 'react';
import { ShoppingBag, Trash2, Plus, Minus, MessageCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
export function CartSheet() {
  const cart = useAppStore((s) => s.cart);
  const removeFromCart = useAppStore((s) => s.removeFromCart);
  const updateQuantity = useAppStore((s) => s.updateQuantity);
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const phoneNumber = "221770000000"; // Replace with real number
    let message = "Bonjour ZALLIANCE, je souhaite commander ces produits :\n\n";
    cart.forEach(item => {
      const price = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(item.price);
      message += `- ${item.name} (Taille: ${item.selectedSize}) x${item.quantity} - ${price}\n`;
    });
    const formattedTotal = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(total);
    message += `\nTotal: ${formattedTotal}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Panier">
          <ShoppingBag className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white animate-scale-in">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="h-5 w-5" />
            Mon Panier ({itemCount})
          </SheetTitle>
          <Separator />
        </SheetHeader>
        <div className="flex-1 overflow-hidden relative mt-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4 text-muted-foreground">
              <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                <ShoppingBag className="h-8 w-8 opacity-50" />
              </div>
              <p className="text-lg font-medium text-foreground">Votre panier est vide</p>
              <p className="text-sm max-w-xs">Découvrez nos collections exclusives et ajoutez des articles à votre panier.</p>
            </div>
          ) : (
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6 pb-4">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 group">
                    <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-slate-100">
                      <img
                        src={item.images?.[0] || 'https://placehold.co/100x100?text=No+Img'}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="grid gap-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-sm line-clamp-2 leading-tight">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1 -mr-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Taille: <span className="font-medium text-foreground">{item.selectedSize}</span>
                        </p>
                        <p className="text-sm font-semibold text-amber-600">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => updateQuantity(item.id, item.selectedSize, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => updateQuantity(item.id, item.selectedSize, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        {cart.length > 0 && (
          <SheetFooter className="mt-auto pt-4 border-t bg-background">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between text-base font-medium">
                <span>Total</span>
                <span className="text-xl font-bold text-amber-600">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(total)}
                </span>
              </div>
              <Button 
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-6 text-lg gap-2 shadow-md hover:shadow-lg transition-all"
                onClick={handleWhatsAppOrder}
              >
                <MessageCircle className="h-5 w-5" />
                Commander sur WhatsApp
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-3 w-3" />
                <span>Paiement sécurisé à la livraison</span>
              </div>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}