function loginPage() { return $.ajaxAsObservable({ url: "login.html"}).Select(resultData).Catch(Rx.Observable.Return("Virhetilanne!")) }
function handleUnauthorized(sourceObservable) { sourceObservable.Subscribe(skip, openLoginIfNotAuthenticated, skip)}
function openLoginIfNotAuthenticated(error) { if(error.xmlHttpRequest.status == "401") { loadLogin() } }
function loadLogin() { loginPage().Subscribe(setPageContent); hideTabHeaders() }

function loginParams() { return "email=" + $('#email').val() + "&password=" + $('#password').val() }
function showLoggedIn(email) { $('.session.invalid').hide(); $('.session span').html(email); $('.session.valid').show() }
function showLoggedOut() { $('.session.valid').hide(); $('.session.invalid').show() }
function showLoggedError() { $('.session.valid').html("Virhe. Lataa sivu uudestaan...").show(); $('.session.invalid').hide() }
function logOut() {
  var logOut = $.postAsObservable("api/logout").Select(resultData)
    .Catch(Rx.Observable.Return("Virhetilanne"))
  logOut.Subscribe(function(x) {
    loginPage().Select(prependHtml("<div>Olet kirjautunut ulos.</div>")).Subscribe(setPageContent)
    showLoggedOut()
    hideTabHeaders()
  })
}


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
  var text = $('<div class="registerTitle">Rekisteröityminen</div>')
  var button = $('<button type="submit" id="back">Takaisin kirjautumissivulle.</button>')
  var register = $('<button type="submit" id="register">Rekisteröidy</button>')
  data.find('#submit').after(register).detach()
  data.prepend(button).prepend(text)
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
  $.postAsObservable("api/register", loginParams()).Subscribe(registerSuccessful, registerFailed)
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
});
