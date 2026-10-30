import React, { useState } from 'react';
import { CalendarRange, Sparkles, Check, ChevronDown } from 'lucide-react';

interface PeriodPickerProps {
  value: string; // e.g. "09 – 11.2025"
  onChange: (val: string) => void;
  className?: string;
  id?: string;
}

const MONTH_NAMES = [
  { num: '01', name: '01 - Styczeń' },
  { num: '02', name: '02 - Luty' },
  { num: '03', name: '03 - Marzec' },
  { num: '04', name: '04 - Kwiecień' },
  { num: '05', name: '05 - Maj' },
  { num: '06', name: '06 - Czerwiec' },
  { num: '07', name: '07 - Lipiec' },
  { num: '08', name: '08 - Sierpień' },
  { num: '09', name: '09 - Wrzesień' },
  { num: '10', name: '10 - Październik' },
  { num: '11', name: '11 - Listopad' },
  { num: '12', name: '12 - Grudzień' },
];

const PRESETS = [
  {
    kod: '09 – 11.2025',
    etykieta: '09 – 11.2025 r.',
    opis: 'wrzesień – listopad 2025 (domyślny wg wzoru)',
    promoted: true,
  },
  {
    kod: '06 – 08.2025',
    etykieta: '06 – 08.2025 r.',
    opis: 'czerwiec – sierpień 2025',
  },
  {
    kod: '03 – 05.2025',
    etykieta: '03 – 05.2025 r.',
    opis: 'marzec – maj 2025',
  },
  {
    kod: '10 – 12.2025',
    etykieta: '10 – 12.2025 r.',
    opis: 'październik – grudzień 2025',
  },
  {
    kod: '09 – 11.2026',
    etykieta: '09 – 11.2026 r.',
    opis: 'wrzesień – listopad 2026',
  },
];

export const PeriodPicker: React.FC<PeriodPickerProps> = ({
  value,
  onChange,
  className = '',
  id = 'okres-picker',
}) => {
  const [showCustom, setShowCustom] = useState(false);

  // Parse current value
  const parseVal = (str: string) => {
    // Expected formats: "09 – 11.2025", "09-11.2025", "09 - 11.2025..r"
    const regex = /(\d{2})\s*[-–]\s*(\d{2})\.?(\d{4})/;
    const m = str.match(regex);
    if (m) {
      return { startM: m[1], endM: m[2], year: m[3] };
    }
    return { startM: '09', endM: '11', year: '2025' };
  };

  const current = parseVal(value);
  const [startMonth, setStartMonth] = useState(current.startM);
  const [endMonth, setEndMonth] = useState(current.endM);
  const [year, setYear] = useState(current.year);

  const applyCustom = (s: string, e: string, y: string) => {
    setStartMonth(s);
    setEndMonth(e);
    setYear(y);
    const formatted = `${s} – ${e}.${y}`;
    onChange(formatted);
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Wyróżniony główny przycisk okresu (wg wzoru z pdf: 09 - 11.2025) */}
      <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wide">
              Okres 3 miesięcy poprzedzających wniosek
            </span>
          </div>
          <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded-full">
            wypłacone w m-cach
          </span>
        </div>

        {/* Aktywny okres - wyróżniony display */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/60 shadow-xs">
          <div className="flex items-center gap-2">
            <CalendarRange className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">
                Zapis na oświadczeniu:
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
                tj. …{value || '09 – 11.2025'}..r
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCustom(!showCustom)}
            className="flex items-center gap-1.5 self-start sm:self-center text-xs font-semibold px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <span>Zmień miesiące / rok</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                showCustom ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Szybkie przyciski z mocno uwydatnionym 09 - 11 */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => {
            const isSelected = value.includes(p.kod);
            return (
              <button
                key={p.kod}
                type="button"
                onClick={() => {
                  onChange(p.kod);
                  const parsed = parseVal(p.kod);
                  setStartMonth(parsed.startM);
                  setEndMonth(parsed.endM);
                  setYear(parsed.year);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  p.promoted
                    ? isSelected
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400 ring-offset-1 scale-[1.02]'
                      : 'bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 border border-blue-300 dark:border-blue-700'
                    : isSelected
                    ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
                title={p.opis}
              >
                {p.promoted && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                <span>{p.etykieta}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rozszerzony selektor miesięcy i roku (tylko miesiące + rok) */}
      {showCustom && (
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-md space-y-3">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Wybór zakresu miesięcy i roku (ograniczenie: tylko miesiące i rok):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Miesiąc od (początek)
              </label>
              <select
                value={startMonth}
                onChange={(e) => applyCustom(e.target.value, endMonth, year)}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
              >
                {MONTH_NAMES.map((m) => (
                  <option key={`start-${m.num}`} value={m.num}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Miesiąc do (koniec)
              </label>
              <select
                value={endMonth}
                onChange={(e) => applyCustom(startMonth, e.target.value, year)}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
              >
                {MONTH_NAMES.map((m) => (
                  <option key={`end-${m.num}`} value={m.num}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Rok
              </label>
              <select
                value={year}
                onChange={(e) => applyCustom(startMonth, endMonth, e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
              >
                {[2023, 2024, 2025, 2026, 2027, 2028].map((yr) => (
                  <option key={`yr-${yr}`} value={yr.toString()}>
                    {yr} r.
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
