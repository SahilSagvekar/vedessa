import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import productsService from '@/services/productsService';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchModalProps {
    open: boolean;
    onClose: () => void;
}

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category_name?: string;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const debouncedQuery = useDebounce(query, 300);

    const searchProducts = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setSearched(false);
            return;
        }

        setLoading(true);
        setSearched(true);

        try {
            const response = await productsService.getProducts({ search: searchQuery, limit: 10 });
            setResults(response.data.products || []);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        searchProducts(debouncedQuery);
    }, [debouncedQuery, searchProducts]);

    const handleProductClick = (productId: string) => {
        onClose();
        setQuery('');
        navigate(`/products/${productId}`);
    };

    const handleViewAll = () => {
        onClose();
        setQuery('');
        navigate(`/products?search=${encodeURIComponent(query)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && query.trim()) {
            handleViewAll();
        }
    };

    // Reset state when modal closes
    useEffect(() => {
        if (!open) {
            setQuery('');
            setResults([]);
            setSearched(false);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 gap-0">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                    <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <Input
                        type="text"
                        placeholder="Search for products..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 border-0 focus-visible:ring-0 text-lg placeholder:text-gray-400"
                        autoFocus
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    )}
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        </div>
                    ) : searched && results.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No products found for "{query}"</p>
                            <p className="text-sm text-gray-400 mt-2">Try a different search term</p>
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            <div className="p-2">
                                {results.map((product) => (
                                    <button
                                        key={product.id}
                                        onClick={() => handleProductClick(product.id)}
                                        className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                    >
                                        <img
                                            src={product.image || '/placeholder.svg'}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover rounded-md bg-gray-100"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                                            }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                                            {product.category_name && (
                                                <p className="text-sm text-gray-500">{product.category_name}</p>
                                            )}
                                            <p className="text-sm font-semibold text-gray-900 mt-1">
                                                ₹{product.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* View All Button */}
                            <div className="p-4 border-t border-gray-200">
                                <button
                                    onClick={handleViewAll}
                                    className="w-full py-3 text-center text-sm font-medium text-green-700 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                    View all results for "{query}"
                                </button>
                            </div>
                        </>
                    ) : !searched ? (
                        <div className="p-6">
                            <p className="text-sm text-gray-500 mb-4">Popular Searches</p>
                            <div className="flex flex-wrap gap-2">
                                {['Face Cream', 'Hair Oil', 'Skincare', 'Kumkumadi', 'Bringaras'].map((term) => (
                                    <button
                                        key={term}
                                        onClick={() => setQuery(term)}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}
