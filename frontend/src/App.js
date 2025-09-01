import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import AuthorsPage from './pages/AuthorsPage';
import './App.css';
function App() {
 return (
 <Router>
 <div className="App">
 <Header />
 <main className="main-content">
 <Routes>
 <Route path="/" element={<HomePage />} />
 <Route path="/books" element={<BooksPage />} />
 <Route path="/authors" element={<AuthorsPage />} />
 </Routes>
 </main>
 <Footer />
 </div>
 </Router>
 );
}
export default App;