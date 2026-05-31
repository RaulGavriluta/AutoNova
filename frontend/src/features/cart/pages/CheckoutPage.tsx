import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { type RootState } from "../../../store";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiLock } from "react-icons/fi";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe("pk_test_51Td6NI9xgPVHdYuhw2fqB8slgCHDb7yR4SGsoIFJ8mQPsGGrHFRD9ZhXAthlCmWTtUXCbi018j9xCd5FiDVRLOar00QMBKSnfa");

export default function CheckoutPage() {
  const { items } = useSelector((state: RootState) => state.cart);

  if (items.length === 0) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-3 font-body-custom">
        <p className="text-text-muted text-sm">Your cart is empty. Cannot checkout.</p>
        <Link to="/products" className="bg-primary text-bg-main px-4 py-2 rounded-xl text-xs font-semibold">
          Go to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full font-body-custom min-h-screen py-6 text-text-base animate-fade-in">
      <Link to="/cart" className="flex items-center gap-2 text-xs text-text-muted hover:text-primary transition-colors mb-6 no-underline w-fit">
        <FiArrowLeft /> Back to shopping cart
      </Link>

      <h1 className="text-3xl font-custom font-bold tracking-tight mb-2">Secure Checkout</h1>
      <p className="text-text-muted text-sm border-b border-brand-border pb-6 mb-8 flex items-center gap-1.5">
        <FiLock className="text-green-700" /> All payments are tokenized securely via Stripe. No card info is stored locally.
      </p>

      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}