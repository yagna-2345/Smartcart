import { Link } from "react-router-dom";

import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowLeft
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Cart({
  cart,
  cartCount,
  wishlistCount,
  onUpdateQuantity,
  onRemove
}) {

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 50;

  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#faf9ff]">

      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />

      <main className="mx-auto max-w-7xl px-5 py-12">

        <div className="mb-10">
          <p className="font-bold uppercase tracking-widest text-violet-600">
            Your shopping
          </p>

          <h1 className="mt-2 text-4xl font-black text-gray-900">
            Shopping Cart
          </h1>
        </div>

        {cart.length === 0 ? (

          <div className="rounded-3xl bg-white px-6 py-20 text-center shadow-sm">

            <ShoppingBag
              size={65}
              className="mx-auto text-violet-300"
            />

            <h2 className="mt-6 text-2xl font-bold">
              Your cart is empty
            </h2>

            <p className="mt-3 text-gray-500">
              Discover amazing products and start shopping.
            </p>

            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-3 font-bold text-white hover:bg-violet-800"
            >
              <ArrowLeft size={18}/>
              Continue Shopping
            </Link>

          </div>

        ) : (

          <div className="grid gap-8 lg:grid-cols-3">

            <div className="space-y-4 lg:col-span-2">

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                >

                  <Link to={`/products/${item.id}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-28 w-full rounded-xl object-cover sm:w-28"
                    />
                  </Link>

                  <div className="flex-1">

                    <Link
                      to={`/products/${item.id}`}
                      className="font-bold text-gray-900 hover:text-violet-700"
                    >
                      {item.name}
                    </Link>

                    <p className="mt-2 font-bold text-violet-700">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>

                    <div className="mt-4 flex items-center gap-3">

                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="rounded-lg border p-2"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={15}/>
                      </button>

                      <span className="font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="rounded-lg border p-2"
                        aria-label="Increase quantity"
                      >
                        <Plus size={15}/>
                      </button>

                    </div>

                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">

                    <p className="font-black text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>

                    <button
                      onClick={() => onRemove(item.id)}
                      className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={17}/>
                      Remove
                    </button>

                  </div>

                </div>

              ))}

            </div>

            <div className="h-fit rounded-3xl bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                Order Summary
              </h2>

              <div className="mt-7 space-y-4 text-sm">

                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-bold">
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>

                <div className="border-t pt-5">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-black text-violet-700">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

              </div>

              <Link
                to="/checkout"
                className="mt-8 block rounded-xl bg-violet-600 py-4 text-center font-bold text-white hover:bg-violet-800"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/"
                className="mt-4 block text-center text-sm font-semibold text-gray-500 hover:text-violet-700"
              >
                Continue Shopping
              </Link>

            </div>

          </div>

        )}

      </main>

      <Footer />

    </div>
  );
}