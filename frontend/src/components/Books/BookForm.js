import React, { useState, useEffect } from 'react';
import { bookService, authorService } from '../../services/api';
import './BookForm.css';

const BookForm = ({ bookId = null, onSave, onCancel }) => {
  const [book, setBook] = useState({
    title: '',
    description: '',
    pages: '',
    image: '',
    author: ''
  });

  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les auteurs et le livre (si modification)
  useEffect(() => {
    loadAuthors();
    if (bookId) {
      loadBook(bookId);
    }
  }, [bookId]);

  const loadAuthors = async () => {
    try {
      const authorsData = await authorService.getAll();
      setAuthors(authorsData);
    } catch (err) {
      console.error('Erreur lors du chargement des auteurs:', err);
    }
  };

  const loadBook = async (id) => {
    try {
      const bookData = await bookService.getById(id);
      setBook({
        title: bookData.title,
        description: bookData.description || '',
        pages: bookData.pages,
        image: bookData.image || '',
        author: bookData.author?.['@id'] || bookData.author // Gestion IRI
      });
    } catch (err) {
      setError('Erreur lors du chargement du livre');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBook(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation basique
    if (!book.title.trim() || !book.author || !book.pages) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bookData = {
        ...book,
        pages: parseInt(book.pages, 10),
        // S'assurer que l'auteur est au format IRI
        author: book.author.startsWith('/api/authors/')
          ? book.author
          : `/api/authors/${book.author}`
      };

      let savedBook;
      if (bookId) {
        savedBook = await bookService.update(bookId, bookData);
      } else {
        savedBook = await bookService.create(bookData);
      }

      if (onSave) {
        onSave(savedBook);
      }
    } catch (err) {
      setError('Erreur lors de la sauvegarde du livre');
      console.error('Erreur lors de la sauvegarde:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-form-container">
      <h3>{bookId ? 'Modifier le livre' : 'Ajouter un nouveau livre'}</h3>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label htmlFor="title">Titre *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={book.title}
            onChange={handleInputChange}
            placeholder="Titre du livre"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Auteur *</label>
          <select
            id="author"
            name="author"
            value={book.author}
            onChange={handleInputChange}
            required
          >
            <option value="">Sélectionner un auteur</option>
            {authors.map(author => (
              <option key={author.id} value={`/api/authors/${author.id}`}>
                {author.firstName} {author.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="pages">Nombre de pages *</label>
          <input
            type="number"
            id="pages"
            name="pages"
            value={book.pages}
            onChange={handleInputChange}
            placeholder="Nombre de pages"
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">URL de l'image</label>
          <input
            type="url"
            id="image"
            name="image"
            value={book.image}
            onChange={handleInputChange}
            placeholder="https://exemple.com/image.jpg"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={book.description}
            onChange={handleInputChange}
            placeholder="Description du livre"
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-cancel"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Sauvegarde...' : bookId ? 'Modifier' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
