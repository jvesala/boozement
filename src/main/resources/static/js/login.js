function loginParams() { return $("#form-login").serialize() }
function userDataParams() { return $("#tab-userdata form").serialize() }

function doLogin() {
  preSubmit()
  $.postAsObservable("api/login", loginParams()).Subscribe(loginSuccessful, loginFailed)
}

function loginSuccessful() {
  showTabHeaders()
  showTab("tab-header-insert")
  updateLoggedIn()
}

function loginFailed(error) {
  if(error.xmlHttpRequest.status == "401") { updateError("Väärä kirjautumistunnus tai salasana.") }
  else if(error.xmlHttpRequest.status == "500") { updateError("Virhetilanne kirjautumisessa. Yritä uudelleen.") }
  resetSubmitStatus()
}

function convertUserdataFormToRegisterForm(x) { 
  var data = $(x)
  var text = $('<div class="registerTitle">Rekisteröityminen</div>')
  var button = $('<button type="submit" id="back" tabindex="8">Takaisin kirjautumissivulle</button>')
  var register = $('<button type="submit" id="register" tabindex="7">Rekisteröidy</button>')
  data.find('#submit').after(register).after(button).detach()
  data.prepend(text)
  return data
}
function openRegister() {
  $.ajaxAsObservable({ url: "userdata.html"}).Catch(Rx.Observable.Return({data: "Virhetilanne"}))
    .Select(resultData)
    .Select(convertUserdataFormToRegisterForm)
    .Subscribe(function(x) { 
      setPageContent(x)
      $('#back').toObservable('click').Subscribe(loadLogin)
      $('#register').toObservable('click').Subscribe(doRegister)
      combine([emailValidation, passwordValidation, pwdValidation]).Subscribe(disableEffect($('#register')))
    })
}

function doRegister() {
  preSubmit()
  $.postAsObservable("api/register", userDataParams()).Subscribe(registerSuccessful, registerFailed)
}

function registerSuccessful() {
  $.postAsObservable("api/login", loginParams()).Subscribe(loginAfterRegisterSuccessful, loginFailed)
} 

function loginAfterRegisterSuccessful() {
  setPageContent('<div id="tab-welcome" class="tab">Olet nyt rekisteröinyt palvelun käyttäjäksi. Tervetuloa.</div>')
  showTabHeaders() 
  updateLoggedIn()
} 

function registerFailed(error) {
  if(error.xmlHttpRequest.status == "409") { updateError("Kirjautumistunnus on varattu.") }
  else updateError("Rekisteröinti epäonnistui jostain syystä. Yritä uudelleen.")
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
  $('#register').toObservable('click').Subscribe(openRegister)
  $('#email').focus()
});
