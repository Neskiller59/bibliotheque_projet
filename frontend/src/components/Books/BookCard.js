import React from 'react';
import './BookCard.css';

const BookCard = ({ book, onDelete, onEdit }) => {
  // Extraire le nom complet de l'auteur
  const getAuthorName = (authorInfo) => {
    if (authorInfo?.firstName && authorInfo?.lastName) {
      return `${authorInfo.firstName} ${authorInfo.lastName}`;
    }
    return 'Auteur non chargé';
  };

  // Gestion de l'image par défaut en cas d'erreur
  const handleImageError = (e) => {
    e.target.src =
      'https://via.placeholder.com/200x300/cccccc/666666?text=Image+non+disponible';
  };

  return (
    <div className="book-card">
      <div className="book-image-container">
        <img
          src={
            book.image ||
            'https://via.placeholder.com/200x300/cccccc/666666?text=Pas+d\'image'
          }
          alt={book.title}
          className="book-image"
          onError={handleImageError}
        />
      </div>

      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">Par {getAuthorName(book.authorInfo)}</p>

        {book.description && (
          <p className="book-description">
            {book.description.length > 100
              ? `${book.description.substring(0, 100)}...`
              : book.description}
          </p>
        )}

        <div className="book-meta">
          <span className="book-pages">📄 {book.pages} pages</span>
        </div>
      </div>

      <div className="book-actions">
        <button className="btn btn-edit" onClick={() => onEdit(book)}>
          ✏ Modifier
        </button>
        <button className="btn btn-delete" onClick={() => onDelete(book.id)}>
          🗑 Supprimer
        </button>
      </div>
    </div>
  );
};

export default BookCard;
