import axios from "axios";
import { Product } from "../types/interfaces";

const API_URL = "https://stageapi.monkcommerce.app/task/products/search";

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
    const response = await axios.get(API_URL, {
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