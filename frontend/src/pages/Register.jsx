import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Mail, Lock, Store, Phone } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

export default function Register() {

  const navigate = useNavigate();

  const { register } = useAuth();

  const [role, setRole] = useState("customer");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    storeName: ""
  });

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

      const data = { ...form };

      if (role === "customer") {
        delete data.storeName;
      }

      const result = await register(data, role);

      if (role === "seller") {

        toast.success(
          "Seller application submitted. Await admin approval."
        );

        navigate("/");

      } else {

        toast.success("Account created successfully!");

        navigate("/");

      }

    } catch (error) {

      const validationErrors = error.response?.data?.errors;

      toast.error(
        validationErrors?.map(item => item.message).join(", ") ||
        error.response?.data?.message ||
        "Registration failed"
      );

    } finally {

      setSubmitting(false);

    }

  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-100 via-white to-indigo-100 px-5 py-10">

      <div className="w-full max-w-lg rounded-3xl border border-white bg-white/85 p-8 shadow-2xl backdrop-blur-xl">

        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-3xl font-black text-violet-700"
        >
          <ShoppingBag size={30}/>
          SmartCart.
        </Link>

        <h1 className="mt-7 text-center text-3xl font-black">
          Create Account
        </h1>

        <p className="mt-2 text-center text-sm text-gray-500">
          Join the SmartCart marketplace.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3">

          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`rounded-xl border p-4 font-semibold ${
              role === "customer"
                ? "border-violet-600 bg-violet-50 text-violet-700"
                : "border-gray-200"
            }`}
          >
            Customer
          </button>

          <button
            type="button"
            onClick={() => setRole("seller")}
            className={`rounded-xl border p-4 font-semibold ${
              role === "seller"
                ? "border-violet-600 bg-violet-50 text-violet-700"
                : "border-gray-200"
            }`}
          >
            Seller
          </button>

        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">

          <div className="flex items-center rounded-xl border px-4">
            <User size={18} className="text-gray-400"/>

            <input
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-4 outline-none"
            />
          </div>

          <div className="flex items-center rounded-xl border px-4">
            <Mail size={18} className="text-gray-400"/>

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-4 outline-none"
            />
          </div>

          <div className="flex items-center rounded-xl border px-4">
            <Phone size={18} className="text-gray-400"/>

            <input
              name="phone"
              placeholder="10-digit phone number"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-4 outline-none"
            />
          </div>

          {role === "seller" && (

            <div className="flex items-center rounded-xl border px-4">
              <Store size={18} className="text-gray-400"/>

              <input
                name="storeName"
                placeholder="Store name"
                value={form.storeName}
                onChange={handleChange}
                required
                className="w-full p-4 outline-none"
              />
            </div>

          )}

          <div className="flex items-center rounded-xl border px-4">
            <Lock size={18} className="text-gray-400"/>

            <input
              type="password"
              name="password"
              placeholder="Password (minimum 8 characters)"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              maxLength={72}
              required
              autoComplete="new-password"
              className="w-full p-4 outline-none"
            />
          </div>

          {role === "seller" && (
            <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
              Your seller account must be approved by an administrator before you can publish products.
            </p>
          )}

          <button
            disabled={submitting}
            className="w-full rounded-xl bg-violet-600 py-4 font-bold text-white hover:bg-violet-800 disabled:opacity-50"
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?

          <Link
            to="/login"
            className="ml-2 font-bold text-violet-700"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );

}