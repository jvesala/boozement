function loginParams() { return "email=" + $('#email').val() + "&password=" + $('#password').val() }

function doLogin() {
  preSubmit()
  $.postAsObservable("api/login", loginParams()).Subscribe(loginSuccessful, loginFailed)
}

function loginSuccessful() {
  setPageContent('<div id="tab-welcome" class="tab">Tervetuloa</div>')
  showTabHeaders() 
  updateLoggedIn()
} 

function loginFailed(error) {
  if(error.xmlHttpRequest.status == "401") { updateError("Väärä kirjautumistunnus tai salasana.") }
  else if(error.xmlHttpRequest.status == "500") { updateError("Virhetilanne kirjautumisessa. Yritä uudelleen.") }
  resetSubmitStatus()
}

$(function() {
  var email = $('#email').changes()
  var emailValidation = mkValidation(email, requiredValidator())
  var password = $('#password').changes()
  var passwordValidation = mkValidation(password, requiredValidator())
  var all = combine([emailValidation, passwordValidation])
  all.Subscribe(disableEffect($('#submit')))
	
  $('#submit').toObservable('click').Subscribe(doLogin)
});
