import { create } from 'zustand'

export const useUIStore = create((set) => ({
  isLoading:       false,
  teacherPanelOpen: false,
  activeModal:     null,   // null | 'settings' | 'teams' | 'confirm-exit'
  notification:    null,   // { message, type: 'success'|'error'|'info' }

  setLoading:          (v)  => set({ isLoading: v }),
  openTeacherPanel:    ()   => set({ teacherPanelOpen: true }),
  closeTeacherPanel:   ()   => set({ teacherPanelOpen: false }),
  toggleTeacherPanel:  ()   => set(s => ({ teacherPanelOpen: !s.teacherPanelOpen })),
  openModal:           (id) => set({ activeModal: id }),
  closeModal:          ()   => set({ activeModal: null }),
  showNotification:    (message, type = 'info') => {
    set({ notification: { message, type } })
    setTimeout(() => set({ notification: null }), 3000)
  },
}))