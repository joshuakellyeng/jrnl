import { ThemeProvider } from './contexts/ThemeContext';
import JournalApp from './components/JournalApp';

function App() {
	return (
		<>
			<ThemeProvider>
				<JournalApp />
			</ThemeProvider>
		</>
	);
}

export default App;
