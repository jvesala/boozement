function registrationDataParams() { return $("#form-registration").serialize() }

function doRegister() {
  preSubmit()
  var email = $('#email').val()
  var password = $('#password').val()
  $.postAsObservable("api/register", registrationDataParams()).subscribe(registerSuccessful(email, password), registerFailed)
}

function registerSuccessful(email, password) {
  return function() {
    var loginData = "email=" + email + "&password=" + password
    $.postAsObservable("api/login", loginData).subscribe(loginAfterRegisterSuccessful, loginFailed)
  }
}

function loginAfterRegisterSuccessful() {
  $('#page-content').html('<div id="tab-welcome" class="tab">Olet nyt rekisteröinyt palvelun käyttäjäksi. Tervetuloa.</div>')
  updateLoggedIn()
}

function registerFailed(error) {
  if(error.jqXHR.status == "409") { updateError("Kirjautumistunnus on varattu.") }
  else updateError("Rekisteröinti epäonnistui jostain syystä. Yritä uudelleen.")
  resetSubmitStatus()
}

$(function() {
  $('#back').onAsObservable('click').subscribe(loadLogin)
  $('#register').onAsObservable('click').subscribe(doRegister)
})