/**
 * Algorytm konwersji kwot liczbowych na słowny zapis w języku polskim.
 * Zgodny ze standardami prawno-księgowymi (odmiana: złoty/złote/złotych, grosz/grosze/groszy).
 * Obsługuje kwoty od 0 do setek milionów oraz części dziesiętne (grosze).
 */

const JEDNOSTKI = ['', 'jeden', 'dwa', 'trzy,', 'cztery', 'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć'].map(s => s.replace(',', ''));
const NASTKI = [
  'dziesięć',
  'jedenaście',
  'dwanaście',
  'trzynaście',
  'czternaście',
  'piętnaście',
  'szesnaście',
  'siedemnaście',
  'osiemnaście',
  'dziewiętnaście',
];
const DZIESIATKI = [
  '',
  'dziesięć',
  'dwadzieścia',
  'trzydzieści',
  'czterdzieści',
  'pięćdziesiąt',
  'sześćdziesiąt',
  'siedemdziesiąt',
  'osiemdziesiąt',
  'dziewięćdziesiąt',
];
const SETKI = [
  '',
  'sto',
  'dwieście',
  'trzysta',
  'czterysta',
  'pięćset',
  'sześćset',
  'siedemset',
  'osiemset',
  'dziewięćset',
];

type FormsTuple = [string, string, string];

const GRUPY: FormsTuple[] = [
  ['złoty', 'złote', 'złotych'],
  ['tysiąc', 'tysiące', 'tysięcy'],
  ['milion', 'miliony', 'milionów'],
  ['miliard', 'miliardy', 'miliardów'],
];

const GROSZE_FORMY: FormsTuple = ['grosz', 'grosze', 'groszy'];

function odmiana(liczba: number, [jeden, dwaCztery, piec]: FormsTuple): string {
  if (liczba === 1) return jeden;
  const jednosci = liczba % 10;
  const dziesiatki = Math.floor(liczba / 10) % 10;
  if (dziesiatki !== 1 && jednosci >= 2 && jednosci <= 4) {
    return dwaCztery;
  }
  return piec;
}

function trojkaNaSlowa(liczba: number): string {
  const setki = Math.floor(liczba / 100);
  const reszta = liczba % 100;
  const dziesiatki = Math.floor(reszta / 10);
  const jednosci = reszta % 10;

  const slowa: string[] = [];

  if (setki > 0) {
    slowa.push(SETKI[setki]);
  }

  if (reszta >= 10 && reszta < 20) {
    slowa.push(NASTKI[reszta - 10]);
  } else {
    if (dziesiatki > 0) {
      slowa.push(DZIESIATKI[dziesiatki]);
    }
    if (jednosci > 0) {
      slowa.push(JEDNOSTKI[jednosci]);
    }
  }

  return slowa.join(' ');
}

export function kwotaSlowniePL(
  wartosc: number | string | null | undefined,
  opcje: { uwzglednijGrosze?: boolean; formatGroszy?: 'slowa' | 'ulamki' } = {}
): string {
  const { uwzglednijGrosze = true, formatGroszy = 'slowa' } = opcje;

  if (wartosc === null || wartosc === undefined || wartosc === '') {
    return '';
  }

  const numVal =
    typeof wartosc === 'string'
      ? parseFloat(wartosc.replace(/\s+/g, '').replace(',', '.'))
      : wartosc;

  if (isNaN(numVal) || numVal < 0) {
    return '';
  }

  if (numVal === 0) {
    return uwzglednijGrosze ? 'zero złotych zero groszy' : 'zero złotych';
  }

  // Rozbijamy na część całkowitą i grosze
  const calkowita = Math.floor(numVal);
  const grosze = Math.round((numVal - calkowita) * 100);

  const czesci: string[] = [];

  if (calkowita === 0) {
    czesci.push('zero złotych');
  } else {
    // Rozbijamy na trójki: jedności (złote), tysiące, miliony, miliardy
    const trojki: number[] = [];
    let temp = calkowita;
    while (temp > 0) {
      trojki.push(temp % 1000);
      temp = Math.floor(temp / 1000);
    }

    const slowaTrojki: string[] = [];
    for (let i = trojki.length - 1; i >= 0; i--) {
      const val = trojki[i];
      if (val === 0) continue;

      const txt = trojkaNaSlowa(val);
      const forma = odmiana(val, GRUPY[i] || ['złoty', 'złote', 'złotych']);

      if (i === 1 && val === 1) {
        // Zamiast "jeden tysiąc", po polsku w księgowości mówi się "tysiąc" lub "jeden tysiąc"
        // W urzędowych oświadczeniach dopuszczalne oba, "jeden tysiąc" lub "tysiąc"
        slowaTrojki.push(`${txt} ${forma}`);
      } else {
        slowaTrojki.push(`${txt} ${forma}`);
      }
    }

    // Jeśli nie było trójki dla złotych (np. 1000 zł -> trojki[0] = 0), dodajemy formę złotych
    if (trojki[0] === 0) {
      const formaZlote = odmiana(calkowita, GRUPY[0]);
      slowaTrojki.push(formaZlote);
    }

    czesci.push(slowaTrojki.join(' '));
  }

  // Grosze
  if (uwzglednijGrosze && grosze > 0) {
    if (formatGroszy === 'ulamki') {
      czesci.push(`${grosze.toString().padStart(2, '0')}/100`);
    } else {
      const txtGrosze = trojkaNaSlowa(grosze);
      const formaGrosze = odmiana(grosze, GROSZE_FORMY);
      czesci.push(`${txtGrosze} ${formaGrosze}`);
    }
  }

  return czesci.join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * Formatowanie walutowe dla kwot (np. 33825.45 -> "33 825,45 zł")
 */
export function formatujPLN(wartosc: number | string | null | undefined): string {
  if (wartosc === null || wartosc === undefined || wartosc === '') return '';
  const numVal =
    typeof wartosc === 'string'
      ? parseFloat(wartosc.replace(/\s+/g, '').replace(',', '.'))
      : wartosc;
  if (isNaN(numVal)) return '';

  return numVal.toLocaleString('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
