function loginParams() { return "email=" + $('#email').val() + "&password=" + $('#password').val() }

function doLogin() {
  preSubmit()
  var login = $.postAsObservable("api/login", loginParams()).Publish()
  login.Subscribe(skip, function(error) {
    if(error.xmlHttpRequest.status == "401") { updateResult("Väärä kirjautumistunnus tai salasana.") }
    else if(error.xmlHttpRequest.status != "200") { updateResult("Virhetilanne kirjautumisessa. Yritä uudelleen.") }
    resetSubmitStatus()
  }, skip)
  var loginContent = login.Select(function(d) { return d.data }).Catch(Rx.Observable.Never()).Publish()
  loginContent.Subscribe(setPageContent)
  loginContent.Subscribe(function(x) { showTabHeaders(); updateLoggedIn() })
  login.Connect()
  loginContent.Connect()
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
