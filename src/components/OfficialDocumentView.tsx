import React from 'react';
import { formatujPLN } from '../utils/numberToWordsPL';

export interface FormDataState {
  miejscowosc: string;
  dataWniosku: string; // e.g. "24.10.2025"
  rokWniosku: string; // "2025" - master year that controls everywhere
  imieNazwisko: string;
  stanowisko: string;
  dochodWuwerM1: string; // miesiąc 09
  dochodWuwerM2: string; // miesiąc 10
  dochodWuwerM3: string; // miesiąc 11
  dochodWuwer: string; // suma 3 miesięcy
  inneZrodlaOpis: string; // np. "zlecenie", "brak"
  dochodInne: string; // "0,00"
  dochodWspolne: string; // "33 825,45"
  dochodWspolneSlownie: string;
  iloscOsob: number; // 4
  ogolemDochod: string; // obliczony automatycznie lub ręczny
  podpisImage: string;
}

interface OfficialDocumentViewProps {
  data: FormDataState;
}

export const OfficialDocumentView: React.FC<OfficialDocumentViewProps> = ({
  data,
}) => {
  // Format numeric values cleanly
  const dochodWuwerFmt = data.dochodWuwer ? formatujPLN(data.dochodWuwer) : '';
  const dochodInneFmt = data.dochodInne ? formatujPLN(data.dochodInne) : '';
  const dochodWspolneFmt = data.dochodWspolne ? formatujPLN(data.dochodWspolne) : '';
  const dochodOgolemFmt = data.ogolemDochod ? formatujPLN(data.ogolemDochod) : '';

  // Extract day and month for "dnia ....................... <ROK> r."
  const extractDayMonth = () => {
    if (!data.dataWniosku) return '';
    if (data.dataWniosku.includes('.')) {
      const parts = data.dataWniosku.split('.');
      if (parts.length >= 2) {
        return `${parts[0]}.${parts[1]}`;
      }
    }
    return data.dataWniosku;
  };

  const dayMonthVal = extractDayMonth();
  const rok = data.rokWniosku || '2025';

  return (
    <div
      id="printable-document"
      className="a4-document bg-white text-black p-8 sm:p-11 shadow-2xl mx-auto rounded-none border border-slate-300 print:border-none print:shadow-none print:p-0 print:m-0 w-full max-w-[800px] font-serif text-[12.8px] leading-[1.55] select-text box-border"
      style={{
        fontFamily: '"Times New Roman", Times, Georgia, serif',
        paddingTop: '15mm',
      }}
    >
      {/* NAGŁÓWEK DOKUMENTU: Miejscowość, data (po prawej 1.5 cm od góry) & Imię, nazwisko, stanowisko (po lewej dokładnie 1.5 cm niżej) */}
      <div className="flex justify-between items-start gap-4 mb-4">
        {/* Lewa strona: Imię i nazwisko oraz stanowisko (obniżone dokładnie o 1.5 cm = 15mm) */}
        <div className="w-[48%] space-y-4 pt-[15mm]">
          {/* Imię i nazwisko */}
          <div className="text-center">
            <div className="min-h-[24px] border-b border-dotted border-black flex items-end justify-center px-2 pb-0.5 font-sans font-semibold text-[13.5px]">
              {data.imieNazwisko ? (
                <span className="text-black font-bold tracking-wide">{data.imieNazwisko}</span>
              ) : (
                <span className="text-transparent select-none">.</span>
              )}
            </div>
            <div className="text-[11px] text-black mt-0.5 text-center font-serif">
              (imię i nazwisko)
            </div>
          </div>

          {/* Stanowisko */}
          <div className="text-center pt-1">
            <div className="min-h-[22px] border-b border-dotted border-black flex items-end justify-center px-2 pb-0.5 font-sans font-medium text-[12.5px]">
              {data.stanowisko ? (
                <span className="text-black">{data.stanowisko}</span>
              ) : (
                <span className="text-transparent select-none">.</span>
              )}
            </div>
            <div className="text-[11px] text-black mt-0.5 text-center font-serif">
              (stanowisko)
            </div>
          </div>
        </div>

        {/* Prawa strona: Miejscowość i data - wycentrowane pod kropkami na samej górze */}
        <div className="w-[48%] text-center">
          <div className="flex items-end justify-center gap-1.5 pb-0.5">
            {/* Miejscowość */}
            <span className="inline-block border-b border-dotted border-black px-2 font-sans font-medium text-[13px] min-w-[120px] text-center">
              {data.miejscowosc || 'Ruda Śląska'}
            </span>
            <span className="text-[12.5px] whitespace-nowrap">dnia</span>
            {/* Data (dzień i miesiąc) */}
            <span className="inline-block border-b border-dotted border-black px-1.5 font-sans font-medium text-[13px] min-w-[65px] text-center">
              {dayMonthVal || '24.10'}
            </span>
            {/* Rok z głównego pola "Rok oświadczenia" */}
            <span className="whitespace-nowrap font-sans font-semibold text-[13px]">
              {rok} r.
            </span>
          </div>
          <div className="text-[11px] text-black mt-0.5 text-center font-serif">
            (miejscowość, data)
          </div>
        </div>
      </div>

      {/* TYTUŁ DOKUMENTU - z rokiem z głównego pola */}
      <div className="text-center my-4 space-y-0.5">
        <h1 className="text-base sm:text-[18px] font-bold tracking-[0.25em] uppercase">
          O Ś W I A D C Z E N I E
        </h1>
        <h2 className="text-[13.5px] sm:text-[14.5px] font-semibold leading-tight">
          o dochodach rodziny pracownika występującego z wnioskiem
          <br />o otrzymanie pomocy z ZFŚS w {rok} roku
        </h2>
        <h3 className="text-[12px] italic pt-0.5">
          za okres trzech miesięcy poprzedzających złożenie wniosku o dofinansowanie
        </h3>
      </div>

      {/* TREŚĆ OŚWIADCZENIA */}
      <div className="space-y-2.5 text-justify">
        <p className="indent-6">
          Uprzedzony o odpowiedzialności karnej za składanie fałszywych zeznań, oświadczam że:
        </p>

        {/* Okres miesięcy: 09 – 11.[ROK] r. ( wypłacone w m-cach ) */}
        <p className="indent-6 leading-relaxed">
          w okresie trzech miesięcy poprzedzających złożenie wniosku, tj.{' '}
          <span className="font-semibold font-sans">
            09 – 11.{rok} r.
          </span>{' '}
          ( wypłacone w m-cach )
        </p>

        {/* Punkt 1 - suma 3 miesięcy z WUWER Sp. z o.o. */}
        <div className="flex flex-wrap items-baseline gap-1 leading-relaxed">
          <span>1. Moje dochody brutto z tytułu zatrudnienia w WUWER Sp. z o.o. wyniosły</span>
          <span className="inline-block min-w-[160px] flex-1 border-b border-dotted border-black text-center font-sans font-bold px-2">
            {dochodWuwerFmt ? `${dochodWuwerFmt}` : '..................................'}
          </span>
          <span>zł brutto.</span>
        </div>

        {/* Punkt 2 */}
        <div className="flex flex-wrap items-baseline gap-1 leading-relaxed">
          <span>2. Moje dochody z innych źródeł</span>
          <span className="inline-block min-w-[140px] border-b border-dotted border-black text-center font-sans px-2">
            {data.inneZrodlaOpis || '………………………………'}
          </span>
          <span>wyniosły</span>
          <span className="inline-block min-w-[140px] flex-1 border-b border-dotted border-black text-center font-sans font-bold px-2">
            {dochodInneFmt ? `${dochodInneFmt}` : '...........................................'}
          </span>
          <span>zł brutto.</span>
        </div>

        {/* Punkt 3 */}
        <div className="space-y-0.5">
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
          <div className="w-full border-b border-dotted border-black min-h-[22px] px-1 font-sans text-[12px] italic text-black leading-tight">
            {data.dochodWspolneSlownie ||
              '………………………………………………………………………………………………………………………'}
          </div>
          <div className="text-right text-[12px] leading-none">)</div>
        </div>

        {/* Adnotacja w nawiasie */}
        <p className="text-[11.5px] italic text-slate-800 print:text-black">
          (W oświadczeniu należy uwzględnić wszystkie dochody , bez względu na źródło ich pochodzenia).
        </p>

        {/* Ogółem dochód */}
        <div className="flex flex-wrap items-baseline gap-1 leading-relaxed pt-0.5">
          <span className="font-semibold">Ogółem dochód brutto w mojej rodzinie wyniósł</span>
          <span className="inline-block min-w-[210px] flex-1 border-b border-dotted border-black text-center font-sans font-bold text-[14px] px-2">
            {dochodOgolemFmt ? `${dochodOgolemFmt} zł` : '.................................................................................'}
          </span>
          <span>.</span>
        </div>

        {/* Ilość osób */}
        <div className="flex flex-wrap items-baseline gap-1 leading-relaxed pt-0.5">
          <span>
            Ilość osób w rodzinie prowadzących wraz ze mną wspólne gospodarstwo i utrzymujących się z tego dochodu
          </span>
          <span className="inline-block min-w-[170px] border-b border-dotted border-black text-center font-sans font-bold px-2">
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
        <p className="pt-1 text-[12px]">
          Wyrażam zgodę na przetwarzanie powyższych informacji wyłącznie w celu zawartym w treści oświadczenia.
        </p>

        {/* Podpis pracownika wycentrowany pod kropkami */}
        <div className="flex justify-end pt-3 pb-1">
          <div className="w-[280px] text-center">
            <div className="min-h-[46px] border-b border-dotted border-black flex items-center justify-center relative">
              {data.podpisImage ? (
                <img
                  src={data.podpisImage}
                  alt="Podpis pracownika"
                  className="max-h-9 max-w-[150px] object-contain mx-auto"
                />
              ) : (
                <span className="text-transparent select-none">.</span>
              )}
            </div>
            <div className="text-[11px] text-black mt-0.5 text-center font-serif">
              (podpis pracownika)
            </div>
          </div>
        </div>

        {/* Pouczenie */}
        <div className="pt-1 text-[11px] leading-tight space-y-0.5">
          <div className="font-bold underline">Pouczenie:</div>
          <p className="text-justify">
            W przypadku złożenia niezgodnego z prawdą oświadczenia o sytuacji materialnej i rodzinnej albo w przypadku wykorzystania świadczenia niezgodnie z jego przeznaczeniem, uprawniony zostaje wyłączony z prawa do korzystania ze środków Funduszu na 2 lata.
          </p>
        </div>

        {/* WYPEŁNIA PRACODAWCA - wszystkie pola całkowicie puste (wyłącznie czyste linie kropkowane) */}
        <div className="mt-2.5 border border-black p-2.5 text-[11.5px] space-y-1.5">
          <div className="font-bold text-[12px]">Wypełnia pracodawca:</div>
          <div className="flex flex-wrap items-baseline gap-1 leading-normal">
            <span>Średni dochód brutto przypadający na jedną osobę w rodzinie w okresie</span>
            <span className="inline-block border-b border-dotted border-black px-2 flex-1 min-w-[120px] text-center font-sans">
              &nbsp;
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-1 leading-normal">
            <span>wyniósł</span>
            <span className="inline-block border-b border-dotted border-black px-2 flex-1 min-w-[160px] text-center font-sans">
              &nbsp;
            </span>
            <span>zł.</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-1 leading-normal pt-0.5">
            <span>Wysokość dofinansowania</span>
            <span className="inline-block border-b border-dotted border-black px-2 flex-1 min-w-[200px] text-center font-sans">
              &nbsp;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
