export interface Product {
  id: number;
  title: string;
  variants: Variant[];
  image: {
    id: number;
    product_id: number;
    src: string;
  };
}

export interface Variant {
  discount?: {
    value: number;
    type: "percentage" | "flat";
  };
  id: number;
  product_id: number;
  title: string;
  price: string;
}

export interface ProductWithDiscount extends Product {
  discount?: {
    value: number;
    type: "percentage" | "flat";
  };
  showVariants?: boolean;
}
