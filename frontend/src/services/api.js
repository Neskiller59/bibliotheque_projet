import axios from 'axios';
const API_BASE_URL = 'https://localhost:8000/api';
const apiClient = axios.create({
 baseURL: API_BASE_URL,
 headers: {
 'Content-Type': 'application/json',
 'Accept': 'application/json'
 }
});
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
 const response = await
apiClient.get(`/authors/${id}`);
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
 throw new Error('Erreur lors de la création de l\'auteur');
 }
 },
 update: async (id, authorData) => {
 try {
 const response = await
apiClient.put(`/authors/${id}`, authorData);
 return response.data;
 } catch (error) {
 throw new Error('Erreur lors de la mise à jour de l\'auteur');
 }
 },
 delete: async (id) => {
 try {
 await apiClient.delete(`/authors/${id}`);
 return true;
 } catch (error) {
 throw new Error('Erreur lors de la suppression de l\'auteur');
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
 const response = await
apiClient.get(`/books/${id}`);
 return response.data;
 } catch (error) {
 throw new Error(`Livre avec l'ID ${id} introuvable`);
 }
 },
 create: async (bookData) => {
 try {
 const response = await apiClient.post('/books',
bookData);
 return response.data;
 } catch (error) {
 throw new Error('Erreur lors de la création du livre');
 }
 },
 update: async (id, bookData) => {
 try {
 const response = await
apiClient.put(`/books/${id}`, bookData);
 return response.data;
 } catch (error) {
 throw new Error('Erreur lors de la mise à jour du livre');
 }
 },
 delete: async (id) => {
 try {
 await apiClient.delete(`/books/${id}`);
 return true;
 } catch (error) {
 throw new Error('Erreur lors de la suppression du livre');
 }
 }
};