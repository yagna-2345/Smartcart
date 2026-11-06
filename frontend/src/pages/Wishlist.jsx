import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Wishlist({
  wishlist,
  cartCount,
  wishlistCount,
  onToggleWishlist,
  onAddToCart
}) {

  return (
    <div className="min-h-screen bg-[#faf9ff]">

      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />

      <main className="mx-auto max-w-7xl px-5 py-12">

        <p className="font-bold uppercase tracking-widest text-violet-600">
          Your favourites
        </p>

        <h1 className="mt-2 text-4xl font-black text-gray-900">
          My Wishlist
        </h1>

        <p className="mt-3 text-gray-500">
          {wishlist.length} products saved in your wishlist.
        </p>

        {wishlist.length === 0 ? (

          <div className="mt-12 rounded-3xl bg-white px-6 py-20 text-center shadow-sm">

            <Heart
              size={65}
              className="mx-auto text-red-300"
            />

            <h2 className="mt-6 text-2xl font-bold">
              Your wishlist is empty
            </h2>

            <p className="mt-3 text-gray-500">
              Save your favourite products to find them here.
            </p>

            <Link
              to="/"
              className="mt-8 inline-block rounded-xl bg-violet-600 px-7 py-3 font-bold text-white hover:bg-violet-800"
            >
              Explore Products
            </Link>

          </div>

        ) : (

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {wishlist.map((product) => (

              <div
                key={product.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >

                <Link to={`/products/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-56 w-full object-cover"
                  />
                </Link>

                <div className="p-5">

                  <p className="text-xs font-semibold text-violet-600">
                    {product.category}
                  </p>

                  <Link to={`/products/${product.id}`}>
                    <h3 className="mt-2 font-bold hover:text-violet-700">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="mt-3 text-xl font-black text-violet-700">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>

                  <button
                    onClick={() => onAddToCart(product)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-bold text-white hover:bg-violet-800"
                  >
                    <ShoppingCart size={17}/>
                    Add to Cart
                  </button>

                  <button
                    onClick={() => onToggleWishlist(product)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={16}/>
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

      <Footer />

    </div>
  );
}