// API Service Layer (Lectures 67-72)
import axios from 'axios';

const WGER_BASE = 'https://wger.de/api/v2';

const api = axios.create({
  baseURL: WGER_BASE,
  params: { format: 'json', language: 2 },
});

export const fetchExercises = async (page = 1, limit = 20, category) => {
  const offset = (page - 1) * limit;
  const params = { limit, offset };
  if (category) params.category = category;
  const { data } = await api.get('/exerciseinfo/', { params });
  
  const mappedResults = data.results.map(ex => {
    const en = ex.translations?.find(t => t.language === 2) || ex.translations?.[0] || {};
    return {
      ...ex,
      name: en.name || 'Unnamed Exercise',
      description: en.description || 'No description available.'
    };
  });

  return { results: mappedResults, count: data.count, totalPages: Math.ceil(data.count / limit) };
};

export const fetchExerciseById = async (id) => {
  const { data } = await api.get(`/exerciseinfo/${id}/`);
  const en = data.translations?.find(t => t.language === 2) || data.translations?.[0] || {};
  return {
    ...data,
    name: en.name || 'Unnamed Exercise',
    description: en.description || 'No description available.'
  };
};

export const fetchExerciseCategories = async () => {
  const { data } = await api.get('/exercisecategory/');
  return data.results;
};

export const fetchMuscles = async () => {
  const { data } = await api.get('/muscle/');
  return data.results;
};

export const searchExercises = async (term, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const { data } = await api.get('/exercise/search/', { params: { term, limit, offset } });
  return data;
};

export default api;
