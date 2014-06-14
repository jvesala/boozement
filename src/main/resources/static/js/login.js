function loginParams() { return $("#form-login").serialize() }
function userDataParams() { return $("#tab-userdata form").serialize() }

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

function convertUserdataFormToRegisterForm(x) { 
  var data = $(x)
  data.find('.registerTitle').removeClass('hidden')
  data.find('#back').removeClass('hidden')
  data.find('#register').removeClass('hidden')
  data.find('#submit').addClass('hidden')
  return data
}
function openRegister() {
  $.ajaxAsObservable({ url: "userdata.html"}).catch(Rx.Observable.return({data: "Virhetilanne"}))
    .select(resultData)
    .select(convertUserdataFormToRegisterForm)
    .subscribe(function(x) {
      $('#page-content').html(x)
      $('#back').toObservable('click').subscribe(loadLogin)
      $('#register').toObservable('click').subscribe(doRegister)
      combine([emailValidation, passwordValidation, pwdValidation]).subscribe(disableEffect($('#register')))
    })
}

function doRegister() {
  preSubmit()
  $.postAsObservable("api/register", userDataParams()).subscribe(registerSuccessful, registerFailed)
}

function registerSuccessful() {
  $.postAsObservable("api/login", loginParams()).subscribe(loginAfterRegisterSuccessful, loginFailed)
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
  var email = $('#email').changes()
  var emailValidation = mkValidation(email, requiredValidator())
  var password = $('#password').changes()
  var passwordValidation = mkValidation(password, requiredValidator())
  var all = combine([emailValidation, passwordValidation])
  all.subscribe(disableEffect($('#submit')))
	
  $('#submit').onAsObservable('click').subscribe(doLogin)
  $('#register').onAsObservable('click').subscribe(openRegister)
  $('#email').focus()
});
