import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { MdLightMode, MdDarkMode, MdComputer } from "react-icons/md";
import { useLocation } from "react-router-dom";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);
	const location = useLocation();
	const isHome = location.pathname === "/";

	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const themes = [
		{ value: "light", label: "Light", icon: MdLightMode },
		{ value: "dark", label: "Dark", icon: MdDarkMode },
		{ value: "system", label: "System", icon: MdComputer },
	];

	const positionClass = isHome ? "left-0 md:right-0 md:left-auto" : "right-0";

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="h-8 w-8 p-0 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md flex items-center justify-center transition-colors"
			>
				<MdLightMode className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-900 dark:text-gray-100" />
				<MdDarkMode className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-900 dark:text-gray-100" />
			</button>

			{isOpen && (
				<div
					className={`absolute ${positionClass} mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50`}
				>
					{themes.map(({ value, label, icon: Icon }) => (
						<button
							key={value}
							onClick={() => {
								setTheme(value);
								setIsOpen(false);
							}}
							className="w-full px-3 py-2 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 first:rounded-t-md last:rounded-b-md transition-colors"
						>
							<Icon className="h-4 w-4" />
							{label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
