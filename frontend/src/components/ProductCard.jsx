import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

      <div className="relative overflow-hidden bg-gray-50">

        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/600x500/f3e8ff/6d28d9?text=SmartCart";
            }}
            className="h-56 w-full cursor-pointer object-cover transition duration-500 group-hover:scale-110"
          />
        </Link>

        <span className="absolute left-3 top-3 rounded-full bg-violet-600 px-3 py-1 text-[10px] font-bold text-white">
          {product.badge}
        </span>

        <button
          onClick={() => onToggleWishlist(product)}
          aria-label="Toggle wishlist"
          className={`absolute right-3 top-3 rounded-full bg-white p-2 shadow transition hover:scale-110 ${
            isWishlisted ? "text-red-500" : "text-gray-600"
          }`}
        >
          <Heart
            size={19}
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

      </div>

      <div className="p-5">

        <p className="text-xs font-semibold text-violet-600">
          {product.category}
        </p>

        <Link to={`/products/${product.id}`}>
          <h3 className="mt-2 min-h-12 font-bold text-gray-900 hover:text-violet-700">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1 text-sm">

          <Star
            size={15}
            className="fill-amber-400 text-amber-400"
          />

          <span className="font-semibold">{product.rating}</span>

          <span className="text-gray-400">
            ({product.reviews} reviews)
          </span>

        </div>

        <div className="mt-4">

          <span className="text-xl font-black text-gray-900">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          <span className="ml-2 text-xs text-gray-400 line-through">
            ₹{product.oldPrice.toLocaleString("en-IN")}
          </span>

        </div>

        <button
          onClick={() => onAddToCart(product)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-bold text-white transition hover:bg-violet-800"
        >
          <ShoppingCart size={17} />
          Add to Cart
        </button>

      </div>

    </div>
  );
}