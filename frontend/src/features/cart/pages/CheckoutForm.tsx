import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { type RootState } from "../../../store";
import { clearCart } from "../store/cartSlice";
import { FiTruck, FiCreditCard } from "react-icons/fi";
import toast from "react-hot-toast";
import axios from "axios";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, totalPrice } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);

  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.address ||
      !formData.city
    ) {
      toast.error("Please fill in all delivery details.");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Processing secure transaction...");

    try {
      const amountInCents = Math.round(totalPrice * 100);
      const response = await axios.post(
        "http://localhost:8080/api/payments/create-payment-intent",
        {
          amount: amountInCents,
        },
      );

      const clientSecret = response.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: formData.fullName,
            phone: formData.phone,
            address: {
              line1: formData.address,
              city: formData.city,
              postal_code: formData.postalCode,
            },
          },
        },
      });

      if (result.error) {
        toast.error(`Payment failed: ${result.error.message}`, { id: toastId });
        setIsProcessing(false);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          try {
            const structuredAddress = `${formData.fullName} | Tel: ${formData.phone} | Adresa: ${formData.address}, ${formData.city}, Cod Postal: ${formData.postalCode || "N/A"}`;

            const orderPayload = {
              userId: user?.id || 1,
              shippingAddress: structuredAddress,
              items: items.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity,
              })),
            };

            const token = localStorage.getItem("accessToken");

            if (!token) {
              console.error(
                "Security Context Error: accessToken missing from localStorage.",
              );
              toast.error(
                "Your session has expired. Please reauthenticate.",
                { id: toastId },
              );
              setIsProcessing(false);
              return;
            }

            await axios.post("http://localhost:8080/api/orders", orderPayload, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            toast.success("Payment received & order saved in database!", {
              id: toastId,
              icon: "📦",
            });

            dispatch(clearCart());
            setIsProcessing(false);
            navigate("/orders");
          } catch (dbError: any) {
            console.error("Error logging order in Postgres:", dbError);
            toast.error(
              "Payment succeeded, but we couldn't log the order. Contact support.",
              { id: toastId },
            );
            setIsProcessing(false);
          }
        }
      }
    } catch (error) {
      console.error("Gateway error:", error);
      toast.error("Could not process transaction.", { id: toastId });
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-2 bg-bg-main border border-brand-border p-6 rounded-2xl flex flex-col gap-5 shadow-xs"
      >
        <h2 className="text-lg font-custom font-bold text-text-base flex items-center gap-2 border-b border-brand-border/60 pb-3">
          <FiTruck className="text-primary" /> Delivery Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-muted">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className="bg-bg-surface border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-text-base"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-muted">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+40 7xx xxx xxx"
              className="bg-bg-surface border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-text-base"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-text-muted">
            Shipping Address
          </label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Strada Recondiționării Nr. 4"
            className="bg-bg-surface border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-text-base"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-muted">
              City
            </label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Brașov"
              className="bg-bg-surface border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-text-base"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-muted">
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              placeholder="500123"
              className="bg-bg-surface border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-text-base"
            />
          </div>
        </div>
        <div className="mt-4 pt-6 border-t border-brand-border/60">
          <h2 className="text-lg font-custom font-bold text-text-base flex items-center gap-2 mb-4">
            <FiCreditCard className="text-primary" /> Credit or Debit Card
          </h2>
          <div className="bg-bg-surface border border-brand-border p-4 rounded-xl shadow-xs">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "14px",
                    color: "#2c2520",
                    fontFamily: "Poppins, sans-serif",
                    "::placeholder": { color: "#A77F60" },
                  },
                  invalid: { color: "#dc2626" },
                },
              }}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-primary hover:bg-primary-hover disabled:bg-text-muted/40 text-bg-main font-semibold py-4 px-4 rounded-xl transition-all text-center text-sm shadow-sm mt-4 cursor-pointer"
        >
          {isProcessing
            ? "Processing Secure Payment..."
            : `Authorize & Pay $${totalPrice.toFixed(2)}`}
        </button>
      </form>
      <div className="bg-bg-main border border-brand-border p-6 rounded-2xl flex flex-col gap-4 shadow-xs sticky top-6">
        <h2 className="text-base font-custom font-bold text-text-base border-b border-brand-border/60 pb-3">
          Review Items
        </h2>
        <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex justify-between items-center gap-3 text-xs"
            >
              <div className="flex flex-col truncate max-w-[70%]">
                <span className="font-bold text-text-base truncate">
                  {item.product.name}
                </span>
                <span className="text-[10px] text-text-muted font-mono">
                  Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                </span>
              </div>
              <span className="font-bold text-text-base shrink-0">
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-brand-border/60 pt-4 flex flex-col gap-2 text-sm">
          <div className="flex justify-between text-text-muted text-xs">
            <span>Logistics & Transport</span>
            <span className="text-green-700 font-semibold uppercase">Free</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-brand-border/30">
            <span className="font-bold">Total to Pay:</span>
            <span className="text-xl font-custom font-bold text-primary">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
