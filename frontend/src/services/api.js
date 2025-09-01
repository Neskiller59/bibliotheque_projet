import axios from 'axios';

const API_BASE_URL = 'https://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor pour gérer les erreurs globalement
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Fonction helper pour extraire les données API Platform
const extractHydraMember = (response) => {
  return response['hydra:member'] || response;
};

// Service pour les auteurs
export const authorService = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/authors');
      return extractHydraMember(response.data);
    } catch (error) {
      throw new Error('Impossible de charger les auteurs');
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/authors/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Auteur avec l'ID ${id} introuvable`);
    }
  },

  create: async (authorData) => {
    try {
      const response = await apiClient.post('/authors', authorData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la création de l\'auteur';
      throw new Error(message);
    }
  },

  update: async (id, authorData) => {
    try {
      const response = await apiClient.put(`/authors/${id}`, authorData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour de l\'auteur';
      throw new Error(message);
    }
  },

  delete: async (id) => {
    try {
      await apiClient.delete(`/authors/${id}`);
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la suppression de l\'auteur';
      throw new Error(message);
    }
  }
};

// Service pour les éditeurs
export const editorService = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/editors');
      return extractHydraMember(response.data);
    } catch (error) {
      console.error('Editor service error:', error);
      throw new Error('Impossible de charger les éditeurs');
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/editors/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Éditeur avec l'ID ${id} introuvable`);
    }
  },

  create: async (editorData) => {
    try {
      // Formatage spécifique pour les dates
      const formattedData = {
        ...editorData,
        dateDeCreation: editorData.dateDeCreation 
          ? new Date(editorData.dateDeCreation).toISOString().split('T')[0]
          : null
      };
      
      const response = await apiClient.post('/editors', formattedData);
      return response.data;
    } catch (error) {
      console.error('Create editor error:', error.response?.data);
      const message = error.response?.data?.message || 'Erreur lors de la création de l\'éditeur';
      throw new Error(message);
    }
  },

  update: async (id, editorData) => {
    try {
      // Formatage spécifique pour les dates
      const formattedData = {
        ...editorData,
        dateDeCreation: editorData.dateDeCreation 
          ? new Date(editorData.dateDeCreation).toISOString().split('T')[0]
          : null
      };
      
      const response = await apiClient.put(`/editors/${id}`, formattedData);
      return response.data;
    } catch (error) {
      console.error('Update editor error:', error.response?.data);
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour de l\'éditeur';
      throw new Error(message);
    }
  },

  delete: async (id) => {
    try {
      await apiClient.delete(`/editors/${id}`);
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la suppression de l\'éditeur';
      throw new Error(message);
    }
  }
};

// Service pour les livres
export const bookService = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/books');
      return extractHydraMember(response.data);
    } catch (error) {
      throw new Error('Impossible de charger les livres');
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Livre avec l'ID ${id} introuvable`);
    }
  },

  create: async (bookData) => {
    try {
      // Formatage pour les relations (IRI API Platform)
      const formattedData = {
        ...bookData,
        author: bookData.author ? `/api/authors/${bookData.author}` : null,
        editor: bookData.editor ? `/api/editors/${bookData.editor}` : null
      };

      const response = await apiClient.post('/books', formattedData);
      return response.data;
    } catch (error) {
      console.error('Create book error:', error.response?.data);
      const message = error.response?.data?.message || 'Erreur lors de la création du livre';
      throw new Error(message);
    }
  },

  update: async (id, bookData) => {
    try {
      // Formatage pour les relations (IRI API Platform)
      const formattedData = {
        ...bookData,
        author: bookData.author ? `/api/authors/${bookData.author}` : null,
        editor: bookData.editor ? `/api/editors/${bookData.editor}` : null
      };

      const response = await apiClient.put(`/books/${id}`, formattedData);
      return response.data;
    } catch (error) {
      console.error('Update book error:', error.response?.data);
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour du livre';
      throw new Error(message);
    }
  },

  delete: async (id) => {
    try {
      await apiClient.delete(`/books/${id}`);
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la suppression du livre';
      throw new Error(message);
    }
  }
};

// Fonctions utilitaires
export const utils = {
  // Extraire l'ID depuis une IRI API Platform
  extractIdFromIri: (iri) => {
    if (!iri) return null;
    const matches = iri.match(/\/(\d+)$/);
    return matches ? parseInt(matches[1]) : null;
  },

  // Formatter une date pour l'affichage
  formatDate: (dateString) => {
    if (!dateString) return 'Non spécifié';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return 'Date invalide';
    }
  },

  // Formatter une date pour les inputs
  formatDateForInput: (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch {
      return '';
    }
  }
};

// Export par défaut avec tous les services
export default {
  authors: authorService,
  editors: editorService,
  books: bookService,
  utils
};