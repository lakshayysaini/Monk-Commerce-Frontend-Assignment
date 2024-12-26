import { useState, useEffect, useRef, useCallback, memo } from "react";
import { Product, ProductWithDiscount } from "../types/interfaces";
import FetchProducts from "../api/FetchProducts";
import InfiniteScroll from "react-infinite-scroll-component";
import { X } from "lucide-react";

interface ProductPickerProps {
  onProductsSelected: (products: ProductWithDiscount[]) => void;
  onClose: () => void;
}

const ProductVariant = memo(
  ({
    variant,
    isSelected,
    onSelect,
  }: {
    variant: any;
    isSelected: boolean;
    onSelect: () => void;
  }) => (
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        className="w-4 h-4"
      />
      <div>
        <div className="font-medium">{variant.title}</div>
        <div className="text-sm text-gray-500">${variant.price} available</div>
      </div>
    </div>
  )
);

const ProductItem = memo(
  ({
    product,
    isSelected,
    selectedVariants,
    onProductSelect,
    onVariantSelect,
  }: {
    product: Product;
    isSelected: boolean;
    selectedVariants: Set<number>;
    onProductSelect: (id: number) => void;
    onVariantSelect: (variantId: number, productId: number) => void;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onProductSelect(product.id)}
          className="w-4 h-4"
        />
        <div className="flex items-center gap-3">
          <img
            src={product.image.src}
            alt={product.title}
            className="h-12 w-12 object-cover rounded"
            loading="lazy"
          />
          <div>
            <div className="font-medium">{product.title}</div>
            <div className="text-sm text-gray-500">
              {product.variants.length} variants
            </div>
          </div>
        </div>
      </div>
      {isSelected && (
        <div className="ml-8 space-y-2">
          {product.variants.map((variant) => (
            <ProductVariant
              key={variant.id}
              variant={variant}
              isSelected={selectedVariants.has(variant.id)}
              onSelect={() => onVariantSelect(variant.id, product.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
);

export function ProductPicker({
  onProductsSelected,
  onClose,
}: ProductPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set()
  );
  const [selectedVariants, setSelectedVariants] = useState<Set<number>>(
    new Set()
  );

  const debounceTimerRef = useRef<any>();
  const loadingRef = useRef(false);

  const loadProducts = useCallback(
    async (currentPage: number, isNewSearch: boolean = false) => {
      if (loadingRef.current) return;

      try {
        loadingRef.current = true;
        setIsLoading(true);
        setError(null);

        const result = await FetchProducts(searchTerm, currentPage, 10);

        setProducts((prev) =>
          isNewSearch ? result.products : [...prev, ...result.products]
        );
        setHasMore(result.hasMore);
      } catch (err) {
        setError("Failed to load products. Please try again.");
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
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

  const fetchMoreData = useCallback(() => {
    if (!isLoading && !loadingRef.current) {
      setPage((prev) => prev + 1);
      loadProducts(page + 1);
    }
  }, [isLoading, page, loadProducts]);

  const handleProductSelect = useCallback(
    (productId: number) => {
      setSelectedProducts((prev) => {
        const newSelectedProducts = new Set(prev);
        if (prev.has(productId)) {
          newSelectedProducts.delete(productId);
          setSelectedVariants((prevVariants) => {
            const newSelectedVariants = new Set(prevVariants);
            const variantsToRemove =
              products
                .find((p) => p.id === productId)
                ?.variants.map((v) => v.id) || [];
            variantsToRemove.forEach((id) => newSelectedVariants.delete(id));
            return newSelectedVariants;
          });
        } else {
          newSelectedProducts.add(productId);
        }
        return newSelectedProducts;
      });
    },
    [products]
  );

  const handleVariantSelect = useCallback(
    (variantId: number, productId: number) => {
      setSelectedVariants((prev) => {
        const newSelectedVariants = new Set(prev);
        if (prev.has(variantId)) {
          newSelectedVariants.delete(variantId);
          const productVariants =
            products.find((p) => p.id === productId)?.variants || [];
          const hasSelectedVariants = productVariants.some((v) =>
            newSelectedVariants.has(v.id)
          );
          if (!hasSelectedVariants) {
            setSelectedProducts((prevProducts) => {
              const newSelectedProducts = new Set(prevProducts);
              newSelectedProducts.delete(productId);
              return newSelectedProducts;
            });
          }
        } else {
          newSelectedVariants.add(variantId);
          setSelectedProducts((prevProducts) =>
            new Set(prevProducts).add(productId)
          );
        }
        return newSelectedVariants;
      });
    },
    [products]
  );

  const handleAdd = useCallback(() => {
    const selectedProductsData = products
      .filter((product) => selectedProducts.has(product.id))
      .map((product) => ({
        ...product,
        variants: product.variants.filter((variant) =>
          selectedVariants.has(variant.id)
        ),
      }));

    onProductsSelected(selectedProductsData);
  }, [products, selectedProducts, selectedVariants, onProductsSelected]);

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
                    <X color="#000000" size={15} />
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

          <div
            id="scrollableDiv"
            className="max-h-[400px] overflow-y-auto"
            style={{
              willChange: "transform",
              transform: "translateZ(0)",
            }}
          >
            <InfiniteScroll
              dataLength={products.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              }
              scrollableTarget="scrollableDiv"
              endMessage={
                <div className="text-center py-4 text-gray-500">
                  No more products to load
                </div>
              }
            >
              <div className="space-y-4">
                {error ? (
                  <div className="text-red-500 text-center py-4">{error}</div>
                ) : (
                  products.map((product) => (
                    <ProductItem
                      key={product.id}
                      product={product}
                      isSelected={selectedProducts.has(product.id)}
                      selectedVariants={selectedVariants}
                      onProductSelect={handleProductSelect}
                      onVariantSelect={handleVariantSelect}
                    />
                  ))
                )}
              </div>
            </InfiniteScroll>
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
