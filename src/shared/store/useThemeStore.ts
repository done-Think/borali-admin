import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type ThemeMode = 'light' | 'dark'

interface ThemeState {
  mode: ThemeMode
  toggleMode: () => void
  setMode: (mode: ThemeMode) => void
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set, get) => ({
        mode: 'light',
        toggleMode: () =>
          set(
            { mode: get().mode === 'light' ? 'dark' : 'light' },
            false,
            'toggleMode',
          ),
        setMode: (mode) => set({ mode }, false, 'setMode'),
      }),
      { name: 'borali-theme' },
    ),
    { name: 'ThemeStore' },
  ),
)
