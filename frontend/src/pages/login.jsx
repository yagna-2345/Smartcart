import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, LockKeyhole, Mail } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

export default function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSubmitting(true);

    try {

      const result = await login(
        form.email,
        form.password
      );

      toast.success("Welcome to SmartCart!");

      if (result.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (result.user.role === "seller") {
        navigate("/seller/dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setSubmitting(false);

    }

  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-100 via-white to-indigo-100 px-5 py-10">

      <div className="w-full max-w-md rounded-3xl border border-white bg-white/80 p-8 shadow-2xl backdrop-blur-xl md:p-10">

        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-3xl font-black text-violet-700"
        >
          <ShoppingBag size={30}/>
          SmartCart.
        </Link>

        <h1 className="mt-9 text-center text-3xl font-black text-gray-900">
          Welcome Back
        </h1>

        <p className="mt-3 text-center text-sm text-gray-500">
          Login to continue shopping.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Email Address
            </label>

            <div className="flex items-center rounded-xl border bg-white px-4">
              <Mail size={18} className="text-gray-400"/>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                autoComplete="email"
                className="w-full p-4 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Password
            </label>

            <div className="flex items-center rounded-xl border bg-white px-4">
              <LockKeyhole size={18} className="text-gray-400"/>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full p-4 outline-none"
              />
            </div>
          </div>

          <button
            disabled={submitting}
            className="w-full rounded-xl bg-violet-600 py-4 font-bold text-white transition hover:bg-violet-800 disabled:opacity-50"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="mt-7 text-center text-sm text-gray-500">
          Don't have an account?

          <Link
            to="/register"
            className="ml-2 font-bold text-violet-700"
          >
            Register
          </Link>
        </p>

        <Link
          to="/"
          className="mt-6 block text-center text-sm text-gray-500 hover:text-violet-700"
        >
          Back to shopping
        </Link>

      </div>

    </div>
  );

}