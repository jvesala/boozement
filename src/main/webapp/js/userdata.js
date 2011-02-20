function insertUserUpdateParams() {
  var fields = ["email", "password", "password-copy"]
  return $.map(fields, function(f) { return f + "=" + $('#' + f).val() } ).join("&")
}

function doUserDataUpdate() {
  preSubmit()
  var update = $.postAsObservable("api/update-user", insertUserUpdateParams()).Publish()
  handleUnauthorized(update)
  var result = update.Select(resultDataMessage).Catch(Rx.Observable.Return("error"))
  result.Subscribe(resetSubmitStatus)
  result.Where(validData).Subscribe(updateResult)
  result.Where(errorData).Select(function(x) { return "Virhe tietojen päivityksessä!" } ).Subscribe(updateError)
  update.Connect()
}

$(function() {
  $('#submit').toObservable('click').Subscribe(doUserDataUpdate)
  doWhoAmI().Where(notF(emptyData)).Subscribe(function(email) { $('#email').val(email).keyup() } )
  updateLoggedIn()
});