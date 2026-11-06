import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Package, Store } from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  name: "",
  categoryId: "",
  description: "",
  brand: "",
  price: "",
  compareAtPrice: "",
  stock: "",
  sku: "",
  images: ""
};

export default function SellerProducts() {

  const { user, loading } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [productResponse, categoryResponse] = await Promise.all([
        api.get("/products/my-products"),
        api.get("/categories")
      ]);

      setProducts(productResponse.data.products);
      setCategories(categoryResponse.data.categories);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Unable to load seller products"
      );
    }
  };

  useEffect(() => {
    if (!loading && user?.role === "seller") {
      fetchData();
    }
  }, [loading, user]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice
          ? Number(form.compareAtPrice)
          : null,
        stock: Number(form.stock),
        images: form.images
          .split("\n")
          .map(image => image.trim())
          .filter(Boolean)
      };

      await api.post("/products", payload);

      toast.success("Product saved as draft");

      setForm(initialForm);

      await fetchData();

    } catch (error) {
      const errors = error.response?.data?.errors;

      toast.error(
        errors?.map(item => item.message).join(", ") ||
        error.response?.data?.message ||
        "Product creation failed"
      );

    } finally {
      setSaving(false);
    }
  };

  const publishProduct = async (id) => {
    try {
      await api.patch(`/products/${id}/publish`);

      toast.success("Product published successfully");

      await fetchData();

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Unable to publish product"
      );
    }
  };
  const publishAll = async () => {

  const drafts = products.filter(
    product => product.status === "draft"
  );

  if (drafts.length === 0) {
    toast.error("No draft products available");
    return;
  }

  const confirmed = window.confirm(
    `Publish all ${drafts.length} draft products?`
  );

  if (!confirmed) return;

  try {

    const response = await api.post(
      "/products/publish-all"
    );

    toast.success(response.data.message);

    await fetchData();

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Bulk publishing failed"
    );

  }
};

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);

      toast.success("Product deleted");

      await fetchData();

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Unable to delete product"
      );
    }
  };

  if (loading) {
    return <div className="p-20 text-center">Loading account...</div>;
  }

  if (!user || user.role !== "seller") {
    return (
      <div className="p-20 text-center">
        <h1 className="text-2xl font-bold">Seller access required</h1>
        <Link to="/" className="mt-4 inline-block text-violet-700">
          Return home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9ff]">

      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-10">

        <div className="mb-9">
          <p className="flex items-center gap-2 font-semibold text-violet-700">
            <Store size={18}/> Seller workspace
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Product Management
          </h1>

          <p className="mt-2 text-gray-500">
            Create and manage your SmartCart product listings.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          <section className="h-fit rounded-3xl bg-white p-6 shadow-sm lg:col-span-1">

            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
              <Plus className="text-violet-600"/>
              Add New Product
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                name="name"
                placeholder="Product name"
                value={form.name}
                onChange={handleChange}
                required
                minLength={3}
                className="w-full rounded-xl border p-3 outline-violet-500"
              />

              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="w-full rounded-xl border bg-white p-3"
              >
                <option value="">Select category</option>

                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <textarea
                name="description"
                placeholder="Product description"
                value={form.description}
                onChange={handleChange}
                required
                minLength={10}
                rows={4}
                className="w-full rounded-xl border p-3 outline-violet-500"
              />

              <input
                name="brand"
                placeholder="Brand"
                value={form.brand}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />

              <div className="grid grid-cols-2 gap-3">

                <input
                  name="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Price (₹)"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border p-3"
                />

                <input
                  name="compareAtPrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Old price (₹)"
                  value={form.compareAtPrice}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                />

              </div>

              <div className="grid grid-cols-2 gap-3">

                <input
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border p-3"
                />

                <input
                  name="sku"
                  placeholder="SKU"
                  value={form.sku}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border p-3"
                />

              </div>

              <textarea
                name="images"
                placeholder={"Product image URLs (one per line)\nhttps://example.com/image.jpg"}
                value={form.images}
                onChange={handleChange}
                required
                rows={3}
                className="w-full rounded-xl border p-3"
              />

              <button
                disabled={saving}
                className="w-full rounded-xl bg-violet-600 py-3 font-bold text-white hover:bg-violet-800 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Product as Draft"}
              </button>

            </form>

          </section>

          <section className="lg:col-span-2">

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

  <h2 className="text-xl font-bold">
    My Products ({products.length})
  </h2>

  <div className="flex flex-wrap items-center gap-3">

    <button
      onClick={publishAll}
      disabled={!products.some(p => p.status === "draft")}
      className="rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Publish All Drafts
    </button>

    <Package className="text-violet-600"/>

  </div>

</div>

            <div className="space-y-4">

              {products.map(product => (

                <div
                  key={product._id}
                  className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                >

                  <img
                    src={product.images?.[0] || "https://placehold.co/120"}
                    alt={product.name}
                    className="h-24 w-24 rounded-xl object-cover"
                  />

                  <div className="flex-1">

                    <h3 className="font-bold">{product.name}</h3>

                    <p className="mt-1 text-sm text-gray-500">
                      SKU: {product.sku}
                    </p>

                    <p className="mt-1 font-bold text-violet-700">
                      ₹{(product.pricePaise / 100).toLocaleString("en-IN")}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Stock: {product.stock}
                    </p>

                    <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                      product.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {product.status}
                    </span>

                  </div>

                  <div className="flex gap-2">

                    {product.status === "draft" && (
                      <button
                        onClick={() => publishProduct(product._id)}
                        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white"
                      >
                        Publish
                      </button>
                    )}

                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="rounded-lg border border-red-200 p-3 text-red-500"
                      aria-label="Delete product"
                    >
                      <Trash2 size={18}/>
                    </button>

                  </div>

                </div>

              ))}

              {products.length === 0 && (
                <div className="rounded-2xl bg-white p-12 text-center text-gray-500">
                  No products yet. Add your first product.
                </div>
              )}

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}