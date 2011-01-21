function deSelectTabHeader() { $('.tab-header').each(function() { $(this).removeClass("selected") }); }
function setPageContent() { return function(content) { setElementContent($('#page-content div'), content); }}
function setElementContent(element, content) { element.hide().empty().html(content).fadeIn(); }
function updateResult(html) { $('#result').html(html).show(); }
function skip() { return function(x) {} };
function fetchLoginToContent() { $.ajaxAsObservable({ url: "login.html"}).Select(function(d) { return d.data; }).Subscribe(setPageContent()); }
function handleUnauthorized(sourceObservable) {
  sourceObservable.Subscribe(skip, function(error) {
    if(error.xmlHttpRequest.status == "401") {
      fetchLoginToContent(); 
      hideTabHeaders();
    }
  }, skip);
}
function showLoggedIn(email) { $('.session.invalid').hide(); $('.session span').html(email); $('.session.valid').show(); }
function showLoggedOut() { $('.session.valid').hide(); $('.session.invalid').show(); }
function showLoggedError() { $('.session.valid').html("Virhe. Lataa sivu uudestaan...").show(); $('.session.invalid').hide(); }
function logOut() {
  var logOut = $.postAsObservable("api/logout").Select(function(d) { return d.data; })
    .Catch(Rx.Observable.Return("Virhetilanne")).Publish();
  logOut.Subscribe(setPageContent());
  logOut.Subscribe(function(x) {  showLoggedOut(); });
  logOut.Connect();
}
function updateLoggedIn() {
  $('.session-busy').show();
  var whoAmI = $.ajaxAsObservable({ url: "api/whoami"} ).Catch(Rx.Observable.Return("error"))
  whoAmI.Subscribe(function(x) { $('.session-busy').hide() })
  whoAmI.Where(function(d) { return d == "error" }).Subscribe(showLoggedError)
  whoAmI.Where(function(d) { return d.data == "" }).Subscribe(showLoggedOut)
  whoAmI.Where(function(d) { return d.data.length > 0 }).Subscribe(function(d) { showLoggedIn(d.data) })
}

function showTab(tabId) {
  deSelectTabHeader()
  $("." + tabId).addClass("selected")
  $.ajaxAsObservable({ url: tabId.split("-").pop() + ".html"}).Catch(Rx.Observable.Return({data: "Virhetilanne"}))
    .Select(function(d) { return d.data; })
    .Subscribe(setPageContent())
}

function showBusy() { $('.busy').show(); }
function hideBusy() { $('.busy').hide(); }
function showTabHeaders() { $('.tab-header').show(); }
function hideTabHeaders() { $('.tab-header').hide(); }
function enableSubmitButton() { $('input[type=submit]').removeAttr("disabled") }
function disableSubmitButton() { $('input[type=submit]').attr("disabled", "disabled") }
function preSubmit() { disableSubmitButton(); showBusy(); }
function resetSubmitStatus() { hideBusy(); enableSubmitButton(); }

function showWelcomeTab() {
  var welcome = $.ajaxAsObservable({url: "api/welcome"}).Publish();
  handleUnauthorized(welcome);
  welcome
    .Select(function(d) { return d.data; })
    .Catch(Rx.Observable.Never())
    .Subscribe(setPageContent());
  welcome.Connect();
}

$(function () {
  $('.tab-header').toObservable('click').Select(function(x) { return x.srcElement.id }).Subscribe(showTab)
  showWelcomeTab();
  updateLoggedIn();
});