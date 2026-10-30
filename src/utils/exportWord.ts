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
      <title>Oświadczenie ZFŚS ${rok}</title>
      <style>
        @page {
          size: 21cm 29.7cm;
          margin: 2cm 2cm 2cm 2cm;
          mso-page-orientation: portrait;
        }
        body {
          font-family: 'Times New Roman', serif;
          font-size: 11pt;
          line-height: 1.5;
          color: #000000;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        .dotted {
          border-bottom: 1px dotted #000000;
        }
        .center {
          text-align: center;
        }
        .small {
          font-size: 8pt;
          text-align: center;
        }
        .title {
          font-size: 14pt;
          font-weight: bold;
          text-align: center;
          letter-spacing: 2px;
          margin-top: 15pt;
          margin-bottom: 5pt;
        }
        .subtitle {
          font-size: 11pt;
          font-weight: bold;
          text-align: center;
          margin-bottom: 5pt;
        }
        .subsub {
          font-size: 10pt;
          font-style: italic;
          text-align: center;
          margin-bottom: 15pt;
        }
        .box {
          border: 1px solid #000000;
          padding: 8pt;
          margin-top: 15pt;
          font-size: 9.5pt;
        }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td style="width: 50%; vertical-align: top; padding-top: 25pt;">
            <div style="border-bottom: 1px dotted #000; text-align: center; font-weight: bold; font-family: Arial, sans-serif; font-size: 10.5pt; min-height: 16pt;">
              ${data.imieNazwisko || '&nbsp;'}
            </div>
            <div class="small">(imię i nazwisko)</div>
            <br>
            <div style="border-bottom: 1px dotted #000; text-align: center; font-family: Arial, sans-serif; font-size: 9.5pt; min-height: 16pt;">
              ${data.stanowisko || '&nbsp;'}
            </div>
            <div class="small">(stanowisko)</div>
          </td>
          <td style="width: 50%; vertical-align: top; text-align: center;">
            <span style="border-bottom: 1px dotted #000; display: inline-block; min-width: 100pt; font-weight: bold;">
              ${data.miejscowosc || 'Ruda Śląska'}
            </span>
            &nbsp;dnia&nbsp;
            <span style="border-bottom: 1px dotted #000; display: inline-block; min-width: 50pt; font-weight: bold;">
              ${dayMonthVal}
            </span>
            &nbsp;<b>${rok} r.</b>
            <div class="small">(miejscowość, data)</div>
          </td>
        </tr>
      </table>

      <div class="title">O Ś W I A D C Z E N I E</div>
      <div class="subtitle">o dochodach rodziny pracownika występującego z wnioskiem<br>o otrzymanie pomocy z ZFŚS w ${rok} roku</div>
      <div class="subsub">za okres trzech miesięcy poprzedzających złożenie wniosku o dofinansowanie</div>

      <p style="text-indent: 20pt; text-align: justify;">
        Uprzedzony o odpowiedzialności karnej za składanie fałszywych zeznań, oświadczam że:
      </p>

      <p style="text-indent: 20pt; text-align: justify;">
        w okresie trzech miesięcy poprzedzających złożenie wniosku, tj. <b>…09 – 11.${rok}..r</b> ( wypłacone w m-cach )
      </p>

      <p style="margin-top: 6pt;">
        1. Moje dochody brutto z tytułu zatrudnienia w WUWER Sp. z o.o. wyniosły
        <span style="border-bottom: 1px dotted #000; font-weight: bold;">&nbsp;${dochodWuwerFmt}&nbsp;</span> brutto.
      </p>

      <p style="margin-top: 6pt;">
        2. Moje dochody z innych źródeł <span style="border-bottom: 1px dotted #000;">&nbsp;${data.inneZrodlaOpis || '………………………………'}&nbsp;</span>
        wyniosły <span style="border-bottom: 1px dotted #000; font-weight: bold;">&nbsp;${dochodInneFmt}&nbsp;</span> brutto.
      </p>

      <p style="margin-top: 6pt;">
        3. Dochody osób prowadzących ze mną wspólne gospodarstwo domowe wyniosły<br>
        <span style="border-bottom: 1px dotted #000; font-weight: bold;">&nbsp;${dochodWspolneFmt}&nbsp;</span> brutto (słownie:<br>
        <span style="border-bottom: 1px dotted #000; display: block; font-style: italic; font-size: 9.5pt; padding: 2pt 0;">
          ${data.dochodWspolneSlownie || '………………………………………………………………………………………………………………………'}
        </span>
        <span style="float: right;">)</span>
      </p>

      <p style="font-size: 9pt; font-style: italic; margin-top: 4pt;">
        (W oświadczeniu należy uwzględnić wszystkie dochody , bez względu na źródło ich pochodzenia).
      </p>

      <p style="margin-top: 8pt;">
        <b>Ogółem dochód brutto w mojej rodzinie wyniósł</b>
        <span style="border-bottom: 1px dotted #000; font-weight: bold;">&nbsp;${dochodOgolemFmt}&nbsp;</span>.
      </p>

      <p style="margin-top: 6pt;">
        Ilość osób w rodzinie prowadzących wraz ze mną wspólne gospodarstwo i utrzymujących się z tego dochodu
        <span style="border-bottom: 1px dotted #000; font-weight: bold;">&nbsp;${osobyFmt}&nbsp;</span>.
      </p>

      <p style="margin-top: 10pt; text-align: justify;">
        Wyrażam zgodę na przetwarzanie powyższych informacji wyłącznie w celu zawartym w treści oświadczenia.
      </p>

      <br>
      <table style="margin-top: 10pt;">
        <tr>
          <td style="width: 50%;"></td>
          <td style="width: 50%; text-align: center;">
            <div style="border-bottom: 1px dotted #000; min-height: 35pt;">
              ${data.podpisImage ? `<img src="${data.podpisImage}" style="max-height: 40pt;" />` : '&nbsp;'}
            </div>
            <div class="small">(podpis pracownika)</div>
          </td>
        </tr>
      </table>

      <div style="margin-top: 10pt; font-size: 8.5pt;">
        <b><u>Pouczenie:</u></b><br>
        W przypadku złożenia niezgodnego z prawdą oświadczenia o sytuacji materialnej i rodzinnej albo w przypadku wykorzystania świadczenia niezgodnie z jego przeznaczeniem, uprawniony zostaje wyłączony z prawa do korzystania ze środków Funduszu na 2 lata.
      </div>

      <div class="box">
        <b>Wypełnia pracodawca:</b><br>
        Średni dochód brutto przypadający na jedną osobę w rodzinie w okresie ....................................<br>
        wyniósł ............................................. zł.<br>
        Wysokość dofinansowania ....................................................
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
