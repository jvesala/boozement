var tableBody = $('#tab-insert .interval table tbody')

function padZero(val) { return (val > 9) ? val : "0" + val }
function getCurrentTime() {
  var now = new Date()
  return padZero(now.getHours()) + ":" + padZero(now.getMinutes())
}
function formatDate(date) {
  return padZero(date.getDate()) + "." + padZero(date.getMonth() + 1) + "." + date.getFullYear() +
    padZero(date.getHours()) + ":" + padZero(date.getMinutes())
}
function intervalStart() {
  var now = new Date()
  now.setDate(now.getDate() - 1)
  return formatDate(now)
}

function doInsert() {
  preSubmit()
  var insert = $.postAsObservable("api/insert", $('#form-insert').serialize()).publish()
  handleUnauthorized(insert)
  var insertResult = insert.select(resultDataMessage).catch(Rx.Observable.return("error"))
  insertResult.subscribe(resetSubmitStatus)
  insertResult.where(validData).subscribe(updateResult)
  insertResult.where(validData).subscribe(fetchCurrentInterval)
  insertResult.where(errorData).select(function(x) { return "Virhe syötössä!" } ).subscribe(updateError)
  insert.connect()
}

function fetchCurrentInterval() {
  tableBody.empty("").append('<tr colspan="3"><td><div class="busy"></div></td></tr>')
  var params = { start:intervalStart() }
  var servings = $.ajaxAsObservable({ url: "api/servings-interval", data: params}).publish()
  servings.connect()
  handleUnauthorized(servings)
  var rows = servings.catch(Rx.Observable.never()).select(resultData)
   .select(function(data) { return [$.map(data.servings, function(s) { return $.parseJSON(s)}), data.count, data.bac] })
   .catch(Rx.Observable.never())
  rows.subscribe(function(x) { tableBody.empty("").hide(); showIntervalTable(); addServingsToTable(tableBody, x[0]); updateBac(x[2]); tableBody.fadeIn() })
  rows.where(emptyResults).subscribe(hideIntervalTable)
}
function emptyResults(data) { return data[1] == 0 }
function updateBac(bac) { $('.interval table .bac').text(bac) }
function hideIntervalTable() { $('.interval table').hide() }
function showIntervalTable() { $('.interval table').fadeIn() }

$(function() {
  $(".dateElement").continuousCalendar({weeksBefore: 60,weeksAfter: 1, isPopup: true, locale: DateLocale.FI, selectToday: true})
  $('#submit').onAsObservable('click').doAction(preventDefault).subscribe(doInsert)
  $('#time').val(getCurrentTime())
  updateLoggedIn()
  fetchCurrentInterval()
  $('#type').focus()
});
