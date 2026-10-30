import React from 'react';
import { Users } from 'lucide-react';

interface HouseholdPersonsSelectProps {
  value: number; // 1 to 20
  onChange: (val: number) => void;
  className?: string;
  id?: string;
}

export function formatOsobyPL(liczba: number): string {
  if (liczba === 1) return '1 osoba';
  if (liczba >= 2 && liczba <= 4) return `${liczba} osoby`;
  return `${liczba} osób`;
}

export const HouseholdPersonsSelect: React.FC<HouseholdPersonsSelectProps> = ({
  value,
  onChange,
  className = '',
  id = 'ilosc-osob-select',
}) => {
  const options = Array.from({ length: 20 }, (_, idx) => {
    const num = idx + 1;
    return {
      num,
      label: formatOsobyPL(num),
    };
  });

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Users className="absolute left-3.5 w-4 h-4 text-amber-400 pointer-events-none" />
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="w-full pl-10 pr-8 py-2.5 text-sm bg-[#09101d] border border-[#1e2d4a] rounded-xl text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 transition-all shadow-inner cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.num} value={opt.num} className="bg-[#0b1424] text-slate-100 font-medium">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
