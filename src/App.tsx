/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Printer,
  Save,
  FolderOpen,
  FileDown,
  Sparkles,
  Calculator,
  Eye,
  Edit3,
  CheckCircle2,
  Building2,
  Calendar,
  DollarSign,
  Users,
  ShieldCheck,
  Github,
  Info,
  HelpCircle,
} from 'lucide-react';
import { CityAutocomplete } from './components/CityAutocomplete';
import { DatePickerWithWeekends } from './components/DatePickerWithWeekends';
import { HouseholdPersonsSelect, formatOsobyPL } from './components/HouseholdPersonsSelect';
import { SignaturePad } from './components/SignaturePad';
import { OfficialDocumentView, FormDataState } from './components/OfficialDocumentView';
import { kwotaSlowniePL, formatujPLN } from './utils/numberToWordsPL';
import { exportToWordDoc } from './utils/exportWord';

const INITIAL_STATE: FormDataState = {
  miejscowosc: 'Ruda Śląska',
  dataWniosku: '24.10.2025',
  rokWniosku: '2025',
  imieNazwisko: '',
  stanowisko: '',
  dochodWuwer: '',
  inneZrodlaOpis: '',
  dochodInne: '',
  dochodWspolne: '',
  dochodWspolneSlownie: '',
  iloscOsob: 4,
  ogolemDochod: '',
  podpisImage: '',
};

