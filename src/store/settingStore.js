import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSettingsStore = create(persist(
  (set) => ({
    volume:     0.8,
    theme:      'dark',
    difficulty: 'medium',
    language:   'en',
    schoolName: '',
    teacherName: '',

    setVolume:      (v) => set({ volume: v }),
    setTheme:       (t) => set({ theme: t }),
    setDifficulty:  (d) => set({ difficulty: d }),
    setSchoolName:  (n) => set({ schoolName: n }),
    setTeacherName: (n) => set({ teacherName: n }),
  }),
  { name: 'brainbloom-settings' }
))