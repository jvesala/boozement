function doUserDataUpdate() {
  preSubmit()
  var update = $.postAsObservable("api/update-user", userDataParams()).publish()
  handleUnauthorized(update)
  var result = update.select(resultDataMessage)
  result.subscribe(updateSuccessful, updateFailed)
  update.connect()
}

function updateSuccessful(message) {
  resetSubmitStatus()
  updateResult(message)
}

function updateFailed(error) {
  if(error.jqXHR.status == "409") updateError("Kirjautumistunnus on varattu.")
  else updateError("Virhe tietojen päivityksessä!")
  resetSubmitStatus()
}

$(function() {
  $('#submit').onAsObservable('click').subscribe(doUserDataUpdate)
  doUserdata().subscribe(function(user) {
    $('#email').val(user.email).keyup() 
    $('input[value="' + user.gender + '"]').click()
    $('#weight').val(user.weight).keyup()
    updateLoggedIn()
  }, function(_) { updateLoggedIn()})
});