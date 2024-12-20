import { Plus } from "lucide-react";
import "./App.css";
import ProductPicker from "./components/ProductPicker";
import { useState } from "react";

function App() {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleEditProduct = () => {
    setPickerOpen(true);
  };

  return (
    <>
      <ProductPicker open={pickerOpen} onOpenChange={setPickerOpen} />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Add Products</h1>
        <div className="space-y-4">
          <button
            onClick={handleEditProduct}
            className="w-full flex items-center justify-center px-4 py-2 border-2 border-emerald-500 text-emerald-500 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
