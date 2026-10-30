/**
 * Baza popularnych miejscowości w Polsce ze szczególnym uwzględnieniem
 * województwa śląskiego (siedziba WUWER Sp. z o.o.) oraz miast wojewódzkich i powiatowych.
 */

export interface PolishCity {
  nazwa: string;
  wojewodztwo: string;
  powiat?: string;
  opis?: string;
}

export const POLISH_CITIES: PolishCity[] = [
  // Aglomeracja Śląska i Zagłębie (rejon WUWER Sp. z o.o.)
  { nazwa: 'Ruda Śląska', wojewodztwo: 'śląskie', opis: 'miasto na prawach powiatu' },
  { nazwa: 'Katowice', wojewodztwo: 'śląskie', opis: 'stolica woj. śląskiego' },
  { nazwa: 'Zabrze', wojewodztwo: 'śląskie' },
  { nazwa: 'Chorzów', wojewodztwo: 'śląskie' },
  { nazwa: 'Świętochłowice', wojewodztwo: 'śląskie' },
  { nazwa: 'Gliwice', wojewodztwo: 'śląskie' },
  { nazwa: 'Bytom', wojewodztwo: 'śląskie' },
  { nazwa: 'Mikołów', wojewodztwo: 'śląskie', powiat: 'mikołowski' },
  { nazwa: 'Tychy', wojewodztwo: 'śląskie' },
  { nazwa: 'Sosnowiec', wojewodztwo: 'śląskie' },
  { nazwa: 'Dąbrowa Górnicza', wojewodztwo: 'śląskie' },
  { nazwa: 'Jaworzno', wojewodztwo: 'śląskie' },
  { nazwa: 'Mysłowice', wojewodztwo: 'śląskie' },
  { nazwa: 'Siemianowice Śląskie', wojewodztwo: 'śląskie' },
  { nazwa: 'Piekary Śląskie', wojewodztwo: 'śląskie' },
  { nazwa: 'Tarnowskie Góry', wojewodztwo: 'śląskie', powiat: 'tarnogórski' },
  { nazwa: 'Będzin', wojewodztwo: 'śląskie', powiat: 'będziński' },
  { nazwa: 'Czeladź', wojewodztwo: 'śląskie', powiat: 'będziński' },
  { nazwa: 'Knurów', wojewodztwo: 'śląskie', powiat: 'gliwicki' },
  { nazwa: 'Pyskowice', wojewodztwo: 'śląskie', powiat: 'gliwicki' },
  { nazwa: 'Łaziska Górne', wojewodztwo: 'śląskie', powiat: 'mikołowski' },
  { nazwa: 'Orzesze', wojewodztwo: 'śląskie', powiat: 'mikołowski' },
  { nazwa: 'Czerwionka-Leszczyny', wojewodztwo: 'śląskie', powiat: 'rybnicki' },
  { nazwa: 'Rybnik', wojewodztwo: 'śląskie' },
  { nazwa: 'Żory', wojewodztwo: 'śląskie' },
  { nazwa: 'Jastrzębie-Zdrój', wojewodztwo: 'śląskie' },
  { nazwa: 'Wodzisław Śląski', wojewodztwo: 'śląskie', powiat: 'wodzisławski' },
  { nazwa: 'Racibórz', wojewodztwo: 'śląskie', powiat: 'raciborski' },
  { nazwa: 'Pszczyna', wojewodztwo: 'śląskie', powiat: 'pszczyński' },
  { nazwa: 'Bielsko-Biała', wojewodztwo: 'śląskie' },
  { nazwa: 'Cieszyn', wojewodztwo: 'śląskie', powiat: 'cieszyński' },
  { nazwa: 'Żywiec', wojewodztwo: 'śląskie', powiat: 'żywiecki' },
  { nazwa: 'Częstochowa', wojewodztwo: 'śląskie' },
  { nazwa: 'Zawiercie', wojewodztwo: 'śląskie', powiat: 'zawierciański' },
  { nazwa: 'Myszków', wojewodztwo: 'śląskie', powiat: 'myszkowski' },
  { nazwa: 'Lubliniec', wojewodztwo: 'śląskie', powiat: 'lubliniecki' },
  { nazwa: 'Kłobuck', wojewodztwo: 'śląskie', powiat: 'kłobucki' },
  { nazwa: 'Siewierz', wojewodztwo: 'śląskie', powiat: 'będziński' },
  { nazwa: 'Wojkowice', wojewodztwo: 'śląskie', powiat: 'będziński' },
  { nazwa: 'Sławków', wojewodztwo: 'śląskie', powiat: 'będziński' },
  { nazwa: 'Poręba', wojewodztwo: 'śląskie', powiat: 'zawierciański' },
  { nazwa: 'Ustroń', wojewodztwo: 'śląskie', powiat: 'cieszyński' },
  { nazwa: 'Wisła', wojewodztwo: 'śląskie', powiat: 'cieszyński' },
  { nazwa: 'Szczyrk', wojewodztwo: 'śląskie', powiat: 'bielski' },
  { nazwa: 'Czechowice-Dziedzice', wojewodztwo: 'śląskie', powiat: 'bielski' },

  // Główne miasta w Polsce
  { nazwa: 'Warszawa', wojewodztwo: 'mazowieckie', opis: 'stolica Polski' },
  { nazwa: 'Kraków', wojewodztwo: 'małopolskie', opis: 'stolica woj. małopolskiego' },
  { nazwa: 'Wrocław', wojewodztwo: 'dolnośląskie', opis: 'stolica woj. dolnośląskiego' },
  { nazwa: 'Łódź', wojewodztwo: 'łódzkie', opis: 'stolica woj. łódzkiego' },
  { nazwa: 'Poznań', wojewodztwo: 'wielkopolskie', opis: 'stolica woj. wielkopolskiego' },
  { nazwa: 'Gdańsk', wojewodztwo: 'pomorskie', opis: 'stolica woj. pomorskiego' },
  { nazwa: 'Gdynia', wojewodztwo: 'pomorskie' },
  { nazwa: 'Sopot', wojewodztwo: 'pomorskie' },
  { nazwa: 'Szczecin', wojewodztwo: 'zachodniopomorskie' },
  { nazwa: 'Bydgoszcz', wojewodztwo: 'kujawsko-pomorskie' },
  { nazwa: 'Toruń', wojewodztwo: 'kujawsko-pomorskie' },
  { nazwa: 'Lublin', wojewodztwo: 'lubelskie' },
  { nazwa: 'Białystok', wojewodztwo: 'podlaskie' },
  { nazwa: 'Rzeszów', wojewodztwo: 'podkarpackie' },
  { nazwa: 'Kielce', wojewodztwo: 'świętokrzyskie' },
  { nazwa: 'Olsztyn', wojewodztwo: 'warmińsko-mazurskie' },
  { nazwa: 'Zielona Góra', wojewodztwo: 'lubuskie' },
  { nazwa: 'Gorzów Wielkopolski', wojewodztwo: 'lubuskie' },
  { nazwa: 'Opole', wojewodztwo: 'opolskie' },
  { nazwa: 'Tarnów', wojewodztwo: 'małopolskie' },
  { nazwa: 'Nowy Sącz', wojewodztwo: 'małopolskie' },
  { nazwa: 'Oświęcim', wojewodztwo: 'małopolskie' },
  { nazwa: 'Chrzanów', wojewodztwo: 'małopolskie' },
  { nazwa: 'Olkusz', wojewodztwo: 'małopolskie' },
  { nazwa: 'Kędzierzyn-Koźle', wojewodztwo: 'opolskie' },
  { nazwa: 'Nysa', wojewodztwo: 'opolskie' },
  { nazwa: 'Brzeg', wojewodztwo: 'opolskie' },
  { nazwa: 'Kluczbork', wojewodztwo: 'opolskie' },
  { nazwa: 'Strzelce Opolskie', wojewodztwo: 'opolskie' },
  { nazwa: 'Radom', wojewodztwo: 'mazowieckie' },
  { nazwa: 'Płock', wojewodztwo: 'mazowieckie' },
  { nazwa: 'Siedlce', wojewodztwo: 'mazowieckie' },
  { nazwa: 'Kalisz', wojewodztwo: 'wielkopolskie' },
  { nazwa: 'Konin', wojewodztwo: 'wielkopolskie' },
  { nazwa: 'Legnica', wojewodztwo: 'dolnośląskie' },
  { nazwa: 'Wałbrzych', wojewodztwo: 'dolnośląskie' },
  { nazwa: 'Jelenia Góra', wojewodztwo: 'dolnośląskie' },
  { nazwa: 'Koszalin', wojewodztwo: 'zachodniopomorskie' },
  { nazwa: 'Słupsk', wojewodztwo: 'pomorskie' },
  { nazwa: 'Elbląg', wojewodztwo: 'warmińsko-mazurskie' },
  { nazwa: 'Grudziądz', wojewodztwo: 'kujawsko-pomorskie' },
  { nazwa: 'Włocławek', wojewodztwo: 'kujawsko-pomorskie' },
  { nazwa: 'Piotrków Trybunalski', wojewodztwo: 'łódzkie' },
  { nazwa: 'Pabianice', wojewodztwo: 'łódzkie' },
  { nazwa: 'Tomaszów Mazowiecki', wojewodztwo: 'łódzkie' },
  { nazwa: 'Zamość', wojewodztwo: 'lubelskie' },
  { nazwa: 'Chełm', wojewodztwo: 'lubelskie' },
  { nazwa: 'Biała Podlaska', wojewodztwo: 'lubelskie' },
  { nazwa: 'Suwałki', wojewodztwo: 'podlaskie' },
  { nazwa: 'Łomża', wojewodztwo: 'podlaskie' },
  { nazwa: 'Przemyśl', wojewodztwo: 'podkarpackie' },
  { nazwa: 'Stalowa Wola', wojewodztwo: 'podkarpackie' },
  { nazwa: 'Mielec', wojewodztwo: 'podkarpackie' },
  { nazwa: 'Krosno', wojewodztwo: 'podkarpackie' },
  { nazwa: 'Ostrowiec Świętokrzyski', wojewodztwo: 'świętokrzyskie' },
  { nazwa: 'Starachowice', wojewodztwo: 'świętokrzyskie' },
  { nazwa: 'Skarżysko-Kamienna', wojewodztwo: 'świętokrzyskie' }
];

export function filterCities(query: string, limit = 8): PolishCity[] {
  if (!query || query.trim().length === 0) {
    return POLISH_CITIES.slice(0, limit);
  }

  const normalized = query.toLowerCase().trim();
  return POLISH_CITIES.filter((city) =>
    city.nazwa.toLowerCase().includes(normalized)
  ).slice(0, limit);
}
