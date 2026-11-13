/**
 * SCOUTPRO -> Base Madre (Google Sheets)
 * Vincular este proyecto a la hoja y desplegar como aplicación web.
 * Busca competencia por nombre de pestaña, jugador en columna A,
 * jornada en fila 1 desde columna E. No desplaza ni compacta celdas vacías.
 */
const SCOUTPRO_TOKEN = 'REEMPLAZAR_POR_UN_TOKEN_LARGO';

function doGet(e) {
  const p = e && e.parameter || {};
  const cb = String(p.callback || '');
  let out;
  try {
    if (p.token !== SCOUTPRO_TOKEN) throw new Error('Token inválido');
    if (p.action !== 'write') throw new Error('Acción no válida');
    const comp = String(p.comp || '');
    const player = String(p.player || '').trim();
    const jornada = Number(p.jornada);
    const value = String(p.value || '').trim().toUpperCase();
    const sheetNames = {
      LP: 'Liga Profesional - 2 da parte',
      PN: 'Primera Nacional',
      PB: 'Primera B Metro',
      TP: 'Torneo Proyeccion'
    };
    const sheetName = sheetNames[comp];
    if (!sheetName || !player || !Number.isInteger(jornada) || jornada < 1) throw new Error('Datos incompletos');
    if (!(value === 'NJ' || value === 'SUP' || (/^(?:10|[0-9])(?:[.,][0-9])?$/.test(value)))) throw new Error('Calificación inválida');
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(sheetName);
    if (!sh) throw new Error('No existe la pestaña: ' + sheetName);
    const lastRow = sh.getLastRow();
    const names = sh.getRange(2, 1, Math.max(1, lastRow - 1), 1).getDisplayValues().flat();
    const idx = names.findIndex(n => String(n).trim().toLocaleLowerCase() === player.toLocaleLowerCase());
    if (idx < 0) throw new Error('Jugador no encontrado en ' + sheetName + ': ' + player);
    const headers = sh.getRange(1, 5, 1, Math.max(1, sh.getLastColumn() - 4)).getDisplayValues()[0];
    const colIdx = headers.findIndex(h => Number(String(h).trim()) === jornada);
    if (colIdx < 0) throw new Error('No se encontró la columna de jornada ' + jornada);
    const cell = sh.getRange(idx + 2, colIdx + 5);
    const normalized = value === 'NJ' || value === 'SUP' ? value : Number(value.replace(',', '.'));
    cell.setValue(normalized);
    out = { ok: true, sheet: sheetName, player: player, jornada: jornada, value: normalized, cell: cell.getA1Notation() };
  } catch (err) {
    out = { ok: false, error: String(err.message || err) };
  }
  const json = JSON.stringify(out);
  return ContentService.createTextOutput(cb ? cb + '(' + json + ');' : json)
    .setMimeType(cb ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}
