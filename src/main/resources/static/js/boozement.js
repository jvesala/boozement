function updateResult(html) { $('#error').hide(); $('#result').html(html).show() }
function updateError(html) { $('#result').hide(); $('#error').html(html).show() }
function skip() { return function(x) {} }
function handleUnauthorized(sourceObservable) { sourceObservable.subscribe(skip, openLoginIfNotAuthenticated, skip)}
function openLoginIfNotAuthenticated(error) { if(error.jqXHR.status == "401") { loadLogin() } }

function loadLogin() { loadTab("login") }
function showLoggedIn(email) { $('.session span').html(email); $('.session.valid').removeClass('hidden') }
function showLoggedOut() { $('.session.valid').addClass('hidden') }
function showLoggedError() { $('.session.valid').html("Virhe. Lataa sivu uudestaan...").show() }
function logOut() {
  $.postAsObservable("api/logout").select(resultData)
    .catch(Rx.Observable.return("Virhetilanne"))
    .subscribe(function(x) {
      loadTab("login").subscribe(function(x) {
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

function doWhoAmI() { return $.ajaxAsObservable({ url: "api/whoami"} ).select(resultData).select(userName) }
function doUserdata() { return $.ajaxAsObservable({ url: "api/userdata"} ).select(resultData) }

function updateLoggedIn() {
  var whoAmI = doWhoAmI().publish()
  whoAmI.connect()
  whoAmI.where(errorData).subscribe(showLoggedError)
  whoAmI.where(emptyData).subscribe(showLoggedOut)
  whoAmI.where(function(d) { return d.length > 0 }).subscribe(showLoggedIn)
  return whoAmI
}

function id(e) { return e.target.id }
function showTab(tabId) {
  //setPageContent('<div class="busy"></div>')
  //showBusy()
  $('.tab-header').removeClass("current_page_item")
  $("#" + tabId).parent().addClass("current_page_item")
  var name = tabId.split("-").pop()
  loadTab(name)
}

function loadTab(name) {
  var loader = $.ajaxAsObservable({ url: name + ".html"}).catch(Rx.Observable.return({data: "Virhetilanne"})).select(resultData)
  loader.subscribe(function(html) {
    $('#page-content').html(html)
    //$('#page-content').hide().empty().html(html)
    //$.getScript("js/" + name + ".js", function () { $('#page-content').show() })
  })
  return loader
}

function showBusy() { $('.busy').show() }
function hideBusy() { $('.busy').hide() }
function enableSubmitButton() { $('#submit').removeAttr("disabled") }
function disableSubmitButton() { $('#submit').attr("disabled", "disabled") }
function preSubmit() { disableSubmitButton(); showBusy() }
function resetSubmitStatus() { hideBusy(); enableSubmitButton() }
function padZero(val) { return (val > 9) ? val : "0" + val }

// String -> (a -> a)
function trace(s) {
  return function(x) {
    console.log(s + '> ' + x)
    return x
  }
}
function debug(s) { console.log(s) }

$(function () {
  $('nav li').onAsObservable('click').select(id).subscribe(showTab)
  $('#logout').onAsObservable('click').subscribe(logOut)
  updateLoggedIn().where(emptyData).subscribe(loadLogin)
  updateLoggedIn().where(function(d) { return d.length > 0 }).subscribe(function() { showTab("tab-header-insert") })
})
