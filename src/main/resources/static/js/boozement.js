function updateResult(html) { $('#error').hide(); $('#result').html(html).show() }
function updateError(html) { $('#result').hide(); $('#error').html(html).show() }
function skip() { return function(x) {} }
function handleUnauthorized(sourceObservable) { sourceObservable.Subscribe(skip, openLoginIfNotAuthenticated, skip)}
function openLoginIfNotAuthenticated(error) { if(error.xmlHttpRequest.status == "401") { loadLogin() } }

function loadLogin() { loadTab("login") }
function showLoggedIn(email) { $('.session span').html(email); $('.session.valid').removeClass('hidden') }
function showLoggedOut() { $('.session.valid').addClass('hidden') }
function showLoggedError() { $('.session.valid').html("Virhe. Lataa sivu uudestaan...").show() }
function logOut() {
  $.postAsObservable("api/logout").Select(resultData)
    .Catch(Rx.Observable.Return("Virhetilanne"))
    .Subscribe(function(x) {
      loadTab("login").Subscribe(function(x) {
        $('.logout-message').removeClass('hidden')
        showLoggedOut()
      })
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
  var whoAmI = doWhoAmI()
  whoAmI.Where(errorData).Subscribe(showLoggedError)
  whoAmI.Where(emptyData).Subscribe(showLoggedOut)
  whoAmI.Where(function(d) { return d.length > 0 }).Subscribe(showLoggedIn)
}

function id(e) { return e.target.id }
function showTab(tabId) {
  //setPageContent('<div class="busy"></div>')
  //showBusy()
  $('.tab-header').removeClass("selected")
  $("#" + tabId).addClass("selected")
  var name = tabId.split("-").pop()
  loadTab(name)
}

function loadTab(name) {
  var loader = $.ajaxAsObservable({ url: name + ".html"}).Catch(Rx.Observable.Return({data: "Virhetilanne"})).Select(resultData)
  loader.Subscribe(function(html) {
    $('#page-content').hide().empty().html(html)
    $.getScript("js/" + name + ".js", function () { $('#page-content').show() })
  })
  return loader
}

function showBusy() { $('.busy').show() }
function hideBusy() { $('.busy').hide() }
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
  $('.tab-header').toObservable('click').Select(id).Subscribe(showTab)
  $('#logout').toObservable('click').Subscribe(logOut)
  doWhoAmI().Where(emptyData).Subscribe(loadLogin)
  // todo: load insert if session is valid
  updateLoggedIn()
});