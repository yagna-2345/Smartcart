import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="px-5 pt-8">
      <div className="relative mx-auto flex max-w-7xl flex-col items-center overflow-hidden rounded-[32px] bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-900 px-7 py-16 text-white md:min-h-[420px] md:flex-row md:px-16">

        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 max-w-xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-lg">
            <Sparkles size={16} />
            Discover your next favorite
          </div>

          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            Shopping made
            <span className="block text-purple-200">
              smarter & easier.
            </span>
          </h1>

          <p className="mt-5 max-w-md text-sm leading-7 text-purple-100 md:text-base">
            Discover premium products, explore exciting collections
            and enjoy a seamless shopping experience with SmartCart.
          </p>

          <a
            href="#products"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 font-bold text-violet-800 transition hover:-translate-y-1 hover:shadow-xl"
          >
            Shop Now <ArrowRight size={18} />
          </a>

          <p className="mt-6 text-xs text-purple-200">
            Quality products. Great prices. Easy shopping.
          </p>
        </div>

        <div className="relative mt-10 flex w-full justify-center md:mt-0 md:flex-1">
          <div className="absolute h-64 w-64 rounded-full bg-purple-300/20 blur-3xl" />

          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000"
            alt="Premium shopping collection"
            className="relative h-64 w-full max-w-md rounded-3xl object-cover shadow-2xl ring-1 ring-white/30 md:h-80"
          />

          <div className="absolute -bottom-5 left-2 rounded-2xl border border-white/30 bg-white/20 p-4 shadow-xl backdrop-blur-xl sm:left-0">
            <p className="text-xs text-purple-100">Your shopping destination</p>
            <p className="font-bold">Welcome to SmartCart</p>
          </div>
        </div>
      </div>
    </section>
  );
}