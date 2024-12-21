import { useState, useEffect, useRef, useCallback } from "react";
import { Product, ProductWithDiscount } from "../types/interfaces";
import FetchProducts from "../api/FetchProducts";

interface ProductPickerProps {
  onProductsSelected: (products: ProductWithDiscount[]) => void;
  onClose: () => void;
}

export function ProductPicker({ onProductsSelected, onClose }: ProductPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set()
  );
  const [selectedVariants, setSelectedVariants] = useState<Set<number>>(
    new Set()
  );

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const debounceTimerRef = useRef<any>();

  const loadProducts = useCallback(
    async (currentPage: number, isNewSearch: boolean = false) => {
      const loadingState = isNewSearch ? setIsLoading : setIsLoadingMore;
      try {
        loadingState(true);
        setError(null);

        const result = await FetchProducts(searchTerm, currentPage, 10);

        setProducts((prev) =>
          isNewSearch ? result.products : [...prev, ...result.products]
        );
        setHasMore(result.hasMore);
      } catch (err) {
        setError("Failed to load products. Please try again.");
      } finally {
        loadingState(false);
      }
    },
    [searchTerm]
  );

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setPage(1);
    debounceTimerRef.current = setTimeout(() => {
      loadProducts(1, true);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm, loadProducts]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isLoading && !isLoadingMore) {
        setPage((prev) => prev + 1);
      }
    }, options);

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, isLoadingMore]);

  useEffect(() => {
    if (page > 1) {
      loadProducts(page);
    }
  }, [page, loadProducts]);

  const handleProductSelect = (productId: number) => {
    const newSelectedProducts = new Set(selectedProducts);
    if (selectedProducts.has(productId)) {
      newSelectedProducts.delete(productId);
      const variantsToRemove =
        products.find((p) => p.id === productId)?.variants.map((v) => v.id) ||
        [];
      const newSelectedVariants = new Set(selectedVariants);
      variantsToRemove.forEach((id) => newSelectedVariants.delete(id));
      setSelectedVariants(newSelectedVariants);
    } else {
      newSelectedProducts.add(productId);
    }
    setSelectedProducts(newSelectedProducts);
  };

  const handleVariantSelect = (variantId: number, productId: number) => {
    const newSelectedVariants = new Set(selectedVariants);
    if (selectedVariants.has(variantId)) {
      newSelectedVariants.delete(variantId);
      const productVariants =
        products.find((p) => p.id === productId)?.variants || [];
      const hasSelectedVariants = productVariants.some((v) =>
        newSelectedVariants.has(v.id)
      );
      if (!hasSelectedVariants) {
        const newSelectedProducts = new Set(selectedProducts);
        newSelectedProducts.delete(productId);
        setSelectedProducts(newSelectedProducts);
      }
    } else {
      newSelectedVariants.add(variantId);
      setSelectedProducts(new Set(selectedProducts).add(productId));
    }
    setSelectedVariants(newSelectedVariants);
  };

  const handleAdd = () => {
    const selectedProductsData = products
      .filter((product) => selectedProducts.has(product.id))
      .map((product) => ({
        ...product,
        variants: product.variants.filter((variant) =>
          selectedVariants.has(variant.id)
        ),
      }));

    onProductsSelected(selectedProductsData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-[600px]">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Select Products</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-9 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>

          <div className="max-h-[400px] overflow-y-auto space-y-4 scroll-smooth">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : (
              <>
                {products.map((product) => (
                  <div key={product.id} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => handleProductSelect(product.id)}
                        className="w-4 h-4"
                      />
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image.src}
                          alt={product.title}
                          className="h-12 w-12 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium">{product.title}</div>
                          <div className="text-sm text-gray-500">
                            {product.variants.length} variants
                          </div>
                        </div>
                      </div>
                    </div>
                    {selectedProducts.has(product.id) && (
                      <div className="ml-8 space-y-2">
                        {product.variants.map((variant) => (
                          <div
                            key={variant.id}
                            className="flex items-center gap-3"
                          >
                            <input
                              type="checkbox"
                              checked={selectedVariants.has(variant.id)}
                              onChange={() =>
                                handleVariantSelect(variant.id, product.id)
                              }
                              className="w-4 h-4"
                            />
                            <div>
                              <div className="font-medium">{variant.title}</div>
                              <div className="text-sm text-gray-500">
                                ${variant.price} available
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div ref={loadingRef} className="py-4">
                  {isLoadingMore && (
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={isLoading}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
