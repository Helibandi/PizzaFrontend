import { Link } from 'react-router-dom';
import './Navbar.css';
import HomeIcon from '@mui/icons-material/Home';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { isAdmin, isLoggedIn, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { totalItems } = useCart();


    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <RestaurantIcon className="logo-icon" />
                    <span>Slice and Spice</span>
                </Link>
                
                <nav className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                        <HomeIcon className="nav-icon" />
                        <span>Home</span>
                    </Link>
                    <Link to="/products" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                        <RestaurantIcon className="nav-icon" />
                        <span>Products</span>
                    </Link>
                    
                    {isAdmin ? (
                        <Link to="/admin" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                            <AccountCircleIcon className="nav-icon" />
                            <span>Admin Dashboard</span>
                        </Link>
                    ) : null}
                    
                    {isLoggedIn ? (
                        <>
                            <Link to="/account" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                <AccountCircleIcon className="nav-icon" />
                                <span>Account</span>
                            </Link>
                            <Link 
                                to="/" 
                                className="nav-link" 
                                onClick={() => {
                                    logout();
                                }}
                            >
                                <LogoutIcon className="nav-icon" />
                                <span>Logout</span>
                            </Link>
                        </>
                    ) : (
                        <Link to="/login" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                            <LoginIcon className="nav-icon" />
                            <span>Login</span>
                        </Link>
                    )}
                    
                    <Link to="/cart" className="nav-link cart-link" onClick={() => setIsMobileMenuOpen(false)}>
                        <ShoppingCartIcon className="nav-icon" />
                        Cart {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                    </Link>
                </nav>
                
                <button className="mobile-menu-button" onClick={toggleMobileMenu}>
                    <span className={`menu-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
                    <span className={`menu-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
                    <span className={`menu-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;