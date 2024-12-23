import {
	createContext,
	useState,
	useContext,
	useEffect,
	ReactNode,
} from 'react';

interface ThemeContextType {
	isDark: boolean;
	setIsDark: (isDark: boolean) => void;
}

interface ThemeProviderProps {
	children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
	const [isDark, setIsDark] = useState<boolean>(() => {
		const saved = localStorage.getItem('theme');
		return saved ? JSON.parse(saved) : false;
	});

	useEffect(() => {
		localStorage.setItem('theme', JSON.stringify(isDark));
	}, [isDark]);

	const value = {
		isDark,
		setIsDark,
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

// Custom hook for using the theme
export function useTheme(): ThemeContextType {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}