export default function App() {
  const [formData, setFormData] = useState<FormDataState>(INITIAL_STATE);
  const [autoSlownie, setAutoSlownie] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);

  // Auto-przeliczanie kwoty słownie dla pkt 3: Dochody osób prowadzących wspólne gospodarstwo domowe
  useEffect(() => {
    if (autoSlownie && formData.dochodWspolne) {
      const slownie = kwotaSlowniePL(formData.dochodWspolne);
      setFormData((prev) => ({
        ...prev,
        dochodWspolneSlownie: slownie,
      }));
    } else if (autoSlownie && !formData.dochodWspolne) {
      setFormData((prev) => ({
        ...prev,
        dochodWspolneSlownie: '',
      }));
    }
  }, [formData.dochodWspolne, autoSlownie]);

  // Auto-przeliczanie sumy ogólnej: pkt 1 (WUWER) + pkt 2 (inne źródła) + pkt 3 (wspólne gospodarstwo)
  useEffect(() => {
    const parseNumber = (val: string) => {
      if (!val) return 0;
      const clean = val.toString().replace(/\s+/g, '').replace(',', '.');
      const n = parseFloat(clean);
      return isNaN(n) ? 0 : n;
    };

    const w1 = parseNumber(formData.dochodWuwer);
    const w2 = parseNumber(formData.dochodInne);
    const w3 = parseNumber(formData.dochodWspolne);

    const total = w1 + w2 + w3;
    if (w1 > 0 || w2 > 0 || w3 > 0) {
      setFormData((prev) => ({
        ...prev,
        ogolemDochod: total.toFixed(2),
      }));
    }
  }, [formData.dochodWuwer, formData.dochodInne, formData.dochodWspolne]);

  // Gdy użytkownik zmieni "Rok oświadczenia", synchronizuj również rok w dacie
  const handleRokChange = (newYear: string) => {
    setFormData((prev) => {
      let updatedDataWniosku = prev.dataWniosku;
      if (updatedDataWniosku.includes('.')) {
        const parts = updatedDataWniosku.split('.');
        if (parts.length >= 2) {
          updatedDataWniosku = `${parts[0]}.${parts[1]}.${newYear}`;
        }
      }
      return {
        ...prev,
        rokWniosku: newYear,
        dataWniosku: updatedDataWniosku,
      };
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Ładowanie przykładowych danych ze skanu PDF
  const zaladujDaneZPdf = () => {
    setFormData({
      miejscowosc: 'Ruda Śląska',
      dataWniosku: '24.10.2025',
      rokWniosku: '2025',
      imieNazwisko: 'Jan Kowalski',
      stanowisko: 'Starszy Monter Konstrukcji',
      dochodWuwer: '14250.00',
      inneZrodlaOpis: 'brak',
      dochodInne: '0.00',
      dochodWspolne: '33825.45',
      dochodWspolneSlownie:
        'trzydzieści trzy tysiące osiemset dwadzieścia pięć złotych czterdzieści pięć groszy',
      iloscOsob: 4,
      ogolemDochod: '48075.45',
      podpisImage: '',
    });
    setAutoSlownie(true);
    showToast('Wypełniono danymi wzorcowymi z PDF');
  };

  // 1. Drukuj (PDF)
  const drukujPDF = () => {
    window.print();
  };

  // 2. Zapisz plik (JSON)
  const zapiszPlikJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const fileName = `oswiadczenie_zfss_${formData.imieNazwisko ? formData.imieNazwisko.replace(/\s+/g, '_') : 'pracownik'}_${formData.rokWniosku}.json`;
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Zapisano plik: ${fileName}`);
  };

  // 3. Otwórz plik (JSON)
  const otworzPlikJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setFormData({ ...INITIAL_STATE, ...parsed });
        showToast('Pomyślnie wczytano dane z pliku!');
      } catch (err) {
        alert('Błąd podczas odczytu pliku JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 4. Zapisz do pliku "Word"
  const zapiszDoWord = () => {
    exportToWordDoc(formData);
    showToast('Pobrano plik w formacie Word (.doc)');
  };

  return (
    <div className="min-h-screen bg-[#060b13] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30">
      {/* Toast powiadomień */}
      {toastMessage && (
        <div className="no-print fixed bottom-6 right-6 z-50 bg-[#0e182a] text-amber-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm border border-amber-500/30 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* GÓRNY PASEK NARZĘDZIOWY - styl ciemnego kokpitu jak na załączonym wzorze */}
      <header className="no-print bg-[#09101d] border-b border-[#17253d] sticky top-0 z-40 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Logo i Tytuł */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0e182a] border border-[#1e2d4a] flex items-center justify-center text-amber-400 shadow-inner">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-white tracking-tight">
                  Formularz ZFŚS
                </span>
                <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/25 uppercase">
                  WUWER Sp. z o.o.
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Oświadczenie o dochodach rodziny pracownika z rokiem {formData.rokWniosku}
              </p>
            </div>
          </div>

          {/* DOKŁADNE PRZYCISKI ZGODNIE Z POLECENIEM:
              „Drukuj (PDF)”, „zapisz plik”, „otwórz plik” (json), zapisz do pliku „Word” */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Drukuj (PDF) */}
            <button
              type="button"
              onClick={drukujPDF}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all active:scale-95"
              title="Drukuj lub zapisz jako czysty PDF na standardowym arkuszu A4"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Drukuj (PDF)</span>
            </button>

            {/* zapisz plik (json) */}
            <button
              type="button"
              onClick={zapiszPlikJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#0e182a] hover:bg-[#132038] text-slate-200 border border-[#1e2d4a] transition-all"
              title="Zapisz wypełniony formularz do pliku JSON na swoim komputerze"
            >
              <Save className="w-3.5 h-3.5 text-amber-400" />
              <span>zapisz plik</span>
            </button>

            {/* otwórz plik (json) */}
            <label
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#0e182a] hover:bg-[#132038] text-slate-200 border border-[#1e2d4a] transition-all cursor-pointer"
              title="Otwórz wcześniej zapisany plik JSON"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>otwórz plik</span>
              <input
                type="file"
                accept=".json"
                onChange={otworzPlikJSON}
                className="hidden"
              />
            </label>

            {/* zapisz do pliku „Word” */}
            <button
              type="button"
              onClick={zapiszDoWord}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#0e182a] hover:bg-[#132038] text-slate-200 border border-[#1e2d4a] transition-all"
              title="Pobierz dokument w formacie Word (.doc)"
            >
              <FileDown className="w-3.5 h-3.5 text-sky-400" />
              <span>zapisz do pliku „Word”</span>
            </button>

            {/* Wypełnij przykładowe z PDF */}
            <button
              type="button"
              onClick={zaladujDaneZPdf}
              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-[#132038] rounded-xl transition-colors border border-transparent hover:border-[#1e2d4a]"
              title="Wypełnij danymi z załączonego wzorca PDF"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
            </button>

            {/* Bezpieczeństwo i pamięć lokalna */}
            <button
              type="button"
              onClick={() => setShowPrivacyModal(true)}
              className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-colors"
              title="Informacja o prywatności danych: dane są wyłącznie w pamięci przeglądarki"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Przełącznik widoków (Edycja / Podgląd A4) na ekranach mobilnych */}
        <div className="border-t border-[#17253d] bg-[#070d18] px-4 py-1.5 flex items-center justify-between xl:hidden">
          <span className="text-xs text-slate-400 font-medium">Widok:</span>
          <div className="inline-flex rounded-xl p-0.5 bg-[#09101d] border border-[#17253d] text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'form'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Edit3 className="w-3 h-3" />
                Formularz
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'preview'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Eye className="w-3 h-3" />
                Podgląd A4
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Główna sekcja */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* LEWA KOLUMNA: Panele formularza w stylu ciemnoniebieskich kapsuł z żółtymi akcentami */}
        <section
          className={`no-print xl:col-span-5 space-y-4 ${
            activeTab === 'preview' ? 'hidden xl:block' : 'block'
          }`}
        >
          {/* KARTA GŁÓWNA: Rok oświadczenia (ZMIENIA WSZĘDZIE ROK) + informacja o wyliczanym okresie */}
          <div className="bg-[#0b1424] rounded-2xl p-4 sm:p-5 border border-[#1e2d4a] shadow-xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#17253d]">
              <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-white">
                  Rok oświadczenia (steruje całym dokumentem)
                </h2>
                <p className="text-xs text-slate-400">
                  Wpisany tutaj rok automatycznie aktualizuje wszystkie miejsca w oświadczeniu
                </p>
              </div>
            </div>

            {/* Pole ROK OŚWIADCZENIA */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Rok oświadczenia (np. 2025, 2026)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.rokWniosku}
                  onChange={(e) => handleRokChange(e.target.value)}
                  placeholder="2025"
                  className="w-full pl-3.5 pr-20 py-2.5 text-base bg-[#09101d] border border-amber-500/40 rounded-xl text-amber-300 font-mono font-black focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all shadow-inner"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-amber-400/70">
                  rok
                </span>
              </div>
            </div>

            {/* Pokaż wynikowy zapis okresu: „w okresie trzech miesięcy poprzedzających złożenie wniosku, tj. 09 – 11.2026..r (wypłacone w m-cach)” */}
            <div className="p-3 bg-[#070d18] rounded-xl border border-[#17253d] space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Zapis w treści oświadczenia:
              </span>
              <p className="text-xs font-semibold text-amber-300 font-mono">
                w okresie trzech miesięcy poprzedzających złożenie wniosku, tj. 09 – 11.{formData.rokWniosku || '2025'}..r (wypłacone w m-cach)
              </p>
            </div>
          </div>

          {/* KARTA 2: Dane wnioskodawcy i nagłówek */}
          <div className="bg-[#0b1424] rounded-2xl p-4 sm:p-5 border border-[#1e2d4a] shadow-xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#17253d]">
              <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-white">
                  Dane wnioskodawcy
                </h2>
                <p className="text-xs text-slate-400">
                  Miejscowość, data oraz imię, nazwisko i stanowisko
                </p>
              </div>
            </div>

            {/* Miejscowość */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Miejscowość (domyślnie: Ruda Śląska)
              </label>
              <CityAutocomplete
                value={formData.miejscowosc}
                onChange={(val) => setFormData({ ...formData, miejscowosc: val })}
              />
            </div>

            {/* Data (bez wyboru roku w kalendarzu, rok sterowany globalnie) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Data wniosku (kalendarz z odznaczonym weekendem So/Nd)
              </label>
              <DatePickerWithWeekends
                value={formData.dataWniosku}
                selectedYear={formData.rokWniosku}
                onChange={(val) => setFormData({ ...formData, dataWniosku: val })}
              />
            </div>

            {/* Imię i nazwisko */}
            <div className="pt-2 border-t border-[#17253d]">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Imię i nazwisko pracownika
              </label>
              <input
                type="text"
                value={formData.imieNazwisko}
                onChange={(e) => setFormData({ ...formData, imieNazwisko: e.target.value })}
                placeholder="np. Jan Kowalski"
                className="w-full px-3.5 py-2.5 text-sm bg-[#09101d] border border-[#1e2d4a] rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all shadow-inner font-semibold"
              />
            </div>

            {/* Stanowisko */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Stanowisko
              </label>
              <input
                type="text"
                value={formData.stanowisko}
                onChange={(e) => setFormData({ ...formData, stanowisko: e.target.value })}
                placeholder="np. Monter konstrukcji / Operator CNC"
                className="w-full px-3.5 py-2.5 text-sm bg-[#09101d] border border-[#1e2d4a] rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* KARTA 3: Wykaz dochodów brutto & Kwota słownie & Auto-suma */}
          <div className="bg-[#0b1424] rounded-2xl p-4 sm:p-5 border border-[#1e2d4a] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#17253d]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-white">
                    Wykaz dochodów brutto
                  </h2>
                  <p className="text-xs text-slate-400">
                    Pkt 1, 2, 3 z automatyczną sumą i kwotą słownie
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Calculator className="w-3 h-3 text-amber-400" /> Auto-suma
              </span>
            </div>

            {/* Pkt 1: Dochody WUWER */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                1. Dochody brutto z tytułu zatrudnienia w WUWER Sp. z o.o.
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.dochodWuwer}
                  onChange={(e) => setFormData({ ...formData, dochodWuwer: e.target.value })}
                  placeholder="np. 14250,00"
                  className="w-full pl-3.5 pr-20 py-2.5 text-sm bg-[#09101d] border border-[#1e2d4a] rounded-xl text-slate-100 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all shadow-inner"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">
                  zł brutto
                </span>
              </div>
            </div>

            {/* Pkt 2: Dochody z innych źródeł */}
            <div className="p-3 bg-[#070d18] rounded-xl space-y-2 border border-[#17253d]">
              <label className="block text-xs font-bold text-slate-300">
                2. Dochody z innych źródeł (opcjonalnie)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.inneZrodlaOpis}
                  onChange={(e) => setFormData({ ...formData, inneZrodlaOpis: e.target.value })}
                  placeholder="Źródło (np. zlecenie, brak)"
                  className="w-full px-3 py-2 text-xs bg-[#09101d] border border-[#1e2d4a] rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
                <div className="relative">
                  <input
                    type="text"
                    value={formData.dochodInne}
                    onChange={(e) => setFormData({ ...formData, dochodInne: e.target.value })}
                    placeholder="0,00"
                    className="w-full pl-3 pr-10 py-2 text-xs bg-[#09101d] border border-[#1e2d4a] rounded-xl text-slate-100 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <span className="absolute right-2.5 top-2 text-xs font-bold text-slate-400">
                    zł
                  </span>
                </div>
              </div>
            </div>

            {/* Pkt 3: Wspólne gospodarstwo domowe + Kwota Słownie */}
            <div className="space-y-2.5 p-3.5 bg-[#0e182a] rounded-xl border border-amber-500/25">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-200">
                  3. Dochody osób ze wspólnego gospodarstwa domowego
                </label>
                <div className="flex items-center gap-1.5 text-xs">
                  <input
                    type="checkbox"
                    id="auto-slownie-toggle"
                    checked={autoSlownie}
                    onChange={(e) => setAutoSlownie(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                  />
                  <label htmlFor="auto-slownie-toggle" className="text-[11px] font-bold text-amber-300 cursor-pointer">
                    Auto-słownie
                  </label>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={formData.dochodWspolne}
                  onChange={(e) => setFormData({ ...formData, dochodWspolne: e.target.value })}
                  placeholder="np. 33825,45"
                  className="w-full pl-3.5 pr-20 py-2.5 text-sm bg-[#09101d] border border-amber-500/40 rounded-xl text-amber-200 font-mono font-black focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all shadow-inner"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">
                  zł brutto
                </span>
              </div>

              {/* Słownie */}
              <div className="mt-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Zapis słowny (odmienia się automatycznie po polsku):
                  </span>
                  {!autoSlownie && (
                    <span className="text-[10px] text-amber-300 bg-amber-400/20 px-2 py-0.2 rounded font-semibold">
                      Tryb ręczny
                    </span>
                  )}
                </div>
                <textarea
                  rows={2}
                  value={formData.dochodWspolneSlownie}
                  readOnly={autoSlownie}
                  onChange={(e) => setFormData({ ...formData, dochodWspolneSlownie: e.target.value })}
                  placeholder="Tutaj automatycznie pojawi się kwota słownie..."
                  className={`w-full p-2.5 text-xs rounded-xl border font-serif italic ${
                    autoSlownie
                      ? 'bg-[#09101d] border-[#1e2d4a] text-slate-300 cursor-default'
                      : 'bg-[#070d18] border-amber-500 text-white focus:ring-2 focus:ring-amber-500'
                  }`}
                />
              </div>
            </div>

            {/* Suma: Ogółem dochód brutto */}
            <div className="p-4 bg-[#070d18] border border-[#1e2d4a] rounded-xl flex items-center justify-between shadow-inner">
              <div>
                <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wide block">
                  Ogółem dochód brutto w rodzinie:
                </span>
                <span className="text-[11px] text-slate-500">
                  suma pkt 1 + 2 + 3
                </span>
              </div>
              <span className="text-xl font-mono font-black text-amber-400">
                {formData.ogolemDochod ? `${formatujPLN(formData.ogolemDochod)} zł` : '0,00 zł'}
              </span>
            </div>
          </div>

          {/* KARTA 4: Skład rodziny (1-20 osób) & Podpis */}
          <div className="bg-[#0b1424] rounded-2xl p-4 sm:p-5 border border-[#1e2d4a] shadow-xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#17253d]">
              <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-white">
                  Skład rodziny i podpis pracownika
                </h2>
                <p className="text-xs text-slate-400">
                  Wybór osób (1 do 20) oraz podpis cyfrowy
                </p>
              </div>
            </div>

            {/* Lista 1-20 osób */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Ilość osób w rodzinie (wspólne gospodarstwo)
                </label>
                <span className="text-xs font-black text-amber-400">
                  {formatOsobyPL(formData.iloscOsob)}
                </span>
              </div>
              <HouseholdPersonsSelect
                value={formData.iloscOsob}
                onChange={(num) => setFormData({ ...formData, iloscOsob: num })}
              />
            </div>

            {/* Podpis pracownika */}
            <div className="pt-2 border-t border-[#17253d]">
              <SignaturePad
                signatureData={formData.podpisImage}
                typedName={formData.imieNazwisko}
                onSignatureChange={(url) => setFormData({ ...formData, podpisImage: url })}
              />
            </div>
          </div>
        </section>

        {/* PRAWA KOLUMNA: Oryginalny biały druk dokumentu A4 */}
        <section
          className={`xl:col-span-7 flex flex-col items-center ${
            activeTab === 'form' ? 'hidden xl:flex' : 'flex'
          }`}
        >
          {/* Pasek kontrolny nad podglądem */}
          <div className="no-print w-full flex items-center justify-between pb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-300">
                Podgląd na żywo oryginalnego druku A4 (zawsze biały)
              </span>
            </div>
            <button
              type="button"
              onClick={drukujPDF}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 hover:underline"
            >
              <Printer className="w-3.5 h-3.5" />
              Drukuj (PDF)
            </button>
          </div>

          {/* Kontener arkusza A4 - biały arkusz jak w oryginale */}
          <div className="w-full bg-[#0b1424] p-2 sm:p-6 rounded-2xl border border-[#17253d] flex justify-center shadow-2xl overflow-x-auto">
            <OfficialDocumentView data={formData} />
          </div>
        </section>
      </main>

      {/* MODAL: Informacja o prywatności i pamięci przeglądarki */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1424] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#1e2d4a] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#17253d]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Prywatność danych (Pamięć przeglądarki)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Potwierdzenie bezpieczeństwa danych
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                <strong>Tak, dokładnie tak!</strong> Wszystkie dane, które wpisujesz w ten formularz, znajdują się <strong>wyłącznie w pamięci podręcznej Twojej przeglądarki</strong> na Twoim urządzeniu.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li>
                  Żadne dane dochodowe ani osobowe <strong>nigdy nie są wysyłane</strong> na stronę GitHub ani do żadnego zewnętrznego serwera.
                </li>
                <li>
                  Repozytorium GitHub zawiera wyłącznie kod programu (HTML, CSS, JavaScript).
                </li>
                <li>
                  Jeśli chcesz zachować wniosek, użyj przycisku <strong>„zapisz plik” (JSON)</strong> lub <strong>„zapisz do pliku Word”</strong>, a plik zapisze się tylko na Twoim dysku.
                </li>
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition-colors"
              >
                Rozumiem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
