import { useState } from "react";
import { Product, ProductWithDiscount } from "../types/interfaces";

interface ProductPickerProps {
  onProductsSelected: (products: ProductWithDiscount[]) => void;
  onClose: () => void;
}

export function ProductPicker({
  onProductsSelected,
  onClose,
}: ProductPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set()
  );
  const [selectedVariants, setSelectedVariants] = useState<Set<number>>(
    new Set()
  );

  const filteredProducts = SAMPLE_PRODUCTS.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductSelect = (productId: number) => {
    const newSelectedProducts = new Set(selectedProducts);
    if (selectedProducts.has(productId)) {
      newSelectedProducts.delete(productId);
      const variantsToRemove =
        SAMPLE_PRODUCTS.find((p) => p.id === productId)?.variants.map(
          (v) => v.id
        ) || [];
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
        SAMPLE_PRODUCTS.find((p) => p.id === productId)?.variants || [];
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
    const selectedProductsData = SAMPLE_PRODUCTS.filter((product) =>
      selectedProducts.has(product.id)
    ).map((product) => ({
      ...product,
      variants: product.variants.filter((variant) =>
        selectedVariants.has(variant.id)
      ),
    }));

    onProductsSelected(selectedProductsData);
  };

  if (!SAMPLE_PRODUCTS) return null;

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

          <div className="max-h-[400px] overflow-y-auto space-y-4">
            {filteredProducts.map((product) => (
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
                      <div key={variant.id} className="flex items-center gap-3">
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
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 77,
    title: "Fog Linen Chambray Towel - Beige Stripe",
    variants: [
      {
        id: 1,
        product_id: 77,
        title: "XS / Silver",
        price: "49",
      },
      {
        id: 2,
        product_id: 77,
        title: "S / Silver",
        price: "49",
      },
      {
        id: 3,
        product_id: 77,
        title: "M / Silver",
        price: "49",
      },
    ],
    image: {
      id: 266,
      product_id: 77,
      src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/77/images/266/foglinenbeigestripetowel1b.1647248662.386.513.jpg?c=1",
    },
  },
  {
    id: 80,
    title: "Orbit Terrarium - Large",
    variants: [
      {
        id: 64,
        product_id: 80,
        title: "Default Title",
        price: "109",
      },
    ],
    image: {
      id: 272,
      product_id: 80,
      src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/80/images/272/roundterrariumlarge.1647248662.386.513.jpg?c=1",
    },
  },
];
