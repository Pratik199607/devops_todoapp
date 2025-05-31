import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
	const [theme, setTheme] = useState(() => {
		const saved = localStorage.getItem("taskmaster-theme");
		return saved || "system";
	});

	const [systemTheme, setSystemTheme] = useState(
		window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
	);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = (e) => setSystemTheme(e.matches ? "dark" : "light");

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	useEffect(() => {
		localStorage.setItem("taskmaster-theme", theme);

		const effectiveTheme = theme === "system" ? systemTheme : theme;

		if (effectiveTheme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [theme, systemTheme]);

	return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within ThemeProvider");
	}
	return context;
};
