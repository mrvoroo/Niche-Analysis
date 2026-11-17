/**
 * Magmafy — قاعدة بيانات تحليل النيش
 * كود Apps Script اللي بيخلّي جوجل شيت يشتغل كقاعدة بيانات للموقع.
 *
 * التركيب (مرة واحدة بس):
 *  1. افتح الشيت → Extensions → Apps Script
 *  2. امسح أي كود موجود والصق الكود ده كله
 *  3. Deploy → New deployment → النوع: Web app
 *     Execute as:  Me
 *     Who has access:  Anyone
 *  4. انسخ رابط الـ Web App (بينتهي بـ /exec) وحطه في صفحة الإعدادات في الموقع
 *
 * ملاحظة أمان: "Anyone" معناها إن أي حد عنده الرابط يقدر يقرا ويكتب.
 * الرابط ده خاص بيك — ما تنشرهوش. ولو حبيت تلغيه: Deploy → Manage deployments → Archive.
 */

var SHEET_DATA = 'البيانات'
var SHEET_SHEETS = 'أوراق التخصص'
var SHEET_TASKS = 'قائمة التنفيذ'
var SHEET_LOG = 'سجل التعديلات'

/* الحالة الكاملة متخزّنة كـ JSON في خلية واحدة — ده المصدر اللي الموقع بيقراه.
   والتبويبات التانية نسخة مقروءة للبني آدم، بتتولّد مع كل حفظ. */

function doPost(e) {
  var lock = LockService.getScriptLock()
  try {
    lock.waitLock(20000)
  } catch (err) {
    return json({ ok: false, error: 'الملف مشغول، جرّب تاني' })
  }

  try {
    var body = JSON.parse(e.postData.contents)
    var action = body.action

    if (action === 'pull') {
      return json({ ok: true, state: loadState() })
    }

    if (action === 'push') {
      saveState(body.state || {})
      return json({ ok: true, savedAt: new Date().toISOString() })
    }

    return json({ ok: false, error: 'action غير معروف: ' + action })
  } catch (err) {
    return json({ ok: false, error: String(err) })
  } finally {
    lock.releaseLock()
  }
}

function doGet() {
  return json({ ok: true, state: loadState() })
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}

function ss() {
  return SpreadsheetApp.getActiveSpreadsheet()
}

function tab(name) {
  var s = ss().getSheetByName(name)
  if (!s) s = ss().insertSheet(name)
  return s
}

function loadState() {
  var s = tab(SHEET_DATA)
  var raw = s.getRange('B1').getValue()
  if (!raw) return { tasks: {}, sheets: [] }
  try {
    return JSON.parse(raw)
  } catch (err) {
    return { tasks: {}, sheets: [] }
  }
}

function saveState(state) {
  var data = tab(SHEET_DATA)
  data.getRange('A1').setValue('الحالة (JSON) — ما تعدّلش الخلية اللي جنبها يدوياً')
  data.getRange('B1').setValue(JSON.stringify(state))
  data.getRange('A2').setValue('آخر حفظ')
  data.getRange('B2').setValue(new Date())
  data.setColumnWidth(1, 320)

  writeSheetsTab(state.sheets || [])
  writeTasksTab(state.tasks || {})
  log('حفظ', (state.sheets || []).length + ' ورقة · ' + countDone(state.tasks || {}) + ' بند مخلّص')
}

function countDone(tasks) {
  var n = 0
  for (var k in tasks) if (tasks[k]) n++
  return n
}

var FIELD_LABELS = [
  ['exact', 'التخصص بالضبط'],
  ['money', 'كيف بيكسبوا فلوس وقيمة الزبون'],
  ['count', 'عدد العملاء في المنطقة'],
  ['problems', 'أكبر ثلاث مشاكل'],
  ['dreams', 'أكبر ثلاث أحلام'],
  ['glossary', 'قاموس التخصص'],
  ['ads', 'مين بيعلن وشو العروض'],
  ['channel', 'قناة الرد'],
  ['seasons', 'المواسم'],
  ['bridge', 'جملة الجسر']
]

var SCORE_LABELS = [
  ['pay', 'بيقدر يدفع'],
  ['growing', 'عم يكبر'],
  ['reach', 'بتوصله'],
  ['operator', 'عندك منفّذ'],
  ['count', 'عددهم كافي'],
  ['savvy', 'مش خبير تسويق']
]

function writeSheetsTab(sheets) {
  var s = tab(SHEET_SHEETS)
  s.clear()

  var header = ['اسم الورقة']
  FIELD_LABELS.forEach(function (f) {
    header.push(f[1])
  })
  SCORE_LABELS.forEach(function (f) {
    header.push('درجة: ' + f[1])
  })
  header.push('بونص', 'المجموع من 33', 'آخر تحديث')

  var rows = [header]

  sheets.forEach(function (sh) {
    var row = [sh.name || '']
    var total = 0
    FIELD_LABELS.forEach(function (f) {
      row.push((sh.fields && sh.fields[f[0]]) || '')
    })
    SCORE_LABELS.forEach(function (f) {
      var v = (sh.scores && Number(sh.scores[f[0]])) || 0
      total += v
      row.push(v)
    })
    var bonus = Number(sh.bonus) || 0
    total += bonus
    row.push(bonus, total, sh.updatedAt || '')
    rows.push(row)
  })

  s.getRange(1, 1, rows.length, header.length).setValues(rows)
  s.getRange(1, 1, 1, header.length).setFontWeight('bold').setBackground('#d62976').setFontColor('#ffffff')
  s.setFrozenRows(1)
  s.setColumnWidth(1, 260)
  for (var c = 2; c <= FIELD_LABELS.length + 1; c++) s.setColumnWidth(c, 300)
  s.getRange(1, 1, rows.length, header.length).setVerticalAlignment('top').setWrap(true)
}

function writeTasksTab(tasks) {
  var s = tab(SHEET_TASKS)
  s.clear()
  var rows = [['معرّف البند', 'خلص؟']]
  for (var k in tasks) rows.push([k, tasks[k] ? 'نعم' : 'لأ'])
  s.getRange(1, 1, rows.length, 2).setValues(rows)
  s.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#d62976').setFontColor('#ffffff')
  s.setFrozenRows(1)
  s.setColumnWidth(1, 260)
}

function log(action, detail) {
  var s = tab(SHEET_LOG)
  if (s.getLastRow() === 0) {
    s.getRange(1, 1, 1, 3).setValues([['الوقت', 'الإجراء', 'التفاصيل']])
    s.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#d62976').setFontColor('#ffffff')
    s.setFrozenRows(1)
  }
  s.appendRow([new Date(), action, detail])
  /* بنسيب آخر 500 سطر بس عشان الشيت ما يكبرش */
  var last = s.getLastRow()
  if (last > 501) s.deleteRows(2, last - 501)
}
