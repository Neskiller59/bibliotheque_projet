import React, { useState } from 'react';
import BookList from '../components/Books/BookList';
import BookForm from '../components/Books/BookForm';
import './BooksPage.css';
const BooksPage = () => {
 const [showForm, setShowForm] = useState(false);
 const [editingBook, setEditingBook] = useState(null);
 const [refreshKey, setRefreshKey] = useState(0);
 const handleAddBook = () => {
 setEditingBook(null);
 setShowForm(true);
 };
 const handleEditBook = (book) => {
 setEditingBook(book);
 setShowForm(true);
 };
 const handleSaveBook = (savedBook) => {
 setShowForm(false);
 setEditingBook(null);
 // Forcer le rechargement de la liste
 setRefreshKey(prev => prev + 1);
 };
 const handleCancel = () => {
 setShowForm(false);
 setEditingBook(null);
 };
 return (
 <div className="books-page">
 <div className="page-header">
 <h1>📚 Gestion des Livres</h1>
 <button
 className="btn btn-primary"
 onClick={handleAddBook}
 >
 ➕ Ajouter un livre
 </button>
 </div>
 {showForm && (
 <div className="form-modal">
 <div className="form-overlay" onClick={handleCancel}></div>
 <div className="form-content">
 <BookForm
 bookId={editingBook?.id}
 onSave={handleSaveBook}
 onCancel={handleCancel}
 />
 </div>
 </div>
 )}
 <BookList
 key={refreshKey}
 onEdit={handleEditBook}
 />
 </div>
 );
};
export default BooksPage;