import ProductCard from "./ProductCard";
import { ArrowRight } from "lucide-react";

export default function ProductSection({
  products,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  onClearFilter,
  selectedCategory
}) {
  return (
    <section
      id="products"
      className="mx-auto max-w-7xl px-5 pb-20"
    >

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">

        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
            Handpicked for you
          </p>

          <h2 className="mt-2 text-3xl font-black text-gray-900">
            {selectedCategory === "All Products"
              ? "Featured Products"
              : selectedCategory}
          </h2>
        </div>

        <button
          onClick={onClearFilter}
          className="flex items-center gap-2 text-sm font-bold text-violet-700"
        >
          View all <ArrowRight size={17} />
        </button>

      </div>

      {products.length > 0 ? (

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {products.map((product) => (

            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlist.some(
                (item) => item.id === product.id
              )}
            />

          ))}

        </div>

      ) : (

        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <h3 className="text-xl font-bold">No products found</h3>
          <p className="mt-2 text-gray-500">
            Try another search or category.
          </p>
        </div>

      )}

    </section>
  );
}