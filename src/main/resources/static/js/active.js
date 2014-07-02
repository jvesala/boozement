function formatDate(date) {
  return padZero(date.getDate()) + "." + padZero(date.getMonth() + 1) + "." + date.getFullYear() +
    padZero(date.getHours()) + ":" + padZero(date.getMinutes())
}
function intervalStart() {
  var now = new Date()
  now.setDate(now.getDate() - 1)
  return formatDate(now)
}
function emptyResults(data) { return data[1] == 0 }
function updateBac(bac) { $('.interval table .bac').text(bac) }
function hideIntervalTable() { $('.inactive').show(); $('.interval table').hide() }
function showIntervalTable() { $('.inactive').hide(); $('.interval table').fadeIn() }


function fetchCurrentInterval() {
  var tableBody = $('.interval table tbody')
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

$(function() {
  updateLoggedIn()
  fetchCurrentInterval()
})
