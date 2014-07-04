function loginParams() { return $("#form-login").serialize() }

function doLogin() {
  preSubmit()
  $.postAsObservable("api/login", loginParams()).subscribe(loginSuccessful, loginFailed)
}

function loginSuccessful() {
  showTab("tab-header-insert")
  updateLoggedIn()
}

function loginFailed(error) {
  if(error.jqXHR.status == "401") { updateError("Väärä kirjautumistunnus tai salasana.") }
  else if(error.jqXHR.status == "500") { updateError("Virhetilanne kirjautumisessa. Yritä uudelleen.") }
  resetSubmitStatus()
}

function openRegister() {
  loadTab("registration")
}

$(function() {
  var email = $('#email').changes()
  var emailValidation = mkValidation(email, requiredValidator())
  var password = $('#password').changes()
  var passwordValidation = mkValidation(password, requiredValidator())
  var all = combine([emailValidation, passwordValidation])
  all.subscribe(disableEffect($('#submit')))
	
  $('#submit').onAsObservable('click').subscribe(doLogin)
  $('#registration').onAsObservable('click').subscribe(openRegister)
  $('#email').focus()
});
