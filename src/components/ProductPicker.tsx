import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, X } from "lucide-react";

interface ProductPIckerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductPicker: React.FC<ProductPIckerProps> = ({
  open,
  onOpenChange,
}) => {
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set()
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-xl font-semibold">
                Select Products
              </Dialog.Title>
              <Dialog.Close className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search product"
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    setSelectedProducts((prev) => {
                      const next = new Set(prev);
                      if (next.has(product.id)) {
                        next.delete(product.id);
                      } else {
                        next.add(product.id);
                      }
                      return next;
                    })
                  }
                >
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product.id)}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <img
                    src={product.image.src}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{product.title}</h3>
                    {product.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="flex items-center gap-4 mt-2"
                      >
                        <span className="text-sm text-gray-600">
                          {variant.title}
                        </span>
                        <span className="text-sm text-gray-500">
                          ${variant.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-6">
              <span className="text-sm text-gray-500">
                {selectedProducts.size} product
                {selectedProducts.size !== 1 ? "s" : ""} selected
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => onOpenChange(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                  Add
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ProductPicker;

const products = [
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
