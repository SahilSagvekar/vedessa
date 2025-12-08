import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";

const NewLaunches = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'vedessa-production.up.railway.app/api';

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/products?filter=new&limit=4 `
        );

        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        setNewProducts(data);
      } catch (err) {
        console.error("Error fetching new products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

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

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewLaunches;
