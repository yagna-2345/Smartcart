import {
  ShoppingBag,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

export default function Footer() {
  return (
    <footer id="footer" className="bg-gray-950 px-5 py-14 text-white">

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

        <div>
          <div className="flex items-center gap-2 text-2xl font-black">
            <ShoppingBag className="text-violet-400" />
            SmartCart.
          </div>

          <p className="mt-5 max-w-xs text-sm leading-7 text-gray-400">
            Your trusted destination for quality products,
            great prices and a smarter shopping experience.
          </p>
        </div>

        <div>
          <h3 className="mb-5 font-bold">Quick Links</h3>
          <div className="flex flex-col gap-3 text-sm text-gray-400">
            <a href="/" className="hover:text-white">Home</a>
            <a href="#categories" className="hover:text-white">Categories</a>
            <a href="#products" className="hover:text-white">Products</a>
          </div>
        </div>

        <div>
          <h3 className="mb-5 font-bold">Customer Support</h3>
          <div className="flex flex-col gap-3 text-sm text-gray-400">
            <a href="#footer" className="hover:text-white">Help Center</a>
            <a href="#footer" className="hover:text-white">Privacy Policy</a>
            <a href="#footer" className="hover:text-white">Terms & Conditions</a>
          </div>
        </div>

        <div>
          <h3 className="mb-5 font-bold">Contact</h3>
          <div className="flex flex-col gap-4 text-sm text-gray-400">
            <p className="flex items-center gap-2">
              <Mail size={17} /> support@smartcart.example
            </p>
            <p className="flex items-center gap-2">
              <Phone size={17} /> Contact support
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={17} /> India
            </p>
          </div>
        </div>

      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} SmartCart. All rights reserved.
      </div>
    </footer>
  );
}