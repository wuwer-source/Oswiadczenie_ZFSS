import { FormDataState } from '../components/OfficialDocumentView';
import { formatujPLN } from './numberToWordsPL';
import { formatOsobyPL } from '../components/HouseholdPersonsSelect';

export function exportToWordDoc(data: FormDataState) {
  const rok = data.rokWniosku || '2025';
  const dochodWuwerFmt = data.dochodWuwer ? `${formatujPLN(data.dochodWuwer)} zł` : '.................................. zł';
  const dochodInneFmt = data.dochodInne ? `${formatujPLN(data.dochodInne)} zł` : '.................................. zł';
  const dochodWspolneFmt = data.dochodWspolne ? `${formatujPLN(data.dochodWspolne)} zł` : '.................................. zł';
  const dochodOgolemFmt = data.ogolemDochod ? `${formatujPLN(data.ogolemDochod)} zł` : '.................................. zł';
  const osobyFmt = data.iloscOsob ? formatOsobyPL(data.iloscOsob) : '..................................';

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
          margin: 1.5cm 2.0cm 1.5cm 2.0cm; /* Margines góry dokładnie 1.5 cm od krawędzi */
          mso-header-margin: 0.5cm;
          mso-footer-margin: 0.5cm;
          mso-paper-source: 0;
        }
        div.Section1 {
          page: Section1;
          background-color: #ffffff !important;
        }
        body {
          font-family: 'Times New Roman', serif;
          font-size: 11pt;
          line-height: 1.45;
          color: #000000 !important;
          background-color: #ffffff !important;
          background: #ffffff !important;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background-color: #ffffff !important;
        }
        td {
          background-color: #ffffff !important;
          color: #000000 !important;
        }
        .small {
          font-size: 8pt;
          text-align: center;
          color: #000000;
        }
        .title {
          font-size: 13.5pt;
          font-weight: bold;
          text-align: center;
          letter-spacing: 2px;
          margin-top: 14pt;
          margin-bottom: 4pt;
          color: #000000;
        }
        .subtitle {
          font-size: 10.5pt;
          font-weight: bold;
          text-align: center;
          margin-bottom: 4pt;
          color: #000000;
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
          padding: 6pt;
          margin-top: 12pt;
          font-size: 9pt;
          background-color: #ffffff !important;
          color: #000000;
        }
      </style>
    </head>
    <body bgcolor="#ffffff" style="background-color: #ffffff !important; background: #ffffff !important; color: #000000 !important;">
      <div class="Section1" style="background-color: #ffffff !important; background: #ffffff !important;">
        <!-- Tabela nagłówka: Miejscowość, data 1.5 cm od góry, a Imię i nazwisko dokładnie o 1.5 cm niżej -->
        <table style="width: 100%; margin-top: 0; padding-top: 0; background-color: #ffffff;">
          <tr>
            <!-- Lewa kolumna: obniżona dokładnie o 1.5 cm za pomocą dedykowanego bloku odstępu -->
            <td style="width: 50%; vertical-align: top; background-color: #ffffff; padding: 0;">
              <!-- Odstęp 1.5 cm poniżej prawej kolumny -->
              <div style="height: 1.5cm; line-height: 1.5cm; font-size: 1pt; mso-line-height-rule: exactly;">&nbsp;</div>
              <div style="border-bottom: 1px dotted #000000; text-align: center; font-weight: bold; font-family: Arial, sans-serif; font-size: 10pt; min-height: 16pt; color: #000000;">
                ${data.imieNazwisko || '&nbsp;'}
              </div>
              <div class="small">(imię i nazwisko)</div>
              <div style="height: 6pt; font-size: 1pt;">&nbsp;</div>
              <div style="border-bottom: 1px dotted #000000; text-align: center; font-family: Arial, sans-serif; font-size: 9.5pt; min-height: 16pt; color: #000000;">
                ${data.stanowisko || '&nbsp;'}
              </div>
              <div class="small">(stanowisko)</div>
            </td>

            <!-- Prawa kolumna: Miejscowość i data na samej górze (1.5 cm od krawędzi kartki wg marginesu) -->
            <td style="width: 50%; vertical-align: top; text-align: center; background-color: #ffffff; padding: 0;">
              <span style="border-bottom: 1px dotted #000000; display: inline-block; min-width: 90pt; font-weight: bold; color: #000000;">
                ${data.miejscowosc || 'Ruda Śląska'}
              </span>
              &nbsp;dnia&nbsp;
              <span style="border-bottom: 1px dotted #000000; display: inline-block; min-width: 45pt; font-weight: bold; color: #000000;">
                ${dayMonthVal}
              </span>
              &nbsp;<b style="color: #000000;">${rok} r.</b>
              <div class="small">(miejscowość, data)</div>
            </td>
          </tr>
        </table>

        <div class="title">O Ś W I A D C Z E N I E</div>
        <div class="subtitle">o dochodach rodziny pracownika występującego z wnioskiem<br>o otrzymanie pomocy z ZFŚS w ${rok} roku</div>
        <div class="subsub">za okres trzech miesięcy poprzedzających złożenie wniosku o dofinansowanie</div>

        <p style="text-indent: 18pt; text-align: justify; margin-top: 4pt; margin-bottom: 4pt; color: #000000;">
          Uprzedzony o odpowiedzialności karnej za składanie fałszywych zeznań, oświadczam że:
        </p>

        <p style="text-indent: 18pt; text-align: justify; margin-top: 4pt; margin-bottom: 4pt; color: #000000;">
          w okresie trzech miesięcy poprzedzających złożenie wniosku, tj. <b>09 – 11.${rok} r.</b> ( wypłacone w m-cach )
        </p>

        <p style="margin-top: 5pt; margin-bottom: 4pt; color: #000000;">
          1. Moje dochody brutto z tytułu zatrudnienia w WUWER Sp. z o.o. wyniosły
          <span style="border-bottom: 1px dotted #000000; font-weight: bold;">&nbsp;${dochodWuwerFmt}&nbsp;</span> brutto.
        </p>

        <p style="margin-top: 5pt; margin-bottom: 4pt; color: #000000;">
          2. Moje dochody z innych źródeł <span style="border-bottom: 1px dotted #000000;">&nbsp;${data.inneZrodlaOpis || '………………………………'}&nbsp;</span>
          wyniosły <span style="border-bottom: 1px dotted #000000; font-weight: bold;">&nbsp;${dochodInneFmt}&nbsp;</span> brutto.
        </p>

        <p style="margin-top: 5pt; margin-bottom: 4pt; color: #000000;">
          3. Dochody osób prowadzących ze mną wspólne gospodarstwo domowe wyniosły<br>
          <span style="border-bottom: 1px dotted #000000; font-weight: bold;">&nbsp;${dochodWspolneFmt}&nbsp;</span> brutto (słownie:<br>
          <span style="border-bottom: 1px dotted #000000; display: block; font-style: italic; font-size: 9pt; padding: 1pt 0; color: #000000;">
            ${data.dochodWspolneSlownie || '………………………………………………………………………………………………………………………'}
          </span>
          <span style="float: right;">)</span>
        </p>

        <p style="font-size: 8.5pt; font-style: italic; margin-top: 3pt; margin-bottom: 3pt; color: #000000;">
          (W oświadczeniu należy uwzględnić wszystkie dochody , bez względu na źródło ich pochodzenia).
        </p>

        <p style="margin-top: 6pt; margin-bottom: 4pt; color: #000000;">
          <b>Ogółem dochód brutto w mojej rodzinie wyniósł</b>
          <span style="border-bottom: 1px dotted #000000; font-weight: bold;">&nbsp;${dochodOgolemFmt}&nbsp;</span>.
        </p>

        <p style="margin-top: 5pt; margin-bottom: 4pt; color: #000000;">
          Ilość osób w rodzinie prowadzących wraz ze mną wspólne gospodarstwo i utrzymujących się z tego dochodu
          <span style="border-bottom: 1px dotted #000000; font-weight: bold;">&nbsp;${osobyFmt}&nbsp;</span>.
        </p>

        <p style="margin-top: 8pt; margin-bottom: 4pt; text-align: justify; color: #000000;">
          Wyrażam zgodę na przetwarzanie powyższych informacji wyłącznie w celu zawartym w treści oświadczenia.
        </p>

        <!-- Podpis pracownika - mały, estetyczny i proporcjonalny -->
        <table style="margin-top: 6pt; width: 100%; background-color: #ffffff;">
          <tr>
            <td style="width: 50%; background-color: #ffffff;"></td>
            <td style="width: 50%; text-align: center; background-color: #ffffff;">
              <div style="border-bottom: 1px dotted #000000; min-height: 36pt; height: 36pt; text-align: center; vertical-align: middle;">
                ${
                  data.podpisImage
                    ? `<img src="${data.podpisImage}" width="150" height="40" style="width: 150px; height: 40px; max-width: 150px; max-height: 40px; object-fit: contain; display: inline-block;" />`
                    : '&nbsp;'
                }
              </div>
              <div class="small">(podpis pracownika)</div>
            </td>
          </tr>
        </table>

        <div style="margin-top: 8pt; font-size: 8pt; color: #000000;">
          <b><u>Pouczenie:</u></b><br>
          W przypadku złożenia niezgodnego z prawdą oświadczenia o sytuacji materialnej i rodzinnej albo w przypadku wykorzystania świadczenia niezgodnie z jego przeznaczeniem, uprawniony zostaje wyłączony z prawa do korzystania ze środków Funduszu na 2 lata.
        </div>

        <div class="box">
          <b>Wypełnia pracodawca:</b><br>
          Średni dochód brutto przypadający na jedną osobę w rodzinie w okresie ....................................<br>
          wyniósł ............................................. zł.<br>
          Wysokość dofinansowania ....................................................
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
