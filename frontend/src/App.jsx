import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import { Toaster, toast } from "react-hot-toast";
import SellerProducts from "./pages/SellerProducts";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/login";
import Register from "./pages/Register";

function AppContent() {

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const addToCart = (product, quantity = 1) => {

    setCart((previousCart) => {

      const existing = previousCart.find(
        item => item.id === product.id
      );

      if (existing) {

        return previousCart.map(item =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity
              }
            : item
        );

      }

      return [
        ...previousCart,
        { ...product, quantity }
      ];

    });

    toast.success("Product added to cart");
  };

  const updateQuantity = (productId, quantity) => {

    if (quantity < 1) return;

    setCart(previous =>
      previous.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );

  };

  const removeFromCart = (productId) => {

    setCart(previous =>
      previous.filter(item => item.id !== productId)
    );

    toast.success("Product removed from cart");
  };

  const toggleWishlist = (product) => {

    setWishlist(previous => {

      const exists = previous.some(
        item => item.id === product.id
      );

      if (exists) {
        return previous.filter(
          item => item.id !== product.id
        );
      }

      return [...previous, product];

    });

  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const wishlistCount = wishlist.length;

  return (
    <>
      <Toaster position="top-right" />

      <Routes>

        <Route
          path="/"
          element={
            <Home
              cartCount={cartCount}
              wishlist={wishlist}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              cartCount={cartCount}
              wishlistCount={wishlistCount}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          }
        />

        <Route
          path="/wishlist"
          element={
            <Wishlist
              wishlist={wishlist}
              cartCount={cartCount}
              wishlistCount={wishlistCount}
              onToggleWishlist={toggleWishlist}
              onAddToCart={addToCart}
            />
          }
        />

        <Route
          path="/products/:id"
          element={
            <ProductDetails
              cartCount={cartCount}
              wishlist={wishlist}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
            />
          }
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route
  path="/seller/products"
  element={<SellerProducts />}
/>

        <Route
          path="*"
          element={
            <div className="p-20 text-center">
              <h1 className="text-3xl font-bold">
                404 - Page Not Found
              </h1>
              <a href="/" className="mt-5 inline-block text-violet-700">
                Go Home
              </a>
            </div>
          }
        />
        <Route
  path="/seller/dashboard"
  element={<SellerProducts />}
/>

<Route
  path="/seller/products"
  element={<SellerProducts />}
/>
<Route
  path="*"
  element={
    <div className="p-20 text-center">
      <h1 className="text-3xl font-bold">
        404 - Page Not Found
      </h1>

      <a href="/" className="mt-5 inline-block text-violet-700">
        Go Home
      </a>
    </div>
  }
/>

      </Routes>
    </>
  );
}

export default function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );

}