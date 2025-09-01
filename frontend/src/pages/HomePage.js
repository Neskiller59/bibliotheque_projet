import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { bookService, authorService, editorService } from '../services/api';

const HomePage = () => {
  // États pour stocker les nombres
  const [bookCount, setBookCount] = useState(null);
  const [authorCount, setAuthorCount] = useState(null);
  const [editorCount, setEditorCount] = useState(null);
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setStatsError(null);
        
        const [books, authors, editors] = await Promise.all([
          bookService.getAll(),
          authorService.getAll(),
          editorService.getAll()
        ]);
        
        setBookCount(books.length);
        setAuthorCount(authors.length);
        setEditorCount(editors.length);
        
        // Prendre les 3 derniers livres (ou tous si moins de 3)
        const sortedBooks = books
          .sort((a, b) => (b.id || 0) - (a.id || 0))
          .slice(0, 3);
        setRecentBooks(sortedBooks);
        
      } catch (e) {
        console.error('Erreur lors du chargement des statistiques:', e);
        setStatsError("Impossible de charger les statistiques");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getAuthorName = (book) => {
    if (book.author) {
      if (typeof book.author === 'string') {
        // Si c'est une IRI, on ne peut pas facilement récupérer le nom
        return 'Auteur inconnu';
      } else if (book.author.firstName && book.author.lastName) {
        return `${book.author.firstName} ${book.author.lastName}`;
      }
    }
    return 'Auteur inconnu';
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>📚 Bienvenue dans votre Bibliothèque Numérique</h1>
        <p className="hero-description">
          Gérez votre collection de livres, auteurs et éditeurs avec une interface moderne et intuitive.
        </p>
        {loading && (
          <div className="loading-indicator">
            <span>Chargement de votre bibliothèque...</span>
          </div>
        )}
      </div>

      <div className="features-grid">
        <div className="feature-card books-card">
          <div className="feature-icon">📖</div>
          <h3>Gestion des Livres</h3>
          <p>Ajoutez, modifiez et organisez votre collection de livres avec tous leurs détails</p>
          <div className="feature-stats">
            {bookCount !== null ? (
              <span className="mini-stat">{bookCount} livre{bookCount !== 1 ? 's' : ''}</span>
            ) : (
              <span className="mini-stat loading">...</span>
            )}
          </div>
          <Link to="/books" className="feature-link">
            Gérer les livres →
          </Link>
        </div>

        <div className="feature-card authors-card">
          <div className="feature-icon">✍️</div>
          <h3>Gestion des Auteurs</h3>
          <p>Découvrez et gérez les auteurs de votre bibliothèque personnelle</p>
          <div className="feature-stats">
            {authorCount !== null ? (
              <span className="mini-stat">{authorCount} auteur{authorCount !== 1 ? 's' : ''}</span>
            ) : (
              <span className="mini-stat loading">...</span>
            )}
          </div>
          <Link to="/authors" className="feature-link">
            Gérer les auteurs →
          </Link>
        </div>

        <div className="feature-card editors-card">
          <div className="feature-icon">🏢</div>
          <h3>Gestion des Éditeurs</h3>
          <p>Organisez les maisons d'édition et leurs publications</p>
          <div className="feature-stats">
            {editorCount !== null ? (
              <span className="mini-stat">{editorCount} éditeur{editorCount !== 1 ? 's' : ''}</span>
            ) : (
              <span className="mini-stat loading">...</span>
            )}
          </div>
          <Link to="/editors" className="feature-link">
            Gérer les éditeurs →
          </Link>
        </div>

        <div className="feature-card search-card">
          <div className="feature-icon">🔍</div>
          <h3>Recherche Avancée</h3>
          <p>Trouvez rapidement le livre, l'auteur ou l'éditeur que vous cherchez</p>
          <div className="feature-stats">
            <span className="mini-stat">Recherche globale</span>
          </div>
          <Link to="/books" className="feature-link">
            Rechercher →
          </Link>
        </div>
      </div>

      <div className="content-section">
        <div className="stats-section">
          <h2>📊 Votre Bibliothèque en Chiffres</h2>
          <div className="stats-grid">
            <div className="stat-card books-stat">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <div className="stat-number">
                  {bookCount !== null ? bookCount : (loading ? '...' : '0')}
                </div>
                <div className="stat-label">Livre{bookCount !== 1 ? 's' : ''} disponible{bookCount !== 1 ? 's' : ''}</div>
              </div>
            </div>
            
            <div className="stat-card authors-stat">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-number">
                  {authorCount !== null ? authorCount : (loading ? '...' : '0')}
                </div>
                <div className="stat-label">Auteur{authorCount !== 1 ? 's' : ''} référencé{authorCount !== 1 ? 's' : ''}</div>
              </div>
            </div>
            
            <div className="stat-card editors-stat">
              <div className="stat-icon">🏛️</div>
              <div className="stat-content">
                <div className="stat-number">
                  {editorCount !== null ? editorCount : (loading ? '...' : '0')}
                </div>
                <div className="stat-label">Éditeur{editorCount !== 1 ? 's' : ''} enregistré{editorCount !== 1 ? 's' : ''}</div>
              </div>
            </div>
          </div>
          
          {statsError && (
            <div className="stats-error">
              <span>⚠️ {statsError}</span>
              <button 
                onClick={() => window.location.reload()} 
                className="retry-button"
              >
                Réessayer
              </button>
            </div>
          )}
        </div>

        {/* Section des livres récents */}
        {recentBooks.length > 0 && (
          <div className="recent-section">
            <h2>📖 Derniers Livres Ajoutés</h2>
            <div className="recent-books-grid">
              {recentBooks.map(book => (
                <div key={book.id} className="recent-book-card">
                  <div className="book-cover">
                    {book.coverImage ? (
                      <img 
                        src={book.coverImage} 
                        alt={`Couverture de ${book.title}`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="book-cover-placeholder" 
                      style={{ display: book.coverImage ? 'none' : 'flex' }}
                    >
                      📚
                    </div>
                  </div>
                  <div className="book-info">
                    <h4 className="book-title">{book.title}</h4>
                    <p className="book-author">par {getAuthorName(book)}</p>
                    <p className="book-description">
                      {truncateText(book.description)}
                    </p>
                    <div className="book-details">
                      <span className="book-pages">{book.pages} pages</span>
                      {book.publicationYear && (
                        <span className="book-year">• {book.publicationYear}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="recent-books-footer">
              <Link to="/books" className="view-all-link">
                Voir tous les livres →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Section d'actions rapides */}
      <div className="quick-actions-section">
        <h2>🚀 Actions Rapides</h2>
        <div className="quick-actions-grid">
          <Link to="/books" className="quick-action-card">
            <span className="action-icon">➕</span>
            <span className="action-text">Ajouter un livre</span>
          </Link>
          <Link to="/authors" className="quick-action-card">
            <span className="action-icon">👤</span>
            <span className="action-text">Ajouter un auteur</span>
          </Link>
          <Link to="/editors" className="quick-action-card">
            <span className="action-icon">🏢</span>
            <span className="action-text">Ajouter un éditeur</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;