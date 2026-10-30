import { FormDataState } from '../components/OfficialDocumentView';
import { formatujPLN } from './numberToWordsPL';
import { formatOsobyPL } from '../components/HouseholdPersonsSelect';

export function exportToWordDoc(data: FormDataState) {
  const rok = data.rokWniosku || '2025';
  const dochodWuwerFmt = data.dochodWuwer ? formatujPLN(data.dochodWuwer) : '';
  const dochodInneFmt = data.dochodInne ? formatujPLN(data.dochodInne) : '';
  const dochodWspolneFmt = data.dochodWspolne ? formatujPLN(data.dochodWspolne) : '';
  const dochodOgolemFmt = data.ogolemDochod ? formatujPLN(data.ogolemDochod) : '';
  const osobyFmt = data.iloscOsob ? formatOsobyPL(data.iloscOsob) : '';

  // Extract day and month
  let dayMonthVal = data.dataWniosku || '24.10';
  if (dayMonthVal.includes('.')) {
    const parts = dayMonthVal.split('.');
    if (parts.length >= 2) {
      dayMonthVal = `${parts[0]}.${parts[1]}`;
    }
  }

  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <title>Oświadczenie ZFŚS ${rok}</title>
      <style>
        @page Section1 {
          size: 21.0cm 29.7cm;
          margin: 1.5cm 1.6cm 1.5cm 1.6cm; /* Szerokie, naturalne marginesy A4 */
          mso-header-margin: 0.5cm;
          mso-footer-margin: 0.5cm;
          mso-paper-source: 0;
        }
        div.Section1 {
          page: Section1;
          width: 100%;
          background-color: #ffffff !important;
        }
        body {
          font-family: 'Times New Roman', serif;
          font-size: 11pt;
          line-height: 1.45;
          color: #000000 !important;
          background-color: #ffffff !important;
          background: #ffffff !important;
          margin: 0;
          padding: 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background-color: #ffffff !important;
        }
        td {
          background-color: #ffffff !important;
          color: #000000 !important;
          padding: 0;
        }
        .small {
          font-size: 8pt;
          text-align: center;
          color: #000000;
        }
        .title {
          font-size: 14pt;
          font-weight: bold;
          text-align: center;
          letter-spacing: 2px;
          margin-top: 14pt;
          margin-bottom: 3pt;
          color: #000000;
        }
        .subtitle {
          font-size: 10.5pt;
          font-weight: bold;
          text-align: center;
          margin-bottom: 3pt;
          color: #000000;
          line-height: 1.35;
        }
        .subsub {
          font-size: 9.5pt;
          font-style: italic;
          text-align: center;
          margin-bottom: 12pt;
          color: #000000;
        }
        .box {
          border: 1px solid #000000;
          padding: 6pt 8pt;
          margin-top: 12pt;
          font-size: 9pt;
          background-color: #ffffff !important;
          color: #000000;
          width: 100%;
        }
      </style>
    </head>
    <body bgcolor="#ffffff" style="background-color: #ffffff !important; background: #ffffff !important; color: #000000 !important;">
      <div class="Section1" style="background-color: #ffffff !important; background: #ffffff !important; width: 100%;">
        
        <!-- NAGŁÓWEK: Miejscowość i data na samej górze (1.5 cm od krawędzi) oraz Imię, nazwisko i stanowisko obniżone o 1.5 cm -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 0; background-color: #ffffff;">
          <tr>
            <!-- Lewa kolumna: Imię i nazwisko oraz stanowisko (szerokie linie, obniżone o 1.5 cm) -->
            <td style="width: 48%; vertical-align: top; background-color: #ffffff;">
              <!-- Obniżenie o 1.5 cm względem prawej kolumny -->
              <div style="height: 1.5cm; line-height: 1.5cm; font-size: 1pt; mso-line-height-rule: exactly;">&nbsp;</div>
              
              <div style="border-bottom: 1px dotted #000000; text-align: center; font-weight: bold; font-family: Arial, sans-serif; font-size: 10pt; min-height: 16pt; width: 100%; color: #000000;">
                ${data.imieNazwisko || '&nbsp;'}
              </div>
              <div class="small" style="margin-top: 2pt;">(imię i nazwisko)</div>
              
              <div style="height: 8pt; font-size: 1pt;">&nbsp;</div>
              
              <div style="border-bottom: 1px dotted #000000; text-align: center; font-family: Arial, sans-serif; font-size: 9.5pt; min-height: 16pt; width: 100%; color: #000000;">
                ${data.stanowisko || '&nbsp;'}
              </div>
              <div class="small" style="margin-top: 2pt;">(stanowisko)</div>
            </td>

            <td style="width: 4%;"></td>

            <!-- Prawa kolumna: Miejscowość i data rozciągnięta elegancko pod kropkami -->
            <td style="width: 48%; vertical-align: top; text-align: center; background-color: #ffffff;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="border-bottom: 1px dotted #000000; text-align: center; font-weight: bold; font-family: Arial, sans-serif; width: 55%; color: #000000;">
                    ${data.miejscowosc || 'Ruda Śląska'}
                  </td>
                  <td style="white-space: nowrap; width: 1%;">&nbsp;dnia&nbsp;</td>
                  <td style="border-bottom: 1px dotted #000000; text-align: center; font-weight: bold; font-family: Arial, sans-serif; width: 25%; color: #000000;">
                    ${dayMonthVal}
                  </td>
                  <td style="white-space: nowrap; width: 1%; font-weight: bold;">&nbsp;${rok} r.</td>
                </tr>
              </table>
              <div class="small" style="margin-top: 2pt;">(miejscowość, data)</div>
            </td>
          </tr>
        </table>

        <!-- TYTUŁ DOKUMENTU -->
        <div class="title">O Ś W I A D C Z E N I E</div>
        <div class="subtitle">
          o dochodach rodziny pracownika występującego z wnioskiem<br>
          o otrzymanie pomocy z ZFŚS w ${rok} roku
        </div>
        <div class="subsub">za okres trzech miesięcy poprzedzających złożenie wniosku o dofinansowanie</div>

        <p style="text-indent: 20pt; text-align: justify; margin-top: 4pt; margin-bottom: 4pt; color: #000000;">
          Uprzedzony o odpowiedzialności karnej za składanie fałszywych zeznań, oświadczam że:
        </p>

        <p style="text-indent: 20pt; text-align: justify; margin-top: 4pt; margin-bottom: 6pt; color: #000000;">
          w okresie trzech miesięcy poprzedzających złożenie wniosku, tj. <b>09 – 11.${rok} r.</b> ( wypłacone w m-cach )
        </p>

        <!-- PUNKT 1: Rozciągnięta linia kropkowana na pełną szerokość -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 4pt; margin-bottom: 4pt;">
          <tr>
            <td style="white-space: nowrap; width: 1%; color: #000000;">1. Moje dochody brutto z tytułu zatrudnienia w WUWER Sp. z o.o. wyniosły&nbsp;</td>
            <td style="border-bottom: 1px dotted #000000; text-align: center; font-weight: bold; font-family: Arial, sans-serif; color: #000000;">
              ${dochodWuwerFmt || '&nbsp;'}
            </td>
            <td style="white-space: nowrap; width: 1%; text-align: right; color: #000000;">&nbsp;zł brutto.</td>
          </tr>
        </table>

        <!-- PUNKT 2: Rozciągnięta linia z innymi źródłami i kwotą -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 4pt; margin-bottom: 4pt;">
          <tr>
            <td style="white-space: nowrap; width: 1%; color: #000000;">2. Moje dochody z innych źródeł&nbsp;</td>
            <td style="border-bottom: 1px dotted #000000; text-align: center; font-family: Arial, sans-serif; width: 32%; color: #000000;">
              ${data.inneZrodlaOpis || '&nbsp;'}
            </td>
            <td style="white-space: nowrap; width: 1%; color: #000000;">&nbsp;wyniosły&nbsp;</td>
            <td style="border-bottom: 1px dotted #000000; text-align: center; font-weight: bold; font-family: Arial, sans-serif; color: #000000;">
              ${dochodInneFmt || '&nbsp;'}
            </td>
            <td style="white-space: nowrap; width: 1%; text-align: right; color: #000000;">&nbsp;zł brutto.</td>
          </tr>
        </table>

        <!-- PUNKT 3: Wspólne gospodarstwo + linia słownie na całą szerokość -->
        <div style="margin-top: 4pt; color: #000000;">
          3. Dochody osób prowadzących ze mną wspólne gospodarstwo domowe wyniosły
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 2pt;">
          <tr>
            <td style="border-bottom: 1px dotted #000000; text-align: center; font-weight: bold; font-family: Arial, sans-serif; width: 55%; color: #000000;">
              ${dochodWspolneFmt || '&nbsp;'}
            </td>
            <td style="white-space: nowrap; width: 45%; color: #000000;">&nbsp;zł brutto (słownie:</td>
          </tr>
        </table>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 2pt;">
          <tr>
            <td style="border-bottom: 1px dotted #000000; font-style: italic; font-size: 9pt; padding: 2pt 4pt; color: #000000; width: 98%;">
              ${data.dochodWspolneSlownie || '&nbsp;'}
            </td>
            <td style="white-space: nowrap; width: 2%; text-align: right; vertical-align: bottom;">)</td>
          </tr>
        </table>

        <p style="font-size: 8.5pt; font-style: italic; margin-top: 3pt; margin-bottom: 3pt; color: #000000;">
          (W oświadczeniu należy uwzględnić wszystkie dochody , bez względu na źródło ich pochodzenia).
        </p>

        <!-- OGÓŁEM DOCHÓD: Rozciągnięta linia na całą szerokość -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 6pt; margin-bottom: 4pt;">
          <tr>
            <td style="white-space: nowrap; width: 1%; font-weight: bold; color: #000000;">Ogółem dochód brutto w mojej rodzinie wyniósł&nbsp;</td>
            <td style="border-bottom: 1px dotted #000000; text-align: center; font-weight: bold; font-size: 11pt; font-family: Arial, sans-serif; color: #000000;">
              ${dochodOgolemFmt ? dochodOgolemFmt + ' zł' : '&nbsp;'}
            </td>
            <td style="white-space: nowrap; width: 1%; font-weight: bold; color: #000000;">&nbsp;.</td>
          </tr>
        </table>

        <!-- ILOŚĆ OSÓB: Rozciągnięta linia na całą szerokość -->
        <div style="margin-top: 4pt; color: #000000;">
          Ilość osób w rodzinie prowadzących wraz ze mną wspólne gospodarstwo i utrzymujących się z tego dochodu
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 2pt;">
          <tr>
            <td style="border-bottom: 1px dotted #000000; text-align: center; font-weight: bold; font-family: Arial, sans-serif; width: 50%; color: #000000;">
              ${osobyFmt || '&nbsp;'}
            </td>
            <td style="white-space: nowrap; width: 50%; color: #000000;">&nbsp;.</td>
          </tr>
        </table>

        <p style="margin-top: 8pt; margin-bottom: 4pt; text-align: justify; color: #000000;">
          Wyrażam zgodę na przetwarzanie powyższych informacji wyłącznie w celu zawartym w treści oświadczenia.
        </p>

        <!-- PODPIS PRACOWNIKA: Rozciągnięta linia, zgrabny podpis -->
        <table style="margin-top: 6pt; width: 100%; border-collapse: collapse; background-color: #ffffff;">
          <tr>
            <td style="width: 52%; background-color: #ffffff;"></td>
            <td style="width: 48%; text-align: center; background-color: #ffffff;">
              <div style="border-bottom: 1px dotted #000000; width: 100%; min-height: 36pt; height: 36pt; text-align: center; vertical-align: middle;">
                ${
                  data.podpisImage
                    ? `<img src="${data.podpisImage}" width="140" height="36" style="width: 140px; height: 36px; object-fit: contain; display: inline-block;" />`
                    : '&nbsp;'
                }
              </div>
              <div class="small" style="margin-top: 2pt;">(podpis pracownika)</div>
            </td>
          </tr>
        </table>

        <!-- POUCZENIE -->
        <div style="margin-top: 8pt; font-size: 8pt; color: #000000; line-height: 1.25;">
          <b><u>Pouczenie:</u></b><br>
          W przypadku złożenia niezgodnego z prawdą oświadczenia o sytuacji materialnej i rodzinnej albo w przypadku wykorzystania świadczenia niezgodnie z jego przeznaczeniem, uprawniony zostaje wyłączony z prawa do korzystania ze środków Funduszu na 2 lata.
        </div>

        <!-- RAMKA PRACODAWCY: Rozciągnięta na całą szerokość -->
        <div class="box">
          <b>Wypełnia pracodawca:</b><br>
          <table style="width: 100%; border-collapse: collapse; margin-top: 3pt;">
            <tr>
              <td style="white-space: nowrap; width: 1%; color: #000000;">Średni dochód brutto przypadający na jedną osobę w rodzinie w okresie&nbsp;</td>
              <td style="border-bottom: 1px dotted #000000; width: 45%;">&nbsp;</td>
              <td style="white-space: nowrap; width: 1%; color: #000000;">&nbsp;wyniósł&nbsp;</td>
              <td style="border-bottom: 1px dotted #000000; width: 35%;">&nbsp;</td>
              <td style="white-space: nowrap; width: 1%; color: #000000;">&nbsp;zł.</td>
            </tr>
          </table>
          <table style="width: 100%; border-collapse: collapse; margin-top: 3pt;">
            <tr>
              <td style="white-space: nowrap; width: 1%; color: #000000;">Wysokość dofinansowania&nbsp;</td>
              <td style="border-bottom: 1px dotted #000000;">&nbsp;</td>
            </tr>
          </table>
        </div>

      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', content], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `Oswiadczenie_ZFSS_${data.imieNazwisko ? data.imieNazwisko.replace(/\s+/g, '_') : 'WUWER'}_${rok}.doc`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}
