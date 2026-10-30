import React from 'react';
import { formatujPLN } from '../utils/numberToWordsPL';

export interface FormDataState {
  miejscowosc: string;
  dataWniosku: string; // e.g. "24.10.2025" or "24.10"
  rokWniosku: string; // "2025"
  imieNazwisko: string;
  stanowisko: string;
  okresMiesiecy: string; // "09 – 11.2025"
  dochodWuwer: string; // "12500,00"
  inneZrodlaOpis: string; // np. "zlecenie", "brak"
  dochodInne: string; // "0,00"
  dochodWspolne: string; // "33 825,45"
  dochodWspolneSlownie: string;
  iloscOsob: number; // 4
  ogolemDochod: string; // obliczony automatycznie lub ręczny
  podpisImage: string;
  // Sekcja pracodawcy
  sredniDochodNaOsobePracodawca?: string;
  wysokoscDofinansowaniaPracodawca?: string;
}

interface OfficialDocumentViewProps {
  data: FormDataState;
  showEmployerCalculations?: boolean;
}

export const OfficialDocumentView: React.FC<OfficialDocumentViewProps> = ({
  data,
  showEmployerCalculations = true,
}) => {
  // Format numeric values cleanly
  const dochodWuwerFmt = data.dochodWuwer ? formatujPLN(data.dochodWuwer) : '';
  const dochodInneFmt = data.dochodInne ? formatujPLN(data.dochodInne) : '';
  const dochodWspolneFmt = data.dochodWspolne ? formatujPLN(data.dochodWspolne) : '';
  const dochodOgolemFmt = data.ogolemDochod ? formatujPLN(data.ogolemDochod) : '';

  // Calculate average income per person for employer box
  const numOsob = data.iloscOsob || 1;
  const numOgolem = parseFloat(
    (data.ogolemDochod || '0').toString().replace(/\s+/g, '').replace(',', '.')
  );
  const sredniNaOsobe =
    !isNaN(numOgolem) && numOgolem > 0
      ? formatujPLN((numOgolem / (numOsob * 3)).toFixed(2)) // per month per person over 3 months or per period
      : '';

  // Extract day/month for "dnia ....................... 2025 r."
  const extractDayMonth = () => {
    if (!data.dataWniosku) return '';
    // If format is DD.MM.YYYY, return DD.MM
    if (data.dataWniosku.includes('.')) {
      const parts = data.dataWniosku.split('.');
      if (parts.length >= 2) {
        return `${parts[0]}.${parts[1]}`;
      }
    }
    return data.dataWniosku;
  };

  const dayMonthVal = extractDayMonth();

  return (
    <div
      id="printable-document"
      className="a4-document bg-white text-black p-8 sm:p-12 md:p-14 shadow-2xl mx-auto rounded-none border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0 w-full max-w-[820px] font-serif text-[13.5px] leading-[1.65] select-text"
      style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
    >
      {/* NAGŁÓWEK DOKUMENTU: Miejscowość, data & Imię, nazwisko, stanowisko */}
      <div className="flex justify-between items-start gap-4 mb-6">
        {/* Lewa strona: Imię i nazwisko + Stanowisko */}
        <div className="w-[48%] space-y-3">
          {/* Imię i nazwisko */}
          <div className="text-center">
            <div className="min-h-[24px] border-b border-dotted border-black flex items-end justify-center px-2 pb-0.5 font-sans font-semibold text-[14px]">
              {data.imieNazwisko ? (
                <span className="text-blue-950 font-bold">{data.imieNazwisko}</span>
              ) : (
                <span className="text-transparent select-none">.</span>
              )}
            </div>
            <div className="text-[11px] text-black mt-0.5 text-center">
              (imię i nazwisko)
            </div>
          </div>

          {/* Stanowisko */}
          <div className="text-center pt-1">
            <div className="min-h-[24px] border-b border-dotted border-black flex items-end justify-center px-2 pb-0.5 font-sans font-medium text-[13px]">
              {data.stanowisko ? (
                <span className="text-slate-900">{data.stanowisko}</span>
              ) : (
                <span className="text-transparent select-none">.</span>
              )}
            </div>
            <div className="text-[11px] text-black mt-0.5 text-center">
              (stanowisko)
            </div>
          </div>
        </div>

        {/* Prawa strona: Miejscowość i data - wycentrowane pod kropkami */}
        <div className="w-[48%] text-center">
          <div className="flex items-end justify-center gap-1.5 pb-0.5">
            {/* Miejscowość */}
            <span className="inline-block border-b border-dotted border-black px-2 font-sans font-medium text-[13.5px] min-w-[120px] text-center">
              {data.miejscowosc || 'Ruda Śląska'}
            </span>
            <span className="text-[13px] whitespace-nowrap">dnia</span>
            {/* Data (dzień i miesiąc) */}
            <span className="inline-block border-b border-dotted border-black px-1.5 font-sans font-medium text-[13.5px] min-w-[70px] text-center">
              {dayMonthVal || '24.10'}
            </span>
            {/* Rok */}
            <span className="whitespace-nowrap font-sans font-medium text-[13.5px]">
              {data.rokWniosku || '2025'} r.
            </span>
          </div>
          <div className="text-[11px] text-black mt-0.5 text-center">
            (miejscowość, data)
          </div>
        </div>
      </div>

      {/* TYTUŁ DOKUMENTU */}
      <div className="text-center my-6 space-y-1">
        <h1 className="text-lg sm:text-[19px] font-bold tracking-[0.25em] uppercase">
          O Ś W I A D C Z E N I E
        </h1>
        <h2 className="text-[14px] sm:text-[15px] font-semibold">
          o dochodach rodziny pracownika występującego z wnioskiem
          <br />o otrzymanie pomocy z ZFŚS w {data.rokWniosku || '2025'} roku
        </h2>
        <h3 className="text-[13px] italic pt-1">
          za okres trzech miesięcy poprzedzających złożenie wniosku o dofinansowanie
        </h3>
      </div>

      {/* TREŚĆ OŚWIADCZENIA */}
      <div className="space-y-3.5 text-justify">
        <p className="indent-6">
          Uprzedzony o odpowiedzialności karnej za składanie fałszywych zeznań, oświadczam że:
        </p>

        {/* Fragment okresu miesięcy */}
        <p className="indent-6 leading-relaxed">
          w okresie trzech miesięcy poprzedzających złożenie wniosku, tj.{' '}
          <span className="font-semibold px-1 py-0.2 bg-amber-50/70 print:bg-transparent font-sans">
            …{data.okresMiesiecy || '09 – 11.2025'}..r
          </span>{' '}
          ( wypłacone w m-cach )
        </p>

        {/* Punkt 1 */}
        <div className="flex flex-wrap items-baseline gap-1 leading-relaxed">
          <span>1. Moje dochody brutto z tytułu zatrudnienia w WUWER Sp. z o.o. wyniosły</span>
          <span className="inline-block min-w-[170px] flex-1 border-b border-dotted border-black text-center font-sans font-bold px-2">
            {dochodWuwerFmt ? `${dochodWuwerFmt}` : '..................................'}
          </span>
          <span>zł brutto.</span>
        </div>

        {/* Punkt 2 */}
        <div className="flex flex-wrap items-baseline gap-1 leading-relaxed">
          <span>2. Moje dochody z innych źródeł</span>
          <span className="inline-block min-w-[150px] border-b border-dotted border-black text-center font-sans px-2">
            {data.inneZrodlaOpis || '………………………………'}
          </span>
          <span>wyniosły</span>
          <span className="inline-block min-w-[150px] flex-1 border-b border-dotted border-black text-center font-sans font-bold px-2">
            {dochodInneFmt ? `${dochodInneFmt}` : '...........................................'}
          </span>
          <span>zł brutto.</span>
        </div>

        {/* Punkt 3 */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-baseline gap-1 leading-relaxed">
            <span>3. Dochody osób prowadzących ze mną wspólne gospodarstwo domowe wyniosły</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-1 leading-relaxed">
            <span className="inline-block min-w-[160px] border-b border-dotted border-black text-center font-sans font-bold px-2">
              {dochodWspolneFmt ? `${dochodWspolneFmt}` : '…......................................................'}
            </span>
            <span>zł brutto (słownie:</span>
          </div>

          {/* Słownie pod kropkami */}
          <div className="w-full border-b border-dotted border-black min-h-[24px] px-1 font-sans text-[12.5px] italic text-slate-900 leading-normal">
            {data.dochodWspolneSlownie ||
              '………………………………………………………………………………………………………………………'}
          </div>
          <div className="text-right text-[13px] leading-none">)</div>
        </div>

        {/* Adnotacja w nawiasie */}
        <p className="text-[12px] italic text-slate-700 print:text-black">
          (W oświadczeniu należy uwzględnić wszystkie dochody , bez względu na źródło ich pochodzenia).
        </p>

        {/* Ogółem dochód */}
        <div className="flex flex-wrap items-baseline gap-1 leading-relaxed pt-1">
          <span className="font-semibold">Ogółem dochód brutto w mojej rodzinie wyniósł</span>
          <span className="inline-block min-w-[220px] flex-1 border-b border-dotted border-black text-center font-sans font-bold text-[14.5px] px-2">
            {dochodOgolemFmt ? `${dochodOgolemFmt} zł` : '.................................................................................'}
          </span>
          <span>.</span>
        </div>

        {/* Ilość osób */}
        <div className="flex flex-wrap items-baseline gap-1 leading-relaxed pt-1">
          <span>
            Ilość osób w rodzinie prowadzących wraz ze mną wspólne gospodarstwo i utrzymujących się z tego dochodu
          </span>
          <span className="inline-block min-w-[180px] border-b border-dotted border-black text-center font-sans font-bold px-2">
            {data.iloscOsob ? (
              data.iloscOsob === 1
                ? '1 osoba'
                : data.iloscOsob >= 2 && data.iloscOsob <= 4
                ? `${data.iloscOsob} osoby`
                : `${data.iloscOsob} osób`
            ) : (
              '..............................................................'
            )}
          </span>
          <span>.</span>
        </div>

        {/* Zgoda RODO */}
        <p className="pt-2">
          Wyrażam zgodę na przetwarzanie powyższych informacji wyłącznie w celu zawartym w treści oświadczenia.
        </p>

        {/* Podpis pracownika wycentrowany pod kropkami */}
        <div className="flex justify-end pt-5 pb-2">
          <div className="w-[300px] text-center">
            <div className="min-h-[50px] border-b border-dotted border-black flex items-center justify-center relative">
              {data.podpisImage ? (
                <img
                  src={data.podpisImage}
                  alt="Podpis pracownika"
                  className="max-h-12 object-contain"
                />
              ) : (
                <span className="text-transparent select-none">.</span>
              )}
            </div>
            <div className="text-[11px] text-black mt-1 text-center">
              (podpis pracownika)
            </div>
          </div>
        </div>

        {/* Pouczenie */}
        <div className="pt-2 text-[11.5px] leading-tight space-y-0.5">
          <div className="font-bold underline">Pouczenie:</div>
          <p className="text-justify">
            W przypadku złożenia niezgodnego z prawdą oświadczenia o sytuacji materialnej i rodzinnej albo w przypadku wykorzystania świadczenia niezgodnie z jego przeznaczeniem, uprawniony zostaje wyłączony z prawa do korzystania ze środków Funduszu na 2 lata.
          </p>
        </div>

        {/* WYPEŁNIA PRACODAWCA (ramka na dole dokumentu) */}
        <div className="mt-4 border border-black p-3 text-[12px] space-y-2">
          <div className="font-bold text-[12.5px]">Wypełnia pracodawca:</div>
          <div className="flex flex-wrap items-baseline gap-1 leading-normal">
            <span>Średni dochód brutto przypadający na jedną osobę w rodzinie w okresie</span>
            <span className="inline-block border-b border-dotted border-black px-2 min-w-[120px] text-center font-sans font-semibold">
              {data.okresMiesiecy || '………………………………'}
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-1 leading-normal">
            <span>wyniósł</span>
            <span className="inline-block border-b border-dotted border-black px-2 min-w-[160px] text-center font-sans font-bold">
              {showEmployerCalculations && sredniNaOsobe
                ? `${sredniNaOsobe}`
                : '.............................................'}
            </span>
            <span>zł.</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-1 leading-normal pt-1">
            <span>Wysokość dofinansowania</span>
            <span className="inline-block border-b border-dotted border-black px-2 flex-1 min-w-[200px] text-center font-sans font-bold">
              {data.wysokoscDofinansowaniaPracodawca ||
                '..................................'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
