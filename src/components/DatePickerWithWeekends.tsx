import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface DatePickerWithWeekendsProps {
  value: string; // ISO format or formatted DD.MM or DD.MM.YYYY
  selectedYear: string; // Rok oświadczenia - steruje rokiem w całym dokumencie
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
  selectedYear,
  onChange,
  className = '',
  id = 'data-input',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const numYear = parseInt(selectedYear, 10) || new Date().getFullYear();

  // Parse initial month and day
  const parsedMonthDay = (() => {
    if (!value) return { month: 9, day: 24 }; // default 24 października
    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts.length >= 2) {
        const d = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        return { month: isNaN(m) ? 9 : m, day: isNaN(d) ? 24 : d };
      }
    }
    if (value.includes('-')) {
      const parts = value.split('-');
      if (parts.length >= 3) {
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        return { month: isNaN(m) ? 9 : m, day: isNaN(d) ? 24 : d };
      }
    }
    return { month: 9, day: 24 };
  })();

  const [viewMonth, setViewMonth] = useState<number>(parsedMonthDay.month);

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

  const formatDateDisplay = (day: number, monthIdx: number): string => {
    const d = day.toString().padStart(2, '0');
    const m = (monthIdx + 1).toString().padStart(2, '0');
    return `${d}.${m}.${numYear}`;
  };

  const formatDateLong = (day: number, monthIdx: number): string => {
    const m = POLISH_MONTHS_GENITIVE[monthIdx];
    return `${day} ${m} ${numYear} r.`;
  };

  const handleSelectDay = (day: number) => {
    const display = formatDateDisplay(day, viewMonth);
    onChange(display, formatDateLong(day, viewMonth));
    setIsOpen(false);
  };

  const handleSetToday = () => {
    const today = new Date();
    setViewMonth(today.getMonth());
    const display = formatDateDisplay(today.getDate(), today.getMonth());
    onChange(display, formatDateLong(today.getDate(), today.getMonth()));
    setIsOpen(false);
  };

  // Generate calendar days for viewMonth and master numYear
  const firstDayOfMonth = new Date(numYear, viewMonth, 1);
  const daysInMonth = new Date(numYear, viewMonth + 1, 0).getDate();
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0
  const prevMonthDays = new Date(numYear, viewMonth, 0).getDate();

  const isToday = (d: number) => {
    const now = new Date();
    return (
      now.getDate() === d &&
      now.getMonth() === viewMonth &&
      now.getFullYear() === numYear
    );
  };

  const isCurrentSelection = (d: number) => {
    return parsedMonthDay.day === d && parsedMonthDay.month === viewMonth;
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm bg-[#09101d] border border-[#1e2d4a] hover:border-amber-500/50 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all shadow-inner"
      >
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-slate-100">
            {value ? value : 'Wybierz datę...'}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md">
          Kalendarz
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 mt-2 w-76 sm:w-80 p-3.5 bg-[#0b1424] rounded-2xl border border-[#1e2d4a] shadow-2xl backdrop-blur-md">
          {/* Header z nawigacją miesiąca (BEZ wyboru roku - rok sterowany z 'Rok oświadczenia') */}
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#17253d]">
            <div className="flex items-center gap-2">
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                className="text-xs font-bold bg-[#09101d] border border-[#1e2d4a] rounded-lg px-2.5 py-1.5 text-slate-100 focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                {POLISH_MONTHS.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>
              <span className="text-xs font-bold text-amber-400 font-mono bg-amber-400/10 px-2 py-1 rounded-md border border-amber-400/20">
                {numYear} r.
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewMonth((prev) => (prev === 0 ? 11 : prev - 1))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#132038] transition-colors"
                title="Poprzedni miesiąc"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMonth((prev) => (prev === 11 ? 0 : prev + 1))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#132038] transition-colors"
                title="Następny miesiąc"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dni tygodnia z odznaczonymi weekendami */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {WEEKDAYS.map((w) => (
              <div
                key={w.short}
                title={w.name}
                className={`text-[11px] font-bold py-1 rounded ${
                  w.weekend
                    ? 'text-rose-400 bg-rose-500/15 border border-rose-500/20'
                    : 'text-slate-400'
                }`}
              >
                {w.short}
              </div>
            ))}
          </div>

          {/* Siatka dni */}
          <div className="grid grid-cols-7 gap-1">
            {/* Poprzedni miesiąc */}
            {Array.from({ length: startDayOfWeek }).map((_, i) => {
              const prevDay = prevMonthDays - startDayOfWeek + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="h-8 flex items-center justify-center text-xs text-slate-600 select-none"
                >
                  {prevDay}
                </div>
              );
            })}

            {/* Dni bieżącego miesiąca */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayOfWeek = (startDayOfWeek + i) % 7;
              const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
              const selected = isCurrentSelection(day);
              const today = isToday(day);

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 rounded-lg text-xs font-semibold flex items-center justify-center relative transition-all ${
                    selected
                      ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/25 ring-2 ring-amber-300'
                      : isWeekend
                      ? 'text-rose-300 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-900/40'
                      : 'text-slate-200 hover:bg-[#132038]'
                  } ${today && !selected ? 'ring-1 ring-amber-400' : ''}`}
                >
                  {day}
                  {isWeekend && !selected && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-rose-400"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legenda weekendu & przycisk Dzisiaj */}
          <div className="mt-3 pt-2.5 border-t border-[#17253d] flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[11px] text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
              <span>Weekend (So / Nd)</span>
            </div>

            <button
              type="button"
              onClick={handleSetToday}
              className="flex items-center gap-1 px-3 py-1 text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              Dzisiaj
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
