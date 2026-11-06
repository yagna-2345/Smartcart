import {
  ShoppingCart,
  Search,
  Heart,
  UserRound,
  Menu,
  X,
  LogOut
} from "lucide-react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar({
  cartCount = 0,
  wishlistCount = 0,
  search = "",
  setSearch = () => {}
}) {

  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout, loading } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/95 backdrop-blur-xl">

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-black text-violet-700">
          Smart<span className="text-gray-900">Cart.</span>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden items-center gap-7 text-sm font-semibold text-gray-600 md:flex">
          <Link to="/">Home</Link>
          <a href="/#categories">Categories</a>
          <a href="/#products">Products</a>
        </nav>

        {/* SEARCH */}
        <div className="hidden max-w-sm flex-1 items-center rounded-full border border-violet-100 bg-violet-50 px-4 py-2 md:flex">
          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent px-3 text-sm outline-none"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* WISHLIST */}
          <Link to="/wishlist" className="relative text-gray-600 hover:text-red-500">
            <Heart size={22}/>

            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-1.5 text-xs text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* CART */}
          <Link to="/cart" className="relative text-gray-600 hover:text-violet-700">
            <ShoppingCart size={23}/>

            <span className="absolute -right-2 -top-2 rounded-full bg-violet-600 px-1.5 text-xs text-white">
              {cartCount}
            </span>
          </Link>

          {/* USER ACCOUNT */}
          {!loading && (
            user ? (

              <div className="hidden items-center gap-3 md:flex">

                <div className="flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white">
                    <UserRound size={19}/>
                  </div>

                  <div>
                    <p className="max-w-32 truncate text-sm font-bold text-gray-900">
                      {user.name}
                    </p>

                    <p className="text-xs capitalize text-violet-700">
                      {user.role}
                    </p>
                  </div>

                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-700"
                >
                  <LogOut size={18}/>
                  Logout
                </button>

              </div>

            ) : (

              <Link
                to="/login"
                className="hidden items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-800 sm:flex"
              >
                <UserRound size={18}/>
                Login
              </Link>

            )
          )}
    
          {/* MOBILE MENU */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X/> : <Menu/>}
          </button>

        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      {menuOpen && (
        <div className="flex flex-col gap-4 border-t bg-white px-6 py-5 md:hidden">

          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          {user ? (
            <>
              <div className="rounded-xl bg-violet-50 p-4">
                <p className="font-bold text-gray-900">
                  {user.name}
                </p>

                <p className="text-sm text-gray-600">
                  {user.email}
                </p>

                <p className="mt-1 text-xs capitalize text-violet-700">
                  {user.role}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500"
              >
                <LogOut size={18}/>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">
              Login
            </Link>
          )}

          <Link to="/wishlist">
            Wishlist ({wishlistCount})
          </Link>

          <Link to="/cart">
            Cart ({cartCount})
          </Link>

        </div>
      )}

    </header>
  );
}