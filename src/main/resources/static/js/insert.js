
function getCurrentTime() {
  var now = new Date()
  return padZero(now.getHours()) + ":" + padZero(now.getMinutes())
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


$(function() {
  $(".dateElement").continuousCalendar({weeksBefore: 60,weeksAfter: 1, isPopup: true, locale: DateLocale.FI, selectToday: true})
  $('#submit').onAsObservable('click').doAction(preventDefault).subscribe(doInsert)
  $('#time').val(getCurrentTime())
  updateLoggedIn()
  $('#type').focus()
});
