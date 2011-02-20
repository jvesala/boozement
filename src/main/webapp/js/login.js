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

function convertUserdataFormToRegisterForm(x) { 
  var data = $(x)
  data.find('#submit').html("Rekisteröidy")
  data.find('#submit').toObservable('click').Subscribe(doRegister)
  data.find('#back').toObservable('click').Subscribe(debug)
  return data
}
function openRegister() {
  $.ajaxAsObservable({ url: "userdata.html"}).Catch(Rx.Observable.Return({data: "Virhetilanne"}))
    .Select(resultData)
    .Select(prependHtml('<div class="registerTitle">Rekisteröityminen</div><button type="submit" id="back">Takaisin</button>'))
    .Select(convertUserdataFormToRegisterForm)
    .Subscribe(setPageContent)
}

function doRegister() {
  preSubmit()
  $.postAsObservable("api/register", loginParams()).Subscribe(registerSuccessful, registerFailed)
}

function registerSuccessful() {
  setPageContent('<div id="tab-welcome" class="tab">Olet nyt rekisteröinyt palvelun käyttäjäksi. Tervetuloa.</div>')
  showTabHeaders() 
  updateLoggedIn()
} 

function registerFailed() {
  updateError("Rekisteröinti epäonnistui jostain syystä. Yritä uudelleen.")
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
});
