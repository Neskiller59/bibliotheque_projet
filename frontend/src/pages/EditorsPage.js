import React, { useState, useEffect, useCallback } from 'react';
import { editorService } from '../services/api';
import './EditorsPage.css';

const EditorsPage = () => {
  const [editors, setEditors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEditors, setFilteredEditors] = useState([]);
  const [form, setForm] = useState({ 
    name: '', 
    dateDeCreation: '', 
    siege: '' 
  });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Charger les éditeurs
  const loadEditors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await editorService.getAll();
      setEditors(data);
    } catch (e) {
      console.error('Erreur lors du chargement des éditeurs:', e);
      setError('Erreur lors du chargement des éditeurs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEditors();
  }, [loadEditors]);

  // Filtrer les éditeurs
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEditors(editors);
    } else {
      const filtered = editors.filter(editor => {
        const name = editor.name?.toLowerCase() || '';
        const siege = editor.siege?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        
        return name.includes(search) || siege.includes(search);
      });
      setFilteredEditors(filtered);
    }
  }, [editors, searchTerm]);

  // Réinitialiser le formulaire
  const resetForm = useCallback(() => {
    setForm({ name: '', dateDeCreation: '', siege: '' });
    setEditingId(null);
    setError(null);
  }, []);

  // Gérer le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    } catch {
      return 'Date invalide';
    }
  };

  // Formater la date pour l'input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      setError('Le nom de l\'éditeur est obligatoire');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      // Préparer les données pour l'API
      const formData = {
        ...form,
        dateDeCreation: form.dateDeCreation || null
      };
      
      if (editingId) {
        await editorService.update(editingId, formData);
      } else {
        await editorService.create(formData);
      }
      
      resetForm();
      await loadEditors();
    } catch (e) {
      console.error('Erreur lors de la sauvegarde:', e);
      setError(`Erreur lors de la ${editingId ? 'modification' : 'création'} de l'éditeur`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (editor) => {
    setForm({ 
      name: editor.name || '', 
      dateDeCreation: formatDateForInput(editor.dateDeCreation) || '', 
      siege: editor.siege || '' 
    });
    setEditingId(editor.id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet éditeur ?')) {
      return;
    }

    try {
      setError(null);
      await editorService.delete(id);
      await loadEditors();
    } catch (e) {
      console.error('Erreur lors de la suppression:', e);
      setError('Erreur lors de la suppression de l\'éditeur');
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  if (loading) {
    return (
      <div className="editors-page-container">
        <div className="loading-spinner">Chargement des éditeurs...</div>
      </div>
    );
  }

  return (
    <div className="editors-page-container">
      <header className="page-header">
        <h1>Gestion des Éditeurs</h1>
        <p>Gérez votre liste d'éditeurs et maisons d'édition</p>
      </header>

      {/* Barre de recherche */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Rechercher par nom ou siège social..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="error-close">×</button>
        </div>
      )}

      {/* Tableau des éditeurs */}
      <div className="table-section">
        <h2>Liste des éditeurs ({filteredEditors.length})</h2>
        
        {filteredEditors.length === 0 ? (
          <div className="no-results">
            {searchTerm ? 'Aucun éditeur trouvé pour cette recherche' : 'Aucun éditeur enregistré'}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="editors-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Date de création</th>
                  <th>Siège social</th>
                  <th>Nombre de livres</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEditors.map(editor => (
                  <tr key={editor.id} className={editingId === editor.id ? 'editing' : ''}>
                    <td className="editor-name">
                      <strong>{editor.name}</strong>
                    </td>
                    <td>{formatDate(editor.dateDeCreation)}</td>
                    <td>{editor.siege || 'Non spécifié'}</td>
                    <td>
                      <span className="books-count">
                        {editor.books?.length || 0} livre(s)
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        onClick={() => handleEdit(editor)} 
                        className="btn-edit"
                        title="Modifier"
                        disabled={submitting}
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(editor.id)}
                        className="btn-delete"
                        title="Supprimer"
                        disabled={submitting}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Formulaire d'ajout/modification */}
      <div className="form-section">
        <h3>{editingId ? 'Modifier l\'éditeur' : 'Ajouter un nouvel éditeur'}</h3>
        
        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nom de l'éditeur *</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Nom de la maison d'édition"
                value={form.name}
                onChange={handleChange}
                required
                disabled={submitting}
                className={!form.name.trim() && error ? 'error' : ''}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dateDeCreation">Date de création</label>
              <input
                id="dateDeCreation"
                type="date"
                name="dateDeCreation"
                value={form.dateDeCreation}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="siege">Siège social</label>
            <input
              id="siege"
              type="text"
              name="siege"
              placeholder="Adresse du siège social (optionnel)"
              value={form.siege}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-save"
              disabled={submitting}
            >
              {submitting ? 'Sauvegarde...' : (editingId ? 'Enregistrer les modifications' : 'Ajouter l\'éditeur')}
            </button>
            
            {editingId && (
              <button 
                type="button" 
                onClick={handleCancel} 
                className="btn-cancel"
                disabled={submitting}
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditorsPage;