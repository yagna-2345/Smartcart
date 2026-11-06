import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import ProductSection from "../components/ProductSection";
import Footer from "../components/Footer";

import api, { formatProduct } from "../services/api";

import toast from "react-hot-toast";

export default function Home({
  cartCount,
  wishlist,
  onAddToCart,
  onToggleWishlist
}) {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Products");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data.categories);
      } catch (err) {
        console.error("Category loading failed:", err);
      }
    };

    fetchCategories();

  }, []);

  useEffect(() => {

    const fetchProducts = async () => {

      setLoading(true);
      setError("");

      try {

        const params = {};

        if (search.trim()) {
          params.search = search.trim();
        }

        if (category !== "All Products") {
          const selected = categories.find(
            item => item.name === category
          );

          if (selected) {
            params.category = selected.slug;
          }
        }

        const response = await api.get("/products", {
          params
        });

        setProducts(
          response.data.products.map(formatProduct)
        );

      } catch (err) {

        console.error("Product loading failed:", err);

        setError(
          err.response?.data?.message ||
          "Unable to load products. Please try again."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchProducts();

  }, [search, category, categories]);

  const handleAddToCart = (product) => {
    onAddToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = (product) => {

    const exists = wishlist.some(
      item => item.id === product.id
    );

    onToggleWishlist(product);

    toast.success(
      exists ? "Removed from wishlist" : "Added to wishlist"
    );

  };

  const handleCategory = (selected) => {
    setCategory(selected);

    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth"
    });
  };

  const visibleProducts = useMemo(() => products, [products]);

  return (
    <div className="min-h-screen bg-[#faf9ff]">

      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        search={search}
        setSearch={setSearch}
      />

      <main>

        <Hero />

        <Categories
          onSelect={handleCategory}
        />

        <section id="products" className="mx-auto max-w-7xl px-5 pb-20">

          {loading ? (

            <div className="py-20 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"/>
              <p className="mt-4 text-gray-500">
                Loading SmartCart products...
              </p>
            </div>

          ) : error ? (

            <div className="rounded-2xl bg-red-50 p-8 text-center text-red-600">
              {error}

              <button
                onClick={() => window.location.reload()}
                className="mt-4 block mx-auto rounded-lg bg-red-600 px-5 py-2 text-white"
              >
                Retry
              </button>
            </div>

          ) : (

            <ProductSection
              products={visibleProducts}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlist={wishlist}
              selectedCategory={category}
              onClearFilter={() => {
                setCategory("All Products");
                setSearch("");
              }}
            />

          )}

        </section>

      </main>

      <Footer />

    </div>
  );
}