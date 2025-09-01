import React, { useState, useEffect, useMemo } from 'react';
import { bookService, authorService } from '../../services/api';
import BookCard from './BookCard';
import SearchBar from '../common/SearchBar';
import LoadingSpinner from '../common/LoadingSpinner';
import './BookList.css';

const BookListAdvanced = ({ onEdit }) => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Charger les données initiales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [booksData, authorsData] = await Promise.all([
          bookService.getAll(),
          authorService.getAll()
        ]);
        setBooks(booksData);
        setAuthors(authorsData);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Filtrer les livres en temps réel
  const filteredBooks = useMemo(() => {
    if (!searchTerm.trim()) return books;
    return books.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.description &&
        book.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [books, searchTerm]);

  // Supprimer un livre
  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) return;

    try {
      await bookService.delete(bookId);
      setBooks(prev => prev.filter(book => book.id !== bookId));
    } catch (err) {
      alert('Erreur lors de la suppression du livre');
      console.error(err);
    }
  };

  // Récupérer les informations d’un auteur depuis son IRI
  const getAuthorInfo = (authorIri) => {
    if (!authorIri) return null;
    const authorId = authorIri.split('/').pop();
    return authors.find(author => String(author.id) === String(authorId));
  };

  if (loading) return <LoadingSpinner message="Chargement de la bibliothèque..." />;

  if (error)
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          🔄 Réessayer
        </button>
      </div>
    );

  return (
    <div className="book-list-container">
      <div className="book-list-header">
        <h2>📚 Notre Collection de Livres</h2>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Rechercher un livre..."
        />
        <p className="book-count">
          {filteredBooks.length} livre{filteredBooks.length > 1 ? 's' : ''}
          {searchTerm &&
            ` trouvé${filteredBooks.length > 1 ? 's' : ''} pour "${searchTerm}"`}
        </p>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="empty-state">
          {searchTerm ? (
            <p>Aucun livre trouvé pour "{searchTerm}"</p>
          ) : (
            <p>Aucun livre dans la bibliothèque</p>
          )}
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map(book => {
            const authorInfo = getAuthorInfo(book.author);
            return (
              <BookCard
                key={book.id}
                book={{ ...book, authorInfo }}
                onEdit={onEdit}
                onDelete={handleDeleteBook}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookListAdvanced;
