var tableBody = $('#tab-insert .interval table tbody')

function insertParams() {
  var fields = ["date", "time", "type", "amount"]
  return $.map(fields, function(f) { return f + "=" + $('#' + f).val() } ).join("&")
}

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
  var insert = $.postAsObservable("api/insert", insertParams()).Publish()
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
   .Select(function(data) { return [$.map(data.servings, function(s) { return $.parseJSON(s)}), data.count] })
   .Catch(Rx.Observable.Never())
  rows.Subscribe(function(x) { tableBody.empty("").hide(); addServingsToTable(tableBody, x[0]); tableBody.fadeIn() })
  rows.Where(emptyResults).Subscribe(hideIntervalTable)
}
function emptyResults(data) { return data[1] == 0 }
function hideIntervalTable() { $('.interval table').hide() }

$(function() {
  $('#submit').toObservable('click').Subscribe(doInsert)
  $('#time').val(getCurrentTime())
  updateLoggedIn()
  fetchCurrentInterval()
});
