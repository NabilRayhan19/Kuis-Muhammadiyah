"use client";

import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/theme-store";
import React from "react";

const ThemeProvider = ({ children }) => {
    const { darkMode } = useThemeStore();
    return (
        <div
            className={cn(
                darkMode && "dark",
                "xs:min-h-screen lg:h-full w-full lg:overflow-hidden transition-all"
            )}
        >
            {children}
        </div>
    );
};

export default ThemeProvider;