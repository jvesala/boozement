function userDataParams() { return $("#form-userdata").serialize() }

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
  updateError("Virhe tietojen päivityksessä!")
  resetSubmitStatus()
}

$(function() {
  updateLoggedIn()
  $('#submit').onAsObservable('click').subscribe(doUserDataUpdate)
  doUserdata().subscribe(function(user) {
    $('#email').text(user.email)
    if (user.gender == "M") { $('#gender').text("Mies") } else { $('#gender').text("Nainen") }
    $('#weight').val(user.weight).keyup()
  })
})