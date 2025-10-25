import React, { useState, useEffect } from 'react';
import { Palette, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { type Theme } from '../types';

export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, themes, setCurrentTheme, generateNewTheme, isLoading, error } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAIPrompt, setShowAIPrompt] = useState(false);

  // Clear error when component unmounts or prompt closes
  useEffect(() => {
    if (!showAIPrompt) {
      // Error is cleared in the context after display
    }
  }, [showAIPrompt]);

  const handleThemeSelect = (theme: Theme) => {
    console.log('Theme selected:', theme.name); // Debug log
    setCurrentTheme(theme); // This is the missing line!
    setIsOpen(false);
  };

  const handleAIGenerate = async () => {
    if (aiPrompt.trim()) {
      const result = await generateNewTheme(aiPrompt.trim());
      if (result.success) {
        setAiPrompt('');
        setShowAIPrompt(false);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)] transition-colors duration-200 shadow-lg"
      >
        <Palette size={20} />
        <span>Theme</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border-b border-red-200 flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Predefined Themes */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Predefined Themes</h3>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    currentTheme.id === theme.id
                      ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-opacity-20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {Object.values(theme.colors).slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {theme.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Theme Generator */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">AI Theme Generator</h3>
              <Sparkles size={16} className="text-[var(--color-accent)]" />
            </div>

            {!showAIPrompt ? (
              <button
                onClick={() => setShowAIPrompt(true)}
                className="w-full py-2 px-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white rounded-lg hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                Generate with AI
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe your theme (e.g., 'warm sunset', 'cool forest')"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleAIGenerate()}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAIGenerate}
                    disabled={isLoading || !aiPrompt.trim()}
                    className="flex-1 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Sparkles size={16} />
                    )}
                    {isLoading ? 'Generating...' : 'Generate'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAIPrompt(false);
                      setAiPrompt('');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};