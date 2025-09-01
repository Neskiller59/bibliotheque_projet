import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { bookService, authorService } from '../services/api';

const HomePage = () => {
  // États pour stocker les nombres
  const [bookCount, setBookCount] = useState(null);
  const [authorCount, setAuthorCount] = useState(null);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsError(null);
        const [books, authors] = await Promise.all([
          bookService.getAll(),
          authorService.getAll()
        ]);
        setBookCount(books.length);
        setAuthorCount(authors.length);
      } catch (e) {
        setStatsError("Impossible de charger les statistiques");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>📚 Bienvenue dans votre Bibliothèque Numérique</h1>
        <p className="hero-description">
          Gérez votre collection de livres et d'auteurs avec une interface moderne et intuitive.
        </p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📖</div>
          <h3>Gestion des Livres</h3>
          <p>Ajoutez, modifiez et organisez votre collection de livres</p>
          <Link to="/books" className="feature-link">
            Voir les livres →
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">✍</div>
          <h3>Gestion des Auteurs</h3>
          <p>Découvrez et gérez les auteurs de votre bibliothèque</p>
          <Link to="/authors" className="feature-link">
            Voir les auteurs →
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3>Recherche Avancée</h3>
          <p>Trouvez rapidement le livre que vous cherchez</p>
          <Link to="/books" className="feature-link">
            Rechercher →
          </Link>
        </div>
      </div>

      <div className="stats-section">
        <h2>Votre Bibliothèque en Chiffres</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{bookCount !== null ? bookCount : '...'}</div>
            <div className="stat-label">Livres disponibles</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{authorCount !== null ? authorCount : '...'}</div>
            <div className="stat-label">Auteurs référencés</div>
          </div>
        </div>
        {statsError && (
          <div className="stats-error" style={{ color: 'red', marginTop: 8 }}>
            {statsError}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
