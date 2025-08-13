import API from './api';

const semesterService = {
  getAll: () => API.get('/semesters'),
  create: (semesterData) => API.post('/semesters', semesterData),
  delete: (id) => API.delete(`/semesters/${id}`),
};

export default semesterService;