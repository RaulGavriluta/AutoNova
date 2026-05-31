import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../store";
import { logOut } from "../features/auth/store/authSlice";
import { FiMenu, FiX, FiUser, FiShoppingCart, FiSettings, FiPackage, FiLogOut } from "react-icons/fi";
import toast from "react-hot-toast";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );

  const { totalQuantity } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logOut());
    setIsOpen(false);
    setIsDropdownOpen(false);
    toast.error("Logged out succesfully");
    navigate("/");
  };

  const linkStyles = ({ isActive }: { isActive: boolean }) =>
    `font-body-custom font-medium px-4 py-2 rounded-lg transition-colors duration-200 no-underline border-b-0 ${
      isActive
        ? "bg-primary text-bg-main"
        : "text-text-muted hover:text-primary hover:bg-primary/5"
    }`;

  const mobileLinkStyles = ({ isActive }: { isActive: boolean }) =>
    `font-body-custom font-medium block w-full px-4 py-3 rounded-xl transition-colors duration-200 ${
      isActive
        ? "bg-primary text-bg-main"
        : "text-text-base hover:bg-primary/5"
    }`;

  return (
    <nav className="bg-bg-main relative z-50 border-b border-brand-border">
      {/* PRINCIPAL NAVBAR CONTAINER */}
      <div className="px-6 md:px-8 py-4 flex justify-between items-center max-w-7xl mx-auto">
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <NavLink
            to="/"
            className="text-2xl font-custom font-bold text-primary tracking-tight"
            onClick={() => setIsOpen(false)}
          >
            AutoNova
          </NavLink>
        </div>

        {/* DESKTOP NAVIGATION (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-4">
          <NavLink to="/" className={linkStyles}>
            Home
          </NavLink>

          <NavLink to="/products" className={linkStyles}>
            Catalog
          </NavLink>

          {!isAuthenticated ? (
            <NavLink to="/login" className={linkStyles}>
              Login
            </NavLink>
          ) : (
            <div className="flex items-center gap-3 ml-2 border-l border-brand-border pl-5">
              {/* LINK COȘ CU ICONIȚĂ ȘI BADGE DINAMIC */}
              <NavLink to="/cart" className={({ isActive }) => linkStyles({ isActive }) + " relative flex items-center gap-2"}>
                <FiShoppingCart className="text-lg" />
                <span>Cart</span>
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-2 bg-secondary text-bg-surface text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {totalQuantity}
                  </span>
                )}
              </NavLink>

              {/* CONTROLOUL DROP-DOWN-ULUI DE USER */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-200 cursor-pointer border ${
                    isDropdownOpen 
                      ? "bg-primary text-bg-main border-primary" 
                      : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                  }`}
                >
                  <FiUser />
                </button>

                {/* MENIUL DROPDOWN PLUTITOR (DESKTOP) */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-bg-surface border border-brand-border rounded-xl shadow-xl py-2 z-50 animate-fade-in font-body-custom">
                    <div className="px-4 py-2 border-b border-brand-border/60 mb-1">
                      <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Authenticated as</p>
                      <p className="text-xs font-semibold text-text-base truncate">{user?.email}</p>
                    </div>

                    <Link 
                      to="/orders" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-text-base hover:bg-bg-main transition-colors"
                    >
                      <FiPackage className="text-secondary text-sm" /> Order History
                    </Link>

                    <div className="border-t border-brand-border/60 mt-1.5 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer font-semibold"
                      >
                        <FiLogOut className="text-sm" /> Logout Session
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* HAMBURGER BUTTON (Mobile) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-text-base text-2xl p-2 focus:outline-none cursor-pointer rounded-lg hover:bg-primary/5 transition-all duration-200"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU (Hidden on Desktop) */}
      <div
        className={`absolute top-full left-0 w-full bg-bg-main border-t border-brand-border px-6 py-4 flex flex-col gap-2 shadow-lg md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 max-h-[450px] visible" : "opacity-0 max-h-0 invisible"
        }`}
      >
        <NavLink to="/" className={mobileLinkStyles} onClick={() => setIsOpen(false)}>
          Home
        </NavLink>

        <NavLink to="/products" className={mobileLinkStyles} onClick={() => setIsOpen(false)}>
          Catalog
        </NavLink>

        {!isAuthenticated ? (
          <NavLink to="/login" className={mobileLinkStyles} onClick={() => setIsOpen(false)}>
            Login
          </NavLink>
        ) : (
          <>
            <NavLink to="/cart" className={mobileLinkStyles} onClick={() => setIsOpen(false)}>
              Cart {totalQuantity > 0 && `(${totalQuantity})`}
            </NavLink>
            
            {/* Secțiune cont restructurată pentru mobil */}
            <div className="flex flex-col gap-1 pt-3 border-t border-brand-border/60 mt-1">
              <div className="px-4 py-1.5 text-text-muted text-[10px] uppercase font-bold tracking-wider">
                Account: <span className="text-text-base font-semibold block normal-case text-xs mt-0.5 truncate">{user?.email}</span>
              </div>
              
              <Link to="/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-text-base hover:bg-primary/5 rounded-xl">
                <FiPackage className="text-secondary" /> Order History
              </Link>

              <button
                onClick={handleLogout}
                className="mt-2 font-body-custom font-semibold w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-sm flex items-center gap-2"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}