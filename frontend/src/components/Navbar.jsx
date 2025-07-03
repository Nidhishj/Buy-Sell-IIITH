import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <>
      <nav className="bg-black p-4 text-amber-50 flex justify-between items-center fixed top-0 left-0 right-0 w-full z-50">
        <h1 className="text-white text-2xl md:text-3xl">BechKhao@IIITH</h1>

        <ul className="hidden md:flex gap-x-6 justify-center items-center">
          <li className={`p-2 ${isActive('/buy') ? "text-white bg-gray-700" : "hover:text-yellow-300 hover:bg-gray-700"} rounded-md`}>
            <Link to="/buy" className="text-lg">Buy</Link>
          </li>
          <li className={`p-2 ${isActive('/sell') ? "text-white bg-gray-700" : "hover:text-yellow-300 hover:bg-gray-700"} rounded-md`}>
            <Link to="/sell" className="text-lg">Sell</Link>
          </li>
          <li className={`p-2 ${isActive('/history') ? "text-white bg-gray-700" : "hover:text-yellow-300 hover:bg-gray-700"} rounded-md`}>
            <Link to="/history" className="text-lg">Orders</Link>
          </li>
          <li className={`p-2 ${isActive('/Deliver') ? "text-white bg-gray-700" : "hover:text-yellow-300 hover:bg-gray-700"} rounded-md`}>
            <Link to="/Deliver" className="text-lg">Deliver</Link>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <button 
            className="py-2 text-lg flex items-center gap-1 hover:text-yellow-300" 
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart size={20} />
            <span className="hidden md:inline">Cart</span>
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              className="py-2 text-lg flex items-center gap-1 hover:text-yellow-300" 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <User size={20} />
              <span className="hidden md:inline">Profile</span>
            </button>
            
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                <Link
                  to="/home"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100  items-center"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  <User size={16} className="mr-2" />
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>

          <button 
            className="md:hidden text-white" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden fixed top-[64px] left-0 right-0 bg-black p-4 z-50">
          <ul className="flex flex-col gap-4">
            <li className={`p-2 ${isActive('/buy') ? "text-white bg-gray-700" : "hover:text-yellow-300"} rounded-md`}>
              <Link to="/buy" onClick={() => setIsMenuOpen(false)} className="text-lg flex items-center">
                <span className="text-white">Buy</span>
              </Link>
            </li>
            <li className={`p-2 ${isActive('/sell') ? "text-white bg-gray-700" : "hover:text-yellow-300"} rounded-md`}>
              <Link to="/sell" onClick={() => setIsMenuOpen(false)} className="text-lg flex items-center">
                <span className="text-white">Sell</span>
              </Link>
            </li>
            <li className={`p-2 ${isActive('/history') ? "text-white bg-gray-700" : "hover:text-yellow-300"} rounded-md`}>
              <Link to="/history" onClick={() => setIsMenuOpen(false)} className="text-lg flex items-center">
                <span className="text-white">Orders</span>
              </Link>
            </li>
            <li className={`p-2 ${isActive('/Deliver') ? "text-white bg-gray-700" : "hover:text-yellow-300"} rounded-md`}>
              <Link to="/Deliver" onClick={() => setIsMenuOpen(false)} className="text-lg flex items-center">
                <span className="text-white">Deliver</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
      <div className="mt-16"></div>
    </>
  );
};

export default Navbar;