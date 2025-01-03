import { useState } from "react";
import { ProductWithDiscount } from "../types/interfaces";
import { ProductPicker } from "./ProductPicker";
import { DraggableItem } from "./DraggableItem";
import { PencilIcon, X } from "lucide-react";
interface ProductListProps {
  products: ProductWithDiscount[];
  onProductsChange: (products: ProductWithDiscount[]) => void;
}

export function SelectedProductList({
  products,
  onProductsChange,
}: ProductListProps) {
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(
    null
  );
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [draggedVariantInfo, setDraggedVariantInfo] = useState<{
    productIndex: number;
    variantIndex: number;
  } | null>(null);

  const [discountedProducts, setDiscountedProducts] = useState<
    Record<number, boolean>
  >({});
  const [discountedVariants, setDiscountedVariants] = useState<
    Record<string, boolean>
  >({});

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleVariantDragStart = (
    e: React.DragEvent,
    productIndex: number,
    variantIndex: number
  ) => {
    setDraggedVariantInfo({ productIndex, variantIndex });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newProducts = [...products];
    const draggedProduct = newProducts[draggedItemIndex];
    newProducts.splice(draggedItemIndex, 1);
    newProducts.splice(index, 0, draggedProduct);

    onProductsChange(newProducts);
    setDraggedItemIndex(index);
  };

  const handleVariantDragOver = (
    e: React.DragEvent,
    productIndex: number,
    variantIndex: number
  ) => {
    e.preventDefault();
    if (
      !draggedVariantInfo ||
      (draggedVariantInfo.productIndex === productIndex &&
        draggedVariantInfo.variantIndex === variantIndex)
    )
      return;

    const newProducts = [...products];
    const sourceProduct = newProducts[draggedVariantInfo.productIndex];
    const draggedVariant =
      sourceProduct.variants[draggedVariantInfo.variantIndex];

    sourceProduct.variants.splice(draggedVariantInfo.variantIndex, 1);
    const targetProduct = newProducts[productIndex];
    targetProduct.variants.splice(variantIndex, 0, draggedVariant);

    onProductsChange(newProducts);
    setDraggedVariantInfo({ productIndex, variantIndex });
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDraggedVariantInfo(null);
  };

  const handleRemoveProduct = (index: number) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    onProductsChange(newProducts);
  };

  const handleRemoveVariant = (productIndex: number, variantIndex: number) => {
    const newProducts = [...products];
    const targetProduct = newProducts[productIndex];

    if (targetProduct.variants.length > 1) {
      targetProduct.variants.splice(variantIndex, 1);
    } else {
      newProducts.splice(productIndex, 1);
    }

    onProductsChange(newProducts);
  };

  const toggleVariants = (index: number) => {
    const newProducts = [...products];
    newProducts[index] = {
      ...newProducts[index],
      showVariants: !newProducts[index].showVariants,
    };
    onProductsChange(newProducts);
  };

  const handleProductsSelected = (
    selectedProducts: ProductWithDiscount[],
    index: number
  ) => {
    const newProducts = [...products];
    newProducts.splice(index, 1, ...selectedProducts);
    onProductsChange(newProducts);
    setEditingProductIndex(null);
  };

  return (
    <div className="space-y-4">
      {products.map((product, index) => (
        <DraggableItem
          key={`${product.id}-${index}`}
          id={`product-${product.id}`}
          index={index}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-sm">
              <button className="text-gray-400 hover:text-gray-600">⋮⋮</button>
              <span className="text-sm text-gray-500">{index + 1}.</span>
              <div className="flex-1">
                <div className="font-medium">{product.title}</div>
              </div>
              <button
                onClick={() => setEditingProductIndex(index)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <PencilIcon color="#000000" size={15} />
              </button>
              <div className="flex items-center gap-2">
                {discountedProducts[index] ? (
                  <>
                    <input
                      type="number"
                      defaultValue={product.discount?.value || ""}
                      className="w-20 px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      defaultValue={product.discount?.type || "percentage"}
                      className="w-24 px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="percentage">% Off</option>
                      <option value="flat">Flat</option>
                    </select>
                  </>
                ) : (
                  <button
                    onClick={() =>
                      setDiscountedProducts({
                        ...discountedProducts,
                        [index]: true,
                      })
                    }
                    className="px-3 py-1 bg-[#008060] text-white rounded-md"
                  >
                    Add Discount
                  </button>
                )}

                {products.length > 1 && (
                  <button
                    onClick={() => handleRemoveProduct(index)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <X color="#000000" size={15} />
                  </button>
                )}
              </div>
            </div>

            {product.variants.length > 1 && (
              <div className="flex justify-end">
                <button
                  onClick={() => toggleVariants(index)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {product.showVariants ? "Hide variants" : "Show variants"}
                </button>
              </div>
            )}

            {product.showVariants &&
              product.variants.map((variant, variantIndex) => (
                <DraggableItem
                  key={variant.id}
                  id={`variant-${variant.id}`}
                  index={variantIndex}
                  onDragStart={(e) =>
                    handleVariantDragStart(e, index, variantIndex)
                  }
                  onDragOver={(e) =>
                    handleVariantDragOver(e, index, variantIndex)
                  }
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg ml-8">
                    <button className="text-gray-400 hover:text-gray-600">
                      ⋮⋮
                    </button>
                    <div className="flex-1">
                      <div className="font-medium">{variant.title}</div>
                      <div className="text-sm text-gray-500">
                        ${variant.price}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {discountedVariants[`${index}-${variantIndex}`] ? (
                        <>
                          <input
                            type="number"
                            defaultValue={variant.discount?.value || ""}
                            className="w-20 px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <select
                            defaultValue={
                              variant.discount?.type || "percentage"
                            }
                            className="w-24 px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="percentage">% Off</option>
                            <option value="flat">Flat</option>
                          </select>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            setDiscountedVariants({
                              ...discountedVariants,
                              [`${index}-${variantIndex}`]: true,
                            })
                          }
                          className="px-3 py-1 bg-[#008060] text-white rounded-md"
                        >
                          Add Discount
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveVariant(index, variantIndex)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <X color="#000000" size={15} />
                    </button>
                  </div>
                </DraggableItem>
              ))}
          </div>
        </DraggableItem>
      ))}

      {editingProductIndex !== null && (
        <ProductPicker
          onProductsSelected={(products) =>
            handleProductsSelected(products, editingProductIndex)
          }
          onClose={() => setEditingProductIndex(null)}
        />
      )}
    </div>
  );
}
