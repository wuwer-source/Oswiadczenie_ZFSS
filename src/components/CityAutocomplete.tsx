import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, Check, ChevronDown } from 'lucide-react';
import { filterCities, PolishCity, POLISH_CITIES } from '../data/polishCities';

interface CityAutocompleteProps {
  value: string;
  onChange: (city: string) => void;
  className?: string;
  id?: string;
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  value,
  onChange,
  className = '',
  id = 'miejscowosc-input',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearch(value);
  }, [value]);

  const filtered = filterCities(search, 10);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: PolishCity) => {
    onChange(city.nazwa);
    setSearch(city.nazwa);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
        handleSelect(filtered[highlightedIndex]);
      } else {
        onChange(search);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <MapPin className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          id={id}
          ref={inputRef}
          type="text"
          value={search}
          placeholder="Wpisz miejscowość (np. Ruda Śląska)"
          onChange={(e) => {
            setSearch(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-9 pr-9 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xs"
        />
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            inputRef.current?.focus();
          }}
          className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          title="Rozwiń listę miejscowości"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Szybkie tagi miejscowości z regionu */}
      <div className="flex flex-wrap gap-1.5 mt-1.5 text-xs">
        <span className="text-slate-600 text-[11px] self-center">Popularne:</span>
        {['Ruda Śląska', 'Katowice', 'Zabrze', 'Gliwice', 'Bytom'].map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => {
              onChange(city);
              setSearch(city);
              setIsOpen(false);
            }}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors border ${
              value === city
                ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Lista rozwijana */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xl divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.length === 0 ? (
            <div className="p-3 text-xs text-slate-500 dark:text-slate-400 text-center">
              Brak miejscowości w bazie. Możesz wpisać własną: &quot;{search}&quot;.
            </div>
          ) : (
            filtered.map((city, idx) => {
              const isSelected = value.toLowerCase() === city.nazwa.toLowerCase();
              const isHighlighted = idx === highlightedIndex;
              return (
                <button
                  key={`${city.nazwa}-${city.wojewodztwo}`}
                  type="button"
                  onClick={() => handleSelect(city)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                    isHighlighted || isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{city.nazwa}</span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-300">
                      woj. {city.wojewodztwo}
                      {city.opis ? ` • ${city.opis}` : ''}
                    </span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
