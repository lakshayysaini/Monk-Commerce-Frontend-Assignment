import { useState } from "react";
import { SelectedProductList } from "./components/SelectedProductsList";
import { ProductWithDiscount } from "./types/interfaces";

const EMPTY_PRODUCT: ProductWithDiscount = {
  id: 0,
  title: "Select Product",
  variants: [],
  image: {
    id: 0,
    product_id: 0,
    src: "",
  },
};

function App() {
  const [products, setProducts] = useState<ProductWithDiscount[]>([
    EMPTY_PRODUCT,
  ]);

  const handleAddProduct = () => {
    setProducts([...products, EMPTY_PRODUCT]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Add Products</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-2 gap-8 w-full">
              <div className="font-medium text-gray-600">Product</div>
              <div className="font-medium text-gray-600">Discount</div>
            </div>
          </div>
          <SelectedProductList
            products={products}
            onProductsChange={setProducts}
          />
          <button
            onClick={handleAddProduct}
            className="w-full py-2 border rounded-md hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <span>+</span>
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
