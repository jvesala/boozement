function doUserDataUpdate() {
  preSubmit()
  var update = $.postAsObservable("api/update-user", userDataParams()).Publish()
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
  doUserdata().Subscribe(function(user) { 
    $('#email').val(user.email).keyup() 
    $('input[value="' + user.gender + '"]').click()
    $('#weight').val(user.weight).keyup()
    updateLoggedIn()
  }, function(_) { updateLoggedIn()})
});