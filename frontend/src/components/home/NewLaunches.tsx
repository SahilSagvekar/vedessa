import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';

const NewLaunches = () => {
  // Fetch new products from backend using the hook
  const { products, loading, error } = useProducts({ 
    isNew: true,
    limit: 4 
  });

  // SAFETY: Always ensure we have an array
  const safeProducts = Array.isArray(products) ? products : [];

  console.log('NewLaunches - products:', products);
  console.log('NewLaunches - safeProducts:', safeProducts);
  console.log('NewLaunches - loading:', loading);
  console.log('NewLaunches - error:', error);

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
    console.error('NewLaunches error:', error);
    return null; // Silently fail - don't break the page
  }

  if (safeProducts.length === 0) {
    return null; // Don't show section if no new products
  }

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display text-foreground">New Launches</h2>
            <p className="text-muted-foreground mt-1">
              Discover our latest creations
            </p>
          </div>

          <Link to="/products?filter=new">
            <Button
              variant="outline"
              className="border-foreground text-foreground hover:bg-foreground hover:text-background"
            >
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

export default NewLaunches;