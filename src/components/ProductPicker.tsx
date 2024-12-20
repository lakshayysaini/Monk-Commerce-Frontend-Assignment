import * as Dialog from "@radix-ui/react-dialog";
import { Search, X } from "lucide-react";
import React from "react";

interface ProductPIckerProps {
  open: boolean;
  onClose: any;
}

const ProductPicker: React.FC<ProductPIckerProps> = ({ open, onClose }) => {
  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
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
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ProductPicker;
