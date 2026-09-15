import React, { useState, useEffect, useRef } from 'react';
import { Search, X, CornerDownLeft, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function SearchBar({ query, onSearch, placeholder = "Ask anything, compare perspectives, explore concepts..." }) {
  const [inputVal, setInputVal] = useState(query || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setInputVal(query || '');
  }, [query]);

  // Global hotkey: press '/' to focus search bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (!inputVal || inputVal.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`/api/suggestions?q=${encodeURIComponent(inputVal.trim())}`);
        if (res.data?.suggestions) {
          setSuggestions(res.data.suggestions.slice(0, 6));
        }
      } catch {
        setSuggestions([]);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [inputVal]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    setShowSuggestions(false);
    onSearch(inputVal.trim());
  };

  const handleSelectSuggestion = (text) => {
    setInputVal(text);
    setShowSuggestions(false);
    onSearch(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      }
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[selectedIndex]);
      }
    }
  };

  return (
    <div className="searchbar-container" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="searchbar-box">
        <div className="searchbar-icon">
          <Search size={20} />
        </div>

        <input
          ref={inputRef}
          type="text"
          className="searchbar-input"
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
            setShowSuggestions(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search query"
          id="prism-search-input"
          autoFocus
        />

        <div className="searchbar-actions">
          {inputVal && (
            <button
              type="button"
              className="btn-clear"
              onClick={() => {
                setInputVal('');
                setSuggestions([]);
                inputRef.current?.focus();
              }}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}

          <span className="kbd-badge" title="Press / to focus">/</span>

          <button type="submit" className="btn-search-submit" id="prism-submit-btn">
            <span>Explore</span>
            <CornerDownLeft size={14} />
          </button>
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              className={`suggestion-item ${selectedIndex === idx ? 'active' : ''}`}
              onMouseDown={() => handleSelectSuggestion(item)}
            >
              <Sparkles size={14} color="#06b6d4" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
