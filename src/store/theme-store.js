import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
    persist(
        (set, get) => ({
            darkMode: false,
            toggleDarkMode: () => set({ darkMode: !get().darkMode }),
        }),
        {
            name: "theme",
        }
    )
);