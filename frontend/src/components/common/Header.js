import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
const Header = () => {
 const location = useLocation();
 return (
 <header className="header">
 <div className="header-container">
 <div className="logo">
 <Link to="/">
 <h1>📚 Bibliothèque Numérique</h1>
 </Link>
 </div>

 <nav className="navigation">
 <Link
 to="/"
 className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
 >
 Accueil
 </Link>
 <Link
 to="/books"
 className={`nav-link ${location.pathname === '/books' ? 'active' : ''}`}
 >
 Livres</Link>
 <Link
 to="/authors"
 className={`nav-link ${location.pathname === '/authors' ? 'active' :
''}`}
 >
 Auteurs
 </Link>
 </nav>
 </div>
 </header>
 );
};
export default Header;