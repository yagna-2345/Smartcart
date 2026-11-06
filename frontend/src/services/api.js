import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export const formatProduct = (product) => {
  return {
    id: product._id,
    name: product.name,
    category: product.categoryId?.name || "General",
    categoryId: product.categoryId?._id || product.categoryId,
    price: product.pricePaise / 100,
    oldPrice: product.compareAtPricePaise
      ? product.compareAtPricePaise / 100
      : product.pricePaise / 100,
    rating: product.rating || 0,
    reviews: product.reviewCount || 0,
    image: product.images?.[0] || "",
    images: product.images || [],
    description: product.description || "",
    stock: product.stock,
    sku: product.sku,
    brand: product.brand
  };
};

export default api;