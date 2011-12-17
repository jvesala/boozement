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
  var insert = $.postAsObservable("api/insert", $('#form-insert').serialize()).Publish()
  handleUnauthorized(insert)
  var insertResult = insert.Select(resultDataMessage).Catch(Rx.Observable.Return("error"))
  insertResult.Subscribe(resetSubmitStatus)
  insertResult.Where(validData).Subscribe(updateResult)
  insertResult.Where(validData).Subscribe(fetchCurrentInterval)
  insertResult.Where(errorData).Select(function(x) { return "Virhe syötössä!" } ).Subscribe(updateError)
  insert.Connect()
}

function fetchCurrentInterval() {
  tableBody.empty("").append('<tr colspan="3"><td><div class="busy"></div></td></tr>')
  var params = { start:intervalStart() }
  var servings = $.ajaxAsObservable({ url: "api/servings-interval", data: params}).Publish()
  servings.Connect()
  handleUnauthorized(servings)
  var rows = servings.Catch(Rx.Observable.Never()).Select(resultData)
   .Select(function(data) { return [$.map(data.servings, function(s) { return $.parseJSON(s)}), data.count, data.bac] })
   .Catch(Rx.Observable.Never())
  rows.Subscribe(function(x) { tableBody.empty("").hide(); showIntervalTable(); addServingsToTable(tableBody, x[0]); updateBac(x[2]); tableBody.fadeIn() })
  rows.Where(emptyResults).Subscribe(hideIntervalTable)
}
function emptyResults(data) { return data[1] == 0 }
function updateBac(bac) { $('.interval table .bac').text(bac) }
function hideIntervalTable() { $('.interval table').hide() }
function showIntervalTable() { $('.interval table').fadeIn() }

$(function() {
  $(".dateElement").continuousCalendar({weeksBefore: 60,weeksAfter: 1, isPopup: true, locale:DATE_LOCALE_FI, selectToday: true})
  $('#submit').toObservable('click').Do(preventDefault).Subscribe(doInsert)
  $('#time').val(getCurrentTime())
  updateLoggedIn()
  fetchCurrentInterval()
  $('#type').focus()
});
