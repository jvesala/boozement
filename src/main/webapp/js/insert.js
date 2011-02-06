function insertParams() {
  var fields = ["date", "time", "type", "amount"]
  return $.map(fields, function(f) { return f + "=" + $('#' + f).val() } ).join("&")
}

function getCurrentTime() {
  var now = new Date()
  var hours = (now.getHours() > 9) ? now.getHours() : "0"  + now.getHours()
  var minutes = (now.getMinutes() > 9) ? now.getMinutes() : "0"  + now.getMinutes()
  return hours + ":" + minutes
}

function doInsert() {
  preSubmit()
  var insert = $.postAsObservable("api/insert", insertParams()).Publish()
  handleUnauthorized(insert)
  insert.Select(resultDataMessage).Catch(Rx.Observable.Never())
    .Subscribe(function(x) { updateResult(x); resetSubmitStatus() })
  insert.Connect()
}

$(function() {
  $('#submit').toObservable('click').Subscribe(doInsert)
  $('#time').val(getCurrentTime())
  updateLoggedIn()
});
