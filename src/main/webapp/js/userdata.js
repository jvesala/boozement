function insertUserUpdateParams() {
  var fields = ["email", "password", "password-copy"]
  return $.map(fields, function(f) { return f + "=" + encodeURI($('#' + f).val()) } ).join("&")
}

function doUserDataUpdate() {
  preSubmit()
  var update = $.postAsObservable("api/update-user", insertUserUpdateParams()).Publish()
  handleUnauthorized(update)
  var result = update.Select(resultDataMessage)
  result.Subscribe(updateSuccessful, updateFailed)
  update.Connect()
}

function updateSuccessful(message) {
  resetSubmitStatus()
  updateResult(message)
}

function updateFailed(error) {
  if(error.xmlHttpRequest.status == "409") updateError("Kirjautumistunnus on varattu.")
  else updateError("Virhe tietojen päivityksessä!")
  resetSubmitStatus()
}

$(function() {
  $('#submit').toObservable('click').Subscribe(doUserDataUpdate)
  doWhoAmI().Where(notF(emptyData)).Subscribe(function(email) { $('#email').val(email).keyup() } )
  updateLoggedIn()
});