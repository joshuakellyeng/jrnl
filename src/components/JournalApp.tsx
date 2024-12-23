import React, { useState, useEffect } from 'react';
import { Save, PlusCircle, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { journalPrompts } from '../journalPrompts';

interface JournalEntry {
	id: number;
	date: string;
	content: string;
	prompt?: string;
}

const JournalApp: React.FC = () => {
	const [entries, setEntries] = useState<JournalEntry[]>([]);
	const [currentEntry, setCurrentEntry] = useState<string>('');
	const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
	const [usePrompt, setUsePrompt] = useState<boolean>(false);
	const [currentPrompt, setCurrentPrompt] = useState<string>('');
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

	const { isDark, setIsDark } = useTheme();

	useEffect(() => {
		const savedEntries = localStorage.getItem('journalEntries');
		if (savedEntries) {
			setEntries(JSON.parse(savedEntries));
		}
	}, []);

	const saveEntry = (): void => {
		if (!currentEntry.trim()) return;

		const newEntry: JournalEntry = {
			id: Date.now(),
			date: new Date().toLocaleString(),
			content: currentEntry,
			prompt: currentPrompt,
		};

		const updatedEntries = [...entries, newEntry];
		setEntries(updatedEntries);
		localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
		setCurrentEntry('');
		setCurrentPrompt('');
		setUsePrompt(false);
		setIsSidebarOpen(false); // Close sidebar on mobile after saving
	};

	const generatePrompt = (): void => {
		const randomPrompt =
			journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
		setCurrentPrompt(randomPrompt);
		setUsePrompt(true);
	};

	const viewEntry = (entry: JournalEntry): void => {
		setSelectedEntry(entry);
		setCurrentEntry('');
		setCurrentPrompt('');
		setUsePrompt(false);
		setIsSidebarOpen(false); // Close sidebar on mobile after selection
	};

	const startNewEntry = (): void => {
		setSelectedEntry(null);
		setCurrentEntry('');
		setCurrentPrompt('');
		setUsePrompt(false);
		setIsSidebarOpen(false); // Close sidebar on mobile
	};

	const toggleTheme = (): void => {
		setIsDark(!isDark);
	};

	return (
		<div
			className={`flex flex-col h-screen relative ${
				isDark ? 'bg-gray-900' : 'bg-gray-100'
			} font-mono`}
		>
			{/* Header */}
			<header
				className={`w-full ${
					isDark ? 'bg-gray-800' : 'bg-white'
				} shadow-lg p-4 z-30`}
			>
				<div className="max-w-7xl mx-auto flex justify-between items-center">
					<h1
						onClick={startNewEntry}
						className={`text-2xl font-bold ${
							isDark ? 'text-white' : 'text-gray-800'
						}`}
					>
						JRNL.
					</h1>
					<div className="flex items-center gap-2">
						<button
							onClick={toggleTheme}
							className={`p-2 rounded-full ${
								isDark
									? 'text-yellow-400 hover:text-yellow-300'
									: 'text-gray-600 hover:text-gray-800'
							}`}
						>
							{isDark ? <Sun size={20} /> : <Moon size={20} />}
						</button>
					</div>
				</div>
			</header>

			{/* Main Content Area */}
			<div className="flex flex-1 overflow-hidden">
				{/* Mobile Menu Button */}
				<button
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className={`md:hidden fixed top-20 left-4 z-50 p-2 rounded-lg ${
						isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
					}`}
				>
					{isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
				</button>

				{/* Sidebar */}
				<div
					className={`
              fixed md:relative w-64 h-[calc(100%-4rem)] top-16 md:top-16 z-40 
              transform transition-transform duration-300 ease-in-out
              ${
								isSidebarOpen
									? 'translate-x-0'
									: '-translate-x-full md:translate-x-0'
							}
              ${
								isDark ? 'bg-gray-800' : 'bg-white'
							} shadow-lg p-4 overflow-y-auto
            `}
				>
					<div className="flex items-center justify-between mb-6">
						<h2
							className={`text-xl font-bold ${
								isDark ? 'text-white' : 'text-gray-800'
							}`}
						>
							Entries
						</h2>
						<button
							onClick={startNewEntry}
							className="text-blue-600 hover:text-blue-400"
						>
							<PlusCircle size={20} />
						</button>
					</div>
					<div className="space-y-2">
						{entries.map((entry) => (
							<div
								key={entry.id}
								onClick={() => viewEntry(entry)}
								className={`p-3 rounded cursor-pointer ${
									selectedEntry?.id === entry.id
										? isDark
											? 'bg-gray-700'
											: 'bg-blue-100'
										: isDark
										? 'hover:bg-gray-700'
										: 'hover:bg-gray-100'
								}`}
							>
								<div
									className={`text-sm font-medium ${
										isDark ? 'text-gray-300' : 'text-gray-600'
									}`}
								>
									{entry.date}
								</div>
								<div className={isDark ? 'text-gray-100' : 'text-gray-800'}>
									{entry.content.substring(0, 50)}...
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Overlay for mobile */}
				{isSidebarOpen && (
					<div
						className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
						onClick={() => setIsSidebarOpen(false)}
					/>
				)}

				{/* Main Content */}
				<div className="flex-1 p-4 md:p-8 overflow-y-auto pt-16 md:pt-4">
					{selectedEntry ? (
						<div
							className={`rounded-lg shadow-lg p-6 ${
								isDark ? 'bg-gray-800' : 'bg-white'
							}`}
						>
							<div
								className={`text-sm ${
									isDark ? 'text-gray-300' : 'text-gray-600'
								} mb-4`}
							>
								{selectedEntry.date}
							</div>
							{selectedEntry.prompt && (
								<div className="text-blue-500 italic mb-4">
									{selectedEntry.prompt}
								</div>
							)}
							<div
								className={`whitespace-pre-wrap ${
									isDark ? 'text-gray-100' : 'text-gray-800'
								}`}
							>
								{selectedEntry.content}
							</div>
						</div>
					) : (
						<div
							className={`rounded-lg shadow-lg p-6 ${
								isDark ? 'bg-gray-800' : 'bg-white'
							}`}
						>
							<div className="flex flex-col md:flex-row justify-between mb-6">
								<h1
									className={`text-2xl font-bold ${
										isDark ? 'text-white' : 'text-gray-800'
									} mb-4 md:mb-0`}
								>
									New Entry
								</h1>
								<div className="space-y-2 md:space-y-0 md:space-x-4">
									<button
										onClick={generatePrompt}
										className={`w-full lg:mb-2 md:mb-2 md:w-auto px-4 py-2 rounded ${
											isDark
												? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
												: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
										}`}
									>
										Get Prompt
									</button>
									<button
										onClick={saveEntry}
										className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2"
									>
										<Save size={16} />
										Save
									</button>
								</div>
							</div>
							{usePrompt && currentPrompt && (
								<div className="text-blue-500 italic mb-4">{currentPrompt}</div>
							)}
							<textarea
								value={currentEntry}
								onChange={(e) => setCurrentEntry(e.target.value)}
								placeholder="Write your thoughts..."
								className={`w-full h-64 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
									isDark
										? 'bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400'
										: 'bg-white text-gray-800 border-gray-300 placeholder-gray-500'
								}`}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default JournalApp;
