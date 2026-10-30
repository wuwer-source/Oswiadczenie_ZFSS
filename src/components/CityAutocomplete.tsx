import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import { filterCities, PolishCity } from '../data/polishCities';

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
        <MapPin className="absolute left-3.5 w-4 h-4 text-amber-400 pointer-events-none" />
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
          className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#09101d] border border-[#1e2d4a] rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 transition-all shadow-inner font-medium"
        />
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            inputRef.current?.focus();
          }}
          className="absolute right-3 text-slate-400 hover:text-amber-400 transition-colors"
          title="Rozwiń listę miejscowości"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Szybkie tagi miejscowości z regionu */}
      <div className="flex flex-wrap gap-1.5 mt-2 text-xs">
        <span className="text-slate-400 text-[11px] self-center">Popularne:</span>
        {['Ruda Śląska', 'Katowice', 'Zabrze', 'Gliwice', 'Bytom'].map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => {
              onChange(city);
              setSearch(city);
              setIsOpen(false);
            }}
            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition-all border ${
              value === city
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-xs'
                : 'bg-[#09101d] text-slate-300 border-[#17253d] hover:bg-[#132038] hover:text-white'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Lista rozwijana */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 max-h-60 overflow-y-auto bg-[#0b1424] rounded-xl border border-[#1e2d4a] shadow-2xl divide-y divide-[#17253d]">
          {filtered.length === 0 ? (
            <div className="p-3 text-xs text-slate-400 text-center">
              Brak miejscowości w bazie. Zostanie użyta: &quot;{search}&quot;.
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
                  className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between transition-colors ${
                    isHighlighted || isSelected
                      ? 'bg-amber-500/15 text-amber-200'
                      : 'text-slate-300 hover:bg-[#132038]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{city.nazwa}</span>
                    <span className="text-[11px] text-slate-400">
                      woj. {city.wojewodztwo}
                      {city.opis ? ` • ${city.opis}` : ''}
                    </span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
