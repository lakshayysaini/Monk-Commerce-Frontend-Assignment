import axios from "axios";
import { Product } from "../types/interfaces";
import { API_BASE_URL } from "../constants/constants";

const FetchProducts = async (
  search: string,
  page: number,
  limit: number,
  apiKey: string
): Promise<{
  products: Product[];
  hasMore: boolean;
}> => {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: { search, page, limit },
      headers: { "x-api-key": apiKey },
    });

    const products = response.data;
    const hasMore = products.length === limit;

    return { products, hasMore };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export default FetchProducts;