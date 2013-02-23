function deSelectTabHeader() { $('nav div').each(function() { $(this).removeClass("selected") }) }
function setPageContent(content) { setElementContent($('#page-content div'), content) }
function setElementContent(element, content) { element.hide().empty().html(content).fadeIn() }
function updateResult(html) { $('#error').hide(); $('#result').html(html).show() }
function updateError(html) { $('#result').hide(); $('#error').html(html).show() }
function skip() { return function(x) {} }
function loginPage() { return $.ajaxAsObservable({ url: "login.html"}).Select(resultData).Catch(Rx.Observable.Return("Virhetilanne!")) }
function handleUnauthorized(sourceObservable) { sourceObservable.Subscribe(skip, openLoginIfNotAuthenticated, skip)}
function openLoginIfNotAuthenticated(error) { if(error.xmlHttpRequest.status == "401") { loadLogin() } }
function loadLogin() { loginPage().Subscribe(setPageContent); hideTabHeaders() }

function prependHtml(html) { return function(x) { return $(x).prepend(html) }}
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

function resultData(data) { return data.data }
function resultDataMessage(data) { return data.data.message }
function userName(data) { return data.user }
function validData(data) { return data && data != "error" }
function errorData(data) { return data == "error" }
function emptyData(data) { return data == "" }
function notF(validatorF) { return function() { return !validatorF.apply(this, arguments) } }
function preventDefault(event) { event.preventDefault() }

function doWhoAmI() { return $.ajaxAsObservable({ url: "api/whoami"} ).Select(resultData).Select(userName) }
function doUserdata() { return $.ajaxAsObservable({ url: "api/userdata"} ).Select(resultData) }

function updateLoggedIn() {
  $('.session-busy').show()
  var whoAmI = doWhoAmI()
  whoAmI.Subscribe(function(x) { $('.session-busy').hide() })
  whoAmI.Where(errorData).Subscribe(showLoggedError)
  whoAmI.Where(emptyData).Subscribe(showLoggedOut)
  whoAmI.Where(function(d) { return d.length > 0 }).Subscribe(showLoggedIn)
}

function id(e) { return e.target.id }
function showTab(tabId) {
  deSelectTabHeader()
  setPageContent('<div class="busy"></div>')
  showBusy()
  $("." + tabId).addClass("selected")
  $.ajaxAsObservable({ url: tabId.split("-").pop() + ".html"}).Catch(Rx.Observable.Return({data: "Virhetilanne"}))
    .Select(resultData)
    .Subscribe(setPageContent)
}

function showBusy() { $('.busy').show() }
function hideBusy() { $('.busy').hide() }
function showTabHeaders() { $('header aside').show() }
function hideTabHeaders() { $('header aside').hide() }
function enableSubmitButton() { $('#submit').removeAttr("disabled") }
function disableSubmitButton() { $('#submit').attr("disabled", "disabled") }
function preSubmit() { disableSubmitButton(); showBusy() }
function resetSubmitStatus() { hideBusy(); enableSubmitButton() }

// String -> (a -> a)
function trace(s) {
  return function(x) {
    console.log(s + '> ' + x)
    return x
  }
}
function debug(s) { console.log(s) }

$(function () {
  $('nav div').toObservable('click').Select(id).Subscribe(showTab)
  $('#logout').toObservable('click').Subscribe(logOut)
  doWhoAmI().Where(emptyData).Subscribe(loadLogin)
  updateLoggedIn()
});
