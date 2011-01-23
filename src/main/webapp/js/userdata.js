function insertUserUpdateParams() {
  var fields = ["email", "password", "password-copy"]
  return $.map(fields, function(f) { return f + "=" + $('#' + f).val() } ).join("&")
}

function doUserDataUpdate() {
  preSubmit()
  var update = $.postAsObservable("api/update-user", insertUserUpdateParams()).Publish()
  handleUnauthorized(update)
  update.Select(function(d) { return d.data.message }).Catch(Rx.Observable.Never())
    .Subscribe(function(x) { updateResult(x); resetSubmitStatus() })
  update.Connect()
}

$(function() {
  $('#submit').toObservable('click').Subscribe(doUserDataUpdate)
  $.ajaxAsObservable({ url: "api/whoami"} ).Catch(Rx.Observable.Never())
    .Subscribe(function(email) { $('#email').val(email.data).keyup() } )
  updateLoggedIn()
});