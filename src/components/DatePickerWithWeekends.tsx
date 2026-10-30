import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Sun } from 'lucide-react';

interface DatePickerWithWeekendsProps {
  value: string; // ISO format YYYY-MM-DD or formatted DD.MM.YYYY
  onChange: (val: string, displayVal?: string) => void;
  className?: string;
  id?: string;
}

const POLISH_MONTHS = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
];

const POLISH_MONTHS_GENITIVE = [
  'stycznia',
  'lutego',
  'marca',
  'kwietnia',
  'maja',
  'czerwca',
  'lipca',
  'sierpnia',
  'września',
  'października',
  'listopada',
  'grudnia',
];

const WEEKDAYS = [
  { short: 'Pn', name: 'Poniedziałek', weekend: false },
  { short: 'Wt', name: 'Wtorek', weekend: false },
  { short: 'Śr', name: 'Środa', weekend: false },
  { short: 'Cz', name: 'Czwartek', weekend: false },
  { short: 'Pt', name: 'Piątek', weekend: false },
  { short: 'So', name: 'Sobota (weekend)', weekend: true },
  { short: 'Nd', name: 'Niedziela (weekend)', weekend: true },
];

export const DatePickerWithWeekends: React.FC<DatePickerWithWeekendsProps> = ({
  value,
  onChange,
  className = '',
  id = 'data-input',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial date or default to 2025
  const parsedDate = (() => {
    if (!value) return new Date(2025, 9, 24); // default 24 Oct 2025
    if (value.includes('-')) {
      const parts = value.split('-');
      if (parts.length === 3) {
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
    }
    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts.length === 3) {
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      }
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? new Date(2025, 9, 24) : d;
  })();

  const [viewYear, setViewYear] = useState<number>(parsedDate.getFullYear() || 2025);
  const [viewMonth, setViewMonth] = useState<number>(parsedDate.getMonth() || 9);

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

  const formatDateDisplay = (dateObj: Date): string => {
    const d = dateObj.getDate().toString().padStart(2, '0');
    const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const y = dateObj.getFullYear();
    return `${d}.${m}.${y}`;
  };

  const formatDateLong = (dateObj: Date): string => {
    const d = dateObj.getDate();
    const m = POLISH_MONTHS_GENITIVE[dateObj.getMonth()];
    const y = dateObj.getFullYear();
    return `${d} ${m} ${y} r.`;
  };

  const handleSelectDay = (day: number) => {
    const newDate = new Date(viewYear, viewMonth, day);
    const iso = `${viewYear}-${(viewMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const display = formatDateDisplay(newDate);
    onChange(display, formatDateLong(newDate));
    setIsOpen(false);
  };

  const handleSetToday = () => {
    const today = new Date();
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    const display = formatDateDisplay(today);
    onChange(display, formatDateLong(today));
    setIsOpen(false);
  };

  const handleSetDefaultYear = (yr: number) => {
    setViewYear(yr);
  };

  // Generate calendar days
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  // In JS: Sunday is 0, Monday is 1, ..., Saturday is 6.
  // We want Monday = 0, ..., Sunday = 6.
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  // Previous month filler days
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const isToday = (d: number) => {
    const now = new Date();
    return (
      now.getDate() === d &&
      now.getMonth() === viewMonth &&
      now.getFullYear() === viewYear
    );
  };

  const isCurrentSelection = (d: number) => {
    return (
      parsedDate.getDate() === d &&
      parsedDate.getMonth() === viewMonth &&
      parsedDate.getFullYear() === viewYear
    );
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
      >
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="font-medium">
            {value ? value : 'Wybierz datę...'}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
          Kalendarz
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 mt-1.5 w-76 sm:w-80 p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl">
          {/* Header z nawigacją miesiąca i roku */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1">
              {/* Wybór miesiąca */}
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(parseInt(e.target.value))}
                className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 border-none rounded-md px-2 py-1 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {POLISH_MONTHS.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>

              {/* Wybór roku */}
              <select
                value={viewYear}
                onChange={(e) => setViewYear(parseInt(e.target.value))}
                className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 border-none rounded-md px-2 py-1 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {[2023, 2024, 2025, 2026, 2027, 2028].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr} r.
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  if (viewMonth === 0) {
                    setViewMonth(11);
                    setViewYear(viewYear - 1);
                  } else {
                    setViewMonth(viewMonth - 1);
                  }
                }}
                className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Poprzedni miesiąc"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (viewMonth === 11) {
                    setViewMonth(0);
                    setViewYear(viewYear + 1);
                  } else {
                    setViewMonth(viewMonth + 1);
                  }
                }}
                className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Następny miesiąc"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dni tygodnia z wyraźnym odznaczeniem weekendów (Sobota, Niedziela) */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {WEEKDAYS.map((w, idx) => (
              <div
                key={w.short}
                title={w.name}
                className={`text-[11px] font-bold py-1 rounded ${
                  w.weekend
                    ? 'text-rose-600 dark:text-rose-400 bg-rose-50/60 dark:bg-rose-950/30'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {w.short}
              </div>
            ))}
          </div>

          {/* Siatka dni */}
          <div className="grid grid-cols-7 gap-1">
            {/* Poprzedni miesiąc dni */}
            {Array.from({ length: startDayOfWeek }).map((_, i) => {
              const prevDay = prevMonthDays - startDayOfWeek + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="h-8 flex items-center justify-center text-xs text-slate-300 dark:text-slate-600 select-none"
                >
                  {prevDay}
                </div>
              );
            })}

            {/* Dni bieżącego miesiąca */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayOfWeek = (startDayOfWeek + i) % 7;
              const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Sobota lub Niedziela
              const selected = isCurrentSelection(day);
              const today = isToday(day);

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 rounded-md text-xs font-medium flex items-center justify-center relative transition-all ${
                    selected
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : isWeekend
                      ? 'text-rose-700 dark:text-rose-300 bg-rose-50/80 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 font-semibold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  } ${today && !selected ? 'ring-1 ring-blue-500 ring-offset-1' : ''}`}
                >
                  {day}
                  {isWeekend && !selected && (
                    <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-rose-400"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legenda weekendu & przycisk Dzisiaj */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[11px] text-rose-600 dark:text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
              <span>Weekend (So/Nd)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleSetDefaultYear(2025)}
                className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                  viewYear === 2025
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                2025 r.
              </button>
              <button
                type="button"
                onClick={handleSetToday}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:hover:bg-blue-900 dark:text-blue-300 rounded-lg transition-colors"
              >
                <Clock className="w-3 h-3" />
                Dzisiaj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
