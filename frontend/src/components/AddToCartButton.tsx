import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { type RootState } from '../store'; 
import { addToCart } from '../features/cart/store/cartSlice'; 
import { type Product } from '../types/catalog.types';
import { FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast'; 

interface AddToCartButtonProps {
  product: Product;
  variant?: 'compact' | 'large';
}

export default function AddToCartButton({ product, variant = 'compact' }: AddToCartButtonProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const isOutOfStock = product.stockQuantity === 0;

  const baseStyles = "font-semibold rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:cursor-not-allowed";
  
  const variantStyles = {
    compact: "bg-primary text-bg-main hover:bg-primary-hover disabled:bg-text-muted/20 disabled:text-text-muted/40 text-xs py-2 px-3",
    large: "bg-primary text-bg-main hover:bg-primary-hover disabled:bg-text-muted/20 disabled:text-text-muted/40 text-sm py-3.5 px-6 w-full text-center"
  };

  const handleAction = () => {
    if (isAuthenticated) {
      dispatch(addToCart(product));
      
      toast.success(
        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase font-bold text-secondary">{product.partBrand}</span>
          <span className="text-xs font-medium text-text-base">Added to cart</span>
        </div>,
        { icon: '🔧' }
      );
    } else {
      navigate('/login');
    }
  };

  return (
    <button
      disabled={isOutOfStock}
      onClick={handleAction}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {variant === 'large' && <FiShoppingCart className="text-base" />}
      {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
    </button>
  );
}