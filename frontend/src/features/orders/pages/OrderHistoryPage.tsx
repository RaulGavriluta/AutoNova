import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../../store/index";
import { Link } from "react-router-dom";
import { FiPackage, FiCalendar, FiMapPin, FiCheckCircle, FiChevronDown, FiChevronUp, FiShoppingBag } from "react-icons/fi";
import axios from "axios";

interface OrderItemResponse {
  id: number;
  quantity: number;
  priceAtPurchase: number;
  product: {
    name: string;
    partBrand: string;
    sku: string;
    imageUrl?: string;
  };
}

interface OrderResponse {
  id: number;
  totalPrice: number;
  status: string;
  shippingAddress: string;
  createdAt: string;
  items: OrderItemResponse[];
}

export default function OrderHistoryPage() {
  // useSelector se uită în store-ul central și știe acum perfect tipul stării tale de auth
  const { user } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const userId = user?.id || 1; // Fallback adaptiv pentru teste
        const response = await axios.get(`http://localhost:8080/api/orders/user/${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error loading order context from Postgres:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [user]);

  const toggleOrderExpand = (id: number) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center font-body-custom text-text-muted text-sm">
        Loading your garage purchase history...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4 font-body-custom text-center px-4 animate-fade-in">
        <div className="p-4 bg-bg-main border border-brand-border text-text-muted rounded-full text-4xl">
          <FiPackage />
        </div>
        <h2 className="text-xl font-custom font-bold text-text-base">No orders registered yet</h2>
        <p className="text-text-muted text-sm max-w-sm">
          You haven't checked out any mechanical components in this account yet.
        </p>
        <Link to="/products" className="mt-2 bg-primary hover:bg-primary-hover text-bg-main text-xs font-semibold py-3 px-5 rounded-xl transition-all shadow-xs">
          Browse Certified Components
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full font-body-custom min-h-screen py-6 text-text-base animate-fade-in">
      <h1 className="text-3xl font-custom font-bold tracking-tight mb-2">Order History</h1>
      <p className="text-text-muted text-sm border-b border-brand-border pb-6 mb-8">
        Track your securely tokenized invoices, parts procurement, and delivery status.
      </p>

      <div className="flex flex-col gap-5 max-w-4xl">
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order.id;
          const formattedDate = new Date(order.createdAt).toLocaleDateString("ro-RO", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return (
            <div key={order.id} className="bg-bg-main border border-brand-border rounded-2xl overflow-hidden shadow-xs transition-all">
              {/* HEADER-UL CARDULUI DE COMANDĂ */}
              <div 
                onClick={() => toggleOrderExpand(order.id)}
                className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-brand-border/10 transition-colors select-none"
              >
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8 text-xs">
                  <div>
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Order ID</span>
                    <span className="font-mono font-bold text-text-base">#AN-00{order.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block flex items-center gap-1"><FiCalendar /> Date Placed</span>
                    <span className="font-medium text-text-base">{formattedDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Total Amount</span>
                    <span className="font-bold text-primary">${order.totalPrice.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Status</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 uppercase tracking-wide mt-0.5">
                      <FiCheckCircle className="text-xs" /> {order.status}
                    </span>
                  </div>
                </div>

                <button className="text-text-muted hover:text-primary self-end sm:self-auto flex items-center gap-1 text-xs font-semibold">
                  {isExpanded ? <>Hide Details <FiChevronUp /></> : <>View Details <FiChevronDown /></>}
                </button>
              </div>

              {/* DETALIILE EXTINSE ALE COMENZII */}
              {isExpanded && (
                <div className="bg-bg-surface border-t border-brand-border p-5 flex flex-col gap-4 animate-fade-in">
                  {/* LOGISTICS INFO */}
                  <div className="flex items-start gap-2 bg-bg-main/40 border border-brand-border/40 p-3 rounded-xl text-xs text-text-muted">
                    <FiMapPin className="text-primary text-sm shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-text-base block mb-0.5">Shipping Destination:</span>
                      {order.shippingAddress}
                    </div>
                  </div>

                  {/* LISTA COMPONENTELOR ACHIZIȚIONATE */}
                  <div className="flex flex-col gap-3 mt-1">
                    <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Procured Components:</span>
                    {/* ✅ SINTAXĂ CORECTATĂ: Am pus arrow function `=>` în loc de `->` */}
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center gap-4 bg-bg-main/20 p-3 border border-brand-border/30 rounded-xl text-xs">
                        <div className="flex items-center gap-3 truncate max-w-[75%]">
                          <div className="w-12 h-12 bg-bg-surface border border-brand-border/60 rounded-lg overflow-hidden flex items-center justify-center shrink-0 text-text-muted/20">
                            {item.product.imageUrl ? (
                              <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                            ) : (
                              <FiShoppingBag />
                            )}
                          </div>
                          <div className="flex flex-col truncate">
                            <span className="text-[9px] font-bold text-secondary uppercase tracking-wider">{item.product.partBrand}</span>
                            <span className="font-bold text-text-base truncate">{item.product.name}</span>
                            <span className="text-[9px] font-mono text-text-muted/70">SKU: {item.product.sku} | Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-text-base block">${(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                          <span className="text-[10px] text-text-muted">${item.priceAtPurchase.toFixed(2)} each</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}