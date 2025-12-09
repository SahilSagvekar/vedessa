import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';

const Bestsellers = () => {
  // Fetch bestseller products from backend
  const { products, loading, error } = useProducts({ 
    isBestseller: true,
    limit: 4 
  });

  // SAFETY: Always ensure we have an array
  const safeProducts = Array.isArray(products) ? products : [];

  console.log('Bestsellers - products:', products);
  console.log('Bestsellers - safeProducts:', safeProducts);
  console.log('Bestsellers - loading:', loading);
  console.log('Bestsellers - error:', error);

  if (loading) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Bestsellers error:', error);
    return null; // Silently fail - don't break the page
  }

  if (safeProducts.length === 0) {
    return null; // Don't show section if no bestsellers
  }

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display text-foreground">Bestsellers</h2>
            <p className="text-muted-foreground mt-1">Customer favorites</p>
          </div>
          <Link to="/products?filter=bestseller">
            <Button variant="outline" className="border-foreground text-foreground hover:bg-foreground hover:text-background">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {safeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Bestsellers;