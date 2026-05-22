import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../../store';
import { updateQuantity, removeFromCart, clearCart } from '../store/cartSlice';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

export default function CartPage() {
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const handleQuantityChange = (productId: number, currentQty: number, change: number, maxStock: number) => {
    const newQty = currentQty + change;
    if (newQty > 0 && newQty <= maxStock) {
      dispatch(updateQuantity({ productId, quantity: newQty }));
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4 font-body-custom text-center px-4">
        <div className="p-4 bg-bg-main border border-border-custom text-text-muted rounded-full text-4xl">
          <FiShoppingBag />
        </div>
        <h2 className="text-2xl font-custom font-bold text-text-base">Your shopping cart is empty</h2>
        <p className="text-text-muted text-sm max-w-sm">
          It looks like you haven't added any certified mechanical components to your garage yet.
        </p>
        <Link to="/products" className="mt-2 bg-primary hover:bg-primary-hover text-bg-main text-sm font-semibold py-3 px-6 rounded-xl transition-all shadow-sm">
          Browse Auto Components
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full font-body-custom min-h-screen py-6 text-text-base">
      <h1 className="text-3xl font-custom font-bold tracking-tight mb-2">Shopping Cart</h1>
      <p className="text-text-muted text-sm border-b border-border-custom pb-6 mb-8">
        Review your selected automotive parts before proceeding to secure checkout.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LIST OF ITEMS */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.product.id} className="bg-bg-main border border-border-custom p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-center shadow-xs">
              <div className="flex gap-4 items-center w-full sm:w-auto">
                <div className="w-20 h-20 bg-bg-surface border border-border-custom rounded-xl overflow-hidden flex items-center justify-center text-text-muted/30 shrink-0">
                  {item.product.imageUrl ? (
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-secondary tracking-wider uppercase">{item.product.partBrand}</span>
                  <h3 className="text-sm font-custom font-bold text-text-base line-clamp-2 max-w-md">{item.product.name}</h3>
                  <span className="text-[10px] font-mono text-text-muted/80">SKU: {item.product.sku}</span>
                </div>
              </div>

              <div className="flex justify-between sm:justify-end items-center gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-border-custom/40">
                <div className="flex flex-col gap-1 items-center">
                  <div className="flex items-center bg-bg-surface border border-border-custom rounded-lg overflow-hidden">
                    <button 
                      onClick={() => handleQuantityChange(item.product.id, item.quantity, -1, item.product.stockQuantity)}
                      className="p-2 text-text-muted hover:bg-bg-main transition-colors cursor-pointer text-xs"
                    >
                      <FiMinus />
                    </button>
                    <span className="px-3 text-xs font-bold font-mono text-text-base min-w-8 text-center">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => handleQuantityChange(item.product.id, item.quantity, 1, item.product.stockQuantity)}
                      className="p-2 text-text-muted hover:bg-bg-main transition-colors cursor-pointer text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={item.quantity >= item.product.stockQuantity}
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <span className="text-[9px] font-medium text-text-muted">Max: {item.product.stockQuantity} items</span>
                </div>

                <div className="text-right min-w-22">
                  <span className="text-sm font-bold text-text-base">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                  <p className="text-[10px] text-text-muted">${item.product.price.toFixed(2)} each</p>
                </div>

                <button 
                  onClick={() => dispatch(removeFromCart(item.product.id))}
                  className="text-text-muted hover:text-red-600 p-2 text-sm transition-colors cursor-pointer border border-border-custom rounded-lg bg-bg-surface hover:bg-red-50"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}

          <button 
            onClick={() => dispatch(clearCart())}
            className="text-xs text-text-muted hover:text-red-600 font-semibold text-left ml-2 mt-2 cursor-pointer w-fit transition-colors"
          >
            Clear Entire Order Context
          </button>
        </div>

        {/* SUMMARY */}
        <div className="bg-bg-main border border-border-custom p-6 rounded-2xl flex flex-col gap-5 shadow-xs">
          <h2 className="text-lg font-custom font-bold text-text-base">Order Summary</h2>
          <div className="flex flex-col gap-3 text-sm border-b border-border-custom/60 pb-4">
            <div className="flex justify-between text-text-muted">
              <span>Selected Components</span>
              <span className="font-mono">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Logistics & Shipping</span>
              <span className="text-green-700 font-semibold">FREE</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-sm font-bold">Total Est. Price:</span>
            <span className="text-2xl font-custom font-bold text-text-base">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          <Link 
            to="/checkout" 
            className="w-full bg-primary hover:bg-primary-hover text-bg-main font-semibold py-3.5 px-4 rounded-xl transition-all text-center flex items-center justify-center gap-2 text-sm shadow-sm mt-2"
          >
            Proceed to Secure Checkout <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}