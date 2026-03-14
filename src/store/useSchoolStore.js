import { create } from "zustand";

// Install zustand if not already: npm install zustand
const useSchoolStore = create((set) => ({
  schoolData: null,
  loading: true,

  setSchool: (schoolData) => set({ schoolData, loading: false }),
  clearSchool: () => set({ schoolData: null, loading: false }),
  setLoading: (val) => set({ loading: val }),
}));

export default useSchoolStore;