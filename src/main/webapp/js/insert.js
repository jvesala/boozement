function insertParams() {
  var fields = ["date", "time", "type", "amount"];
  return jQuery.map(fields, function(f, i) { return f + "=" + $('#' + f).val();} ).join("&");
}

function getCurrentTime() {
  var now = new Date();
  var hours = (now.getHours() > 9) ? now.getHours() : "0"  + now.getHours();
  var minutes = (now.getMinutes() > 9) ? now.getMinutes() : "0"  + now.getMinutes();
  return hours + ":" + minutes;
}

function doInsert() {
  preSubmit();
  var insert = $.postAsObservable("api/insert", insertParams()).Publish();
  handleUnauthorized(insert);
  insert.Select(function(d) { return d.data.message; }).Catch(Rx.Observable.Never())
    .Subscribe(function(x) { updateResult(x); resetSubmitStatus(); });
  insert.Connect();
}

$(function() {
  $('#submit').click(function (x) { doInsert(); return false; });
  $('#time').val(getCurrentTime());
  updateLoggedIn();  
});
