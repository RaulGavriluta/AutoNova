import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../routes/store';
import { logOut } from '../features/auth/store/authSlice';
import { FiMenu, FiX } from 'react-icons/fi'; 

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false); 
  
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logOut());
    setIsOpen(false);
    navigate('/');
  };

  const linkStyles = ({ isActive }: { isActive: boolean }) =>
    `font-body-custom font-medium px-4 py-2 rounded-lg transition-colors duration-200 no-underline border-b-0 ${
      isActive
        ? 'bg-primary text-bg-surface' 
        : 'text-text-muted hover:text-primary hover:bg-primary/5'
    }`;

  const mobileLinkStyles = ({ isActive }: { isActive: boolean }) =>
    `font-body-custom font-medium block w-full px-4 py-3 rounded-xl transition-colors duration-200 ${
      isActive
        ? 'bg-primary text-bg-surface' 
        : 'text-text-base hover:bg-primary/5'
    }`;

  return (
    <nav className="bg-bg-main relative z-50">
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

          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={linkStyles}>
                Login
              </NavLink>
              <NavLink to="/register" className={linkStyles}>
                Register
              </NavLink>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm font-body-custom text-text-base font-medium bg-primary/10 px-3 py-1 rounded-lg">
                Hello, {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="font-body-custom font-medium px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* HAMBURGER BUTTON (Hidden on Desktop) */}
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
      <div className={`absolute top-full left-0 w-full bg-bg-main border-t border-border-custom px-6 py-4 flex flex-col gap-2 shadow-lg md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen 
          ? 'opacity-100 max-h-96 visible' 
          : 'opacity-0 max-h-0 invisible'
      }`}>
          <NavLink 
            to="/" 
            className={mobileLinkStyles}
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>

          {!isAuthenticated ? (
            <>
              <NavLink 
                to="/login" 
                className={mobileLinkStyles}
                onClick={() => setIsOpen(false)}
              >
                Login
              </NavLink>
              <NavLink 
                to="/register" 
                className={mobileLinkStyles}
                onClick={() => setIsOpen(false)}
              >
                Register
              </NavLink>
            </>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <span className="text-xs font-body-custom uppercase tracking-wider text-text-muted px-4">
                Logged in as: <span className="text-text-base font-bold font-custom block mt-0.5">{user?.email}</span>
              </span>
              <button
                onClick={handleLogout}
                className="font-body-custom font-medium w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
    </nav>
  );
}