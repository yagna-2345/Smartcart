import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  ShoppingCart,
  Heart,
  Star,
  ArrowLeft
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import api, { formatProduct } from "../services/api";

export default function ProductDetails({
  cartCount,
  wishlist,
  onAddToCart,
  onToggleWishlist
}) {

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const response = await api.get(`/products/${id}`);

        setProduct(formatProduct(response.data.product));

      } catch (err) {

        setError(
          err.response?.data?.message ||
          "Unable to load product"
        );

      } finally {

        setLoading(false);

      }

    };

    fetchProduct();

  }, [id]);

  const isWishlisted = wishlist.some(
    item => item.id === product?.id
  );

  if (loading) {
    return (
      <div className="p-20 text-center">
        Loading product information...
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold">
          {error || "Product not found"}
        </h2>

        <Link to="/" className="mt-5 inline-block text-violet-700">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9ff]">

      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlist.length}
      />

      <main className="mx-auto max-w-7xl px-5 py-10">

        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-violet-700">
          <ArrowLeft size={18}/>
          Continue Shopping
        </Link>

        <div className="grid gap-12 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">

          <div className="space-y-3">

            <img
              src={product.image}
              alt={product.name}
              className="h-[450px] w-full rounded-3xl bg-gray-50 object-contain"
            />

            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="h-20 w-full rounded-xl border object-cover"
                />
              ))}
            </div>

          </div>

          <div className="flex flex-col justify-center">

            <p className="font-bold text-violet-600">
              {product.category}
            </p>

            <h1 className="mt-3 text-3xl font-black md:text-4xl">
              {product.name}
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              Brand: {product.brand || "Unbranded"}
            </p>

            <div className="mt-5 flex items-center gap-2">
              <Star className="fill-amber-400 text-amber-400"/>
              <span className="font-bold">{product.rating}</span>
              <span className="text-gray-500">
                ({product.reviews} reviews)
              </span>
            </div>

            <div className="mt-7 text-3xl font-black text-violet-700">
              ₹{product.price.toLocaleString("en-IN")}
            </div>

            {product.oldPrice > product.price && (
              <p className="mt-2 text-sm text-gray-400 line-through">
                ₹{product.oldPrice.toLocaleString("en-IN")}
              </p>
            )}

            <p className="mt-6 leading-8 text-gray-600">
              {product.description}
            </p>

            <p className={`mt-5 font-semibold ${
              product.stock > 0 ? "text-green-600" : "text-red-500"
            }`}>
              {product.stock > 0
                ? `${product.stock} units available`
                : "Out of stock"}
            </p>

            <div className="mt-7 flex items-center gap-4">

              <div className="flex items-center rounded-xl border">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-3"
                >
                  −
                </button>

                <span className="px-3 font-bold">{quantity}</span>

                <button
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="px-4 py-3 disabled:opacity-30"
                >
                  +
                </button>
              </div>

              <button
                disabled={product.stock === 0}
                onClick={() => onAddToCart(product, quantity)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <ShoppingCart size={18}/>
                Add to Cart
              </button>

            </div>

            <button
              onClick={() => onToggleWishlist(product)}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl border py-4 font-semibold"
            >
              <Heart
                size={19}
                fill={isWishlisted ? "currentColor" : "none"}
                className={isWishlisted ? "text-red-500" : ""}
              />

              {isWishlisted
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </button>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}