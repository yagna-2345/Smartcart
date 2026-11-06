import {
  Smartphone,
  Shirt,
  Watch,
  House,
  Dumbbell,
  ShoppingBag
} from "lucide-react";

const categories = [
  { name: "Electronics", icon: Smartphone },
  { name: "Fashion", icon: Shirt },
  { name: "Accessories", icon: Watch },
  { name: "Home", icon: House },
  { name: "Sports", icon: Dumbbell },
  { name: "All Products", icon: ShoppingBag }
];

export default function Categories({ onSelect }) {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-5 py-16">

      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
          Explore collections
        </p>
        <h2 className="mt-2 text-3xl font-black text-gray-900">
          Shop by Category
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <button
              key={category.name}
              onClick={() => onSelect(category.name)}
              className="group rounded-2xl border border-violet-100 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:border-violet-300 hover:shadow-xl"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
                <Icon size={26} />
              </div>

              <p className="text-sm font-bold text-gray-700">
                {category.name}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}