/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Download,
  Upload,
  RotateCcw,
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
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { CityAutocomplete } from './components/CityAutocomplete';
import { DatePickerWithWeekends } from './components/DatePickerWithWeekends';
import { PeriodPicker } from './components/PeriodPicker';
import { HouseholdPersonsSelect, formatOsobyPL } from './components/HouseholdPersonsSelect';
import { SignaturePad } from './components/SignaturePad';
import { OfficialDocumentView, FormDataState } from './components/OfficialDocumentView';
import { kwotaSlowniePL, formatujPLN } from './utils/numberToWordsPL';

const INITIAL_STATE: FormDataState = {
  miejscowosc: 'Ruda Śląska',
  dataWniosku: '24.10.2025',
  rokWniosku: '2025',
  imieNazwisko: '',
  stanowisko: '',
  okresMiesiecy: '09 – 11.2025',
  dochodWuwer: '',
  inneZrodlaOpis: '',
  dochodInne: '',
  dochodWspolne: '',
  dochodWspolneSlownie: '',
  iloscOsob: 4,
  ogolemDochod: '',
  podpisImage: '',
  sredniDochodNaOsobePracodawca: '',
  wysokoscDofinansowaniaPracodawca: '',
};

export default function App() {
  const [formData, setFormData] = useState<FormDataState>(INITIAL_STATE);
  const [autoSlownie, setAutoSlownie] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'form' | 'preview' | 'split'>('split');
  const [showGithubModal, setShowGithubModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Ładowanie przykładowych danych dokładnie z załączonego PDF-a
  const zaladujDaneZPdf = () => {
    setFormData({
      miejscowosc: 'Ruda Śląska',
      dataWniosku: '24.10.2025',
      rokWniosku: '2025',
      imieNazwisko: 'Jan Kowalski',
      stanowisko: 'Starszy Monter Konstrukcji',
      okresMiesiecy: '09 – 11.2025',
      dochodWuwer: '14250.00',
      inneZrodlaOpis: 'brak',
      dochodInne: '0.00',
      dochodWspolne: '33825.45',
      dochodWspolneSlownie:
        'trzydzieści trzy tysiące osiemset dwadzieścia pięć złotych czterdzieści pięć groszy',
      iloscOsob: 4,
      ogolemDochod: '48075.45',
      podpisImage: '',
      sredniDochodNaOsobePracodawca: '',
      wysokoscDofinansowaniaPracodawca: '',
    });
    setAutoSlownie(true);
    showToast('Wypełniono formularz danymi z wzoru PDF (33 825,45 zł, 4 osoby, Ruda Śląska)');
  };

  const wyczyscFormularz = () => {
    if (confirm('Czy na pewno chcesz zresetować formularz?')) {
      setFormData(INITIAL_STATE);
      showToast('Formularz został wyczyszczony.');
    }
  };

  const drukujDokument = () => {
    window.print();
  };

  const pobierzJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `oswiadczenie_zfss_${formData.imieNazwisko.replace(/\s+/g, '_') || 'wuwer'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Pobrano dane formularza jako plik JSON.');
  };

  const wczytajJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setFormData({ ...INITIAL_STATE, ...parsed });
        showToast('Pomyślnie załadowano dane z pliku JSON!');
      } catch (err) {
        alert('Błąd odczytu pliku JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Toast powiadomień */}
      {toastMessage && (
        <div className="no-print fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Górny Pasek Narzędziowy / Header */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                  Formularz ZFŚS
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  WUWER Sp. z o.o.
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Oświadczenie o dochodach rodziny pracownika (wersja do druku i na GitHub)
              </p>
            </div>
          </div>

          {/* Przyciski Akcji Głównej */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              type="button"
              onClick={zaladujDaneZPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors shadow-2xs"
              title="Wypełnij danymi z załączonego skanu PDF"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">Wypełnij z</span> PDF
            </button>

            <button
              type="button"
              onClick={drukujDokument}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
              title="Drukuj lub zapisz jako PDF na standardowym arkuszu A4"
            >
              <Printer className="w-4 h-4" />
              <span>Drukuj / Zapisz PDF</span>
            </button>

            {/* Menu dodatkowe: JSON / Reset / GitHub */}
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              <label
                className="cursor-pointer p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Wczytaj wniosek z pliku JSON"
              >
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept=".json"
                  onChange={wczytajJSON}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={pobierzJSON}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Pobierz wypełniony wniosek jako JSON"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={wyczyscFormularz}
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Wyczyść wszystkie pola"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowGithubModal(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors ml-1"
                title="Informacje o wdrożeniu na GitHub / GitHub Pages"
              >
                <Github className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">GitHub</span>
              </button>
            </div>
          </div>
        </div>

        {/* Przełącznik widoków dla tabletów/telefonów */}
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-1.5 flex items-center justify-between xl:hidden">
          <span className="text-xs text-slate-500 font-medium">Tryb wyświetlania:</span>
          <div className="inline-flex rounded-lg p-0.5 bg-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'form' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5" />
                Edycja
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'preview' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Podgląd A4
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Główna Treść: Lewa strona Formularz, Prawa strona Oficjalny Dokument A4 */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* LEWA KOLUMNA: Interaktywny Formularz z Wymaganiami */}
        <section
          className={`no-print xl:col-span-5 space-y-5 ${
            activeTab === 'preview' ? 'hidden xl:block' : 'block'
          }`}
        >
          {/* Karta informacyjna */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building2 className="w-5 h-5 text-blue-600" />
              <div>
                <h2 className="font-bold text-sm text-slate-900">
                  Dane wnioskodawcy i nagłówek
                </h2>
                <p className="text-xs text-slate-500">
                  Miejscowość, data z kalendarzem i dane pracownika
                </p>
              </div>
            </div>

            {/* 1. Miejscowość i Data (Wycentrowane pod kropkami w dokumencie) */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Miejscowość (wyszukiwarka z bazy miast, domyślnie: Ruda Śląska)
                </label>
                <CityAutocomplete
                  value={formData.miejscowosc}
                  onChange={(val) => setFormData({ ...formData, miejscowosc: val })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Data (kalendarz z weekendami So/Nd)
                  </label>
                  <DatePickerWithWeekends
                    value={formData.dataWniosku}
                    onChange={(val) => setFormData({ ...formData, dataWniosku: val })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rok oświadczenia
                  </label>
                  <input
                    type="text"
                    value={formData.rokWniosku}
                    onChange={(e) => setFormData({ ...formData, rokWniosku: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2025"
                  />
                </div>
              </div>
            </div>

            {/* Imię, nazwisko i stanowisko */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Imię i nazwisko pracownika
                </label>
                <input
                  type="text"
                  value={formData.imieNazwisko}
                  onChange={(e) => setFormData({ ...formData, imieNazwisko: e.target.value })}
                  placeholder="np. Jan Kowalski"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Stanowisko
                </label>
                <input
                  type="text"
                  value={formData.stanowisko}
                  onChange={(e) => setFormData({ ...formData, stanowisko: e.target.value })}
                  placeholder="np. Monter konstrukcji / Operator CNC"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Karta: Okres 3 miesięcy poprzedzających wniosek */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <h2 className="font-bold text-sm text-slate-900">
                  Okres wniosku (3 miesiące)
                </h2>
                <p className="text-xs text-slate-500">
                  Wybór tylko miesięcy i roku z wyróżnionym przyciskiem 09 – 11
                </p>
              </div>
            </div>

            <PeriodPicker
              value={formData.okresMiesiecy}
              onChange={(val) => setFormData({ ...formData, okresMiesiecy: val })}
            />
          </div>

          {/* Karta: Dochody i Automatyczne Przeliczenia */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <div>
                  <h2 className="font-bold text-sm text-slate-900">
                    Wykaz dochodów brutto
                  </h2>
                  <p className="text-xs text-slate-500">
                    Pkt 1, 2, 3 z automatyczną sumą i kwotą słownie
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Calculator className="w-3 h-3" /> Auto-suma
              </span>
            </div>

            {/* Pkt 1: Dochody WUWER */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                1. Moje dochody brutto z tytułu zatrudnienia w WUWER Sp. z o.o.
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.dochodWuwer}
                  onChange={(e) => setFormData({ ...formData, dochodWuwer: e.target.value })}
                  placeholder="np. 14250,00"
                  className="w-full pl-3 pr-14 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                  zł brutto
                </span>
              </div>
            </div>

            {/* Pkt 2: Inne źródła */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200/60">
              <label className="block text-xs font-bold text-slate-800">
                2. Moje dochody z innych źródeł (opcjonalne)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.inneZrodlaOpis}
                  onChange={(e) => setFormData({ ...formData, inneZrodlaOpis: e.target.value })}
                  placeholder="Jakie źródła? (np. zlecenie, brak)"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="relative">
                  <input
                    type="text"
                    value={formData.dochodInne}
                    onChange={(e) => setFormData({ ...formData, dochodInne: e.target.value })}
                    placeholder="0,00"
                    className="w-full pl-3 pr-12 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-2.5 top-1.5 text-xs font-bold text-slate-400">
                    zł
                  </span>
                </div>
              </div>
            </div>

            {/* Pkt 3: Wspólne gospodarstwo + SŁOWNIE */}
            <div className="space-y-2 p-3 bg-blue-50/50 rounded-xl border border-blue-200/70">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  3. Dochody osób ze wspólnego gospodarstwa domowego
                </label>
                <div className="flex items-center gap-1.5 text-xs">
                  <input
                    type="checkbox"
                    id="auto-slownie-toggle"
                    checked={autoSlownie}
                    onChange={(e) => setAutoSlownie(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="auto-slownie-toggle" className="text-[11px] font-semibold text-blue-900 cursor-pointer">
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
                  className="w-full pl-3 pr-14 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                  zł brutto
                </span>
              </div>

              {/* Pole słownie (automatycznie uzupełniane skryptem lub edycja ręczna) */}
              <div className="mt-1.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Zapis słowny (wypełnia się automatycznie wg polskiej gramatyki):
                  </span>
                  {!autoSlownie && (
                    <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-medium">
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
                  className={`w-full p-2 text-xs rounded-lg border font-serif italic ${
                    autoSlownie
                      ? 'bg-slate-100/80 border-slate-200 text-slate-800 cursor-default'
                      : 'bg-white border-blue-400 text-slate-900 focus:ring-2 focus:ring-blue-500'
                  }`}
                />
              </div>
            </div>

            {/* Suma: Ogółem dochód brutto */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-300 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wide">
                  Ogółem dochód brutto w mojej rodzinie:
                </span>
                <span className="text-[11px] font-medium text-emerald-800">
                  (suma pkt 1 + 2 + 3)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-mono font-black text-emerald-900">
                  {formData.ogolemDochod ? `${formatujPLN(formData.ogolemDochod)} zł` : '0,00 zł'}
                </span>
                <span className="text-xs text-slate-500 italic">
                  brutto za cały okres
                </span>
              </div>
            </div>
          </div>

          {/* Karta: Ilość osób w rodzinie & Podpis */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <h2 className="font-bold text-sm text-slate-900">
                  Skład rodziny i podpis
                </h2>
                <p className="text-xs text-slate-500">
                  Rozwijana lista od 1 do 20 osób oraz cyfrowy podpis
                </p>
              </div>
            </div>

            {/* Ilość osób */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-800">
                  Ilość osób we wspólnym gospodarstwie domowym
                </label>
                <span className="text-xs font-semibold text-blue-600">
                  {formatOsobyPL(formData.iloscOsob)}
                </span>
              </div>
              <HouseholdPersonsSelect
                value={formData.iloscOsob}
                onChange={(num) => setFormData({ ...formData, iloscOsob: num })}
              />
            </div>

            {/* Podpis pracownika */}
            <div className="pt-2 border-t border-slate-100">
              <SignaturePad
                signatureData={formData.podpisImage}
                typedName={formData.imieNazwisko}
                onSignatureChange={(url) => setFormData({ ...formData, podpisImage: url })}
              />
            </div>
          </div>
        </section>

        {/* PRAWA KOLUMNA: Wierne Odwzorowanie Dokumentu A4 ze skanu */}
        <section
          className={`xl:col-span-7 flex flex-col items-center ${
            activeTab === 'form' ? 'hidden xl:flex' : 'flex'
          }`}
        >
          {/* Belka informacyjna nad podglądem */}
          <div className="no-print w-full flex items-center justify-between pb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold text-slate-700">
                Podgląd na żywo oryginalnego druku A4
              </span>
            </div>
            <button
              type="button"
              onClick={drukujDokument}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
            >
              <Printer className="w-3.5 h-3.5" />
              Wydrukuj formularz
            </button>
          </div>

          {/* Kontener arkusza A4 */}
          <div className="w-full bg-slate-200/70 p-2 sm:p-6 rounded-2xl flex justify-center shadow-inner overflow-x-auto">
            <OfficialDocumentView data={formData} showEmployerCalculations={true} />
          </div>
        </section>
      </main>

      {/* Modal Wdrożenia na GitHub */}
      {showGithubModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-900 text-white rounded-xl">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Formularz gotowy do GitHub
                  </h3>
                  <p className="text-xs text-slate-500">
                    Instrukcja uruchomienia i wdrożenia na GitHub Pages
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGithubModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 space-y-3">
              <p>
                Ten projekt to czysta aplikacja <strong>React + Vite + TypeScript</strong>, idealnie zoptymalizowana pod publikację na <strong>GitHub Pages</strong> lub dowolny hosting statyczny (Vercel, Cloudflare, Netlify).
              </p>

              <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-xs space-y-1.5 overflow-x-auto">
                <div className="text-slate-400"># 1. Klonowanie i instalacja</div>
                <div>git clone &lt;twoje-repo&gt;</div>
                <div>npm install</div>
                <div className="text-slate-400 pt-1"># 2. Uruchomienie lokalne</div>
                <div>npm run dev</div>
                <div className="text-slate-400 pt-1"># 3. Zbudowanie wersji produkcyjnej do GitHub Pages</div>
                <div>npm run build</div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
                <span className="font-bold block">Wszystkie żądane skrypty platformy:</span>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Centrowane pod kropkami pola miejscowość i data</li>
                  <li>Autouzupełnianie miejscowości z bazy (domyślnie Ruda Śląska)</li>
                  <li>Kalendarz z zaznaczonymi weekendami (So/Nd), przyciskiem &quot;Dzisiaj&quot; i rokiem</li>
                  <li>Ograniczony selektor okresu z przyciskiem 09 – 11.2025 r.</li>
                  <li>Automatyczna zamiana kwot na słownie w języku polskim</li>
                  <li>Automatyczna suma dochodów brutto</li>
                  <li>Lista rozwijana od 1 do 20 osób z polską odmianą</li>
                  <li>Gotowy do druku format arkusza A4</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowGithubModal(false)}
                className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
