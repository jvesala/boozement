function deSelectTabHeader() { $('.tab-header').each(function() { $(this).removeClass("selected") }); }
function setPageContent() { return function(content) { setElementContent($('#page-content'), content); }}
function setElementContent(element, content) { element.children().detach(); element.append(content);}
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
function showLoggedIn(email) { $('.session.invalid').hide();$('.session-busy').hide(); $('.session span').html(email); $('.session.valid').show(); }
function showLoggedOut() { $('.session.valid').hide(); $('.session-busy').hide(); $('.session.invalid').show(); }
function logOut() {
  var logOut = $.postAsObservable("api/logout").Select(function(d) { return d.data; })
    .Catch(Rx.Observable.Return("Virhetilanne")).Publish();
  logOut.Subscribe(setPageContent());
  logOut.Subscribe(function(x) {  showLoggedOut(); });
  logOut.Connect();
}
function updateLoggedIn() {
  $('.session-busy').show();
  $.ajaxAsObservable({ url: "api/whoami"} )
    .Catch(Rx.Observable.Return({data: "Virhetilanne"}))
    .Subscribe(function(d) { if(d.data == "") {showLoggedOut()} else {showLoggedIn(d.data)}});
}


function getUrlAsObservable(url) {
  return $.ajaxAsObservable({ url: url})
      .Catch(Rx.Observable.Return({data: "Virhetilanne"}))
      .Select(function(d) { return d.data; });
}
function showTab(tabHeader, url) {
  deSelectTabHeader();
  tabHeader.addClass("selected");
  var source = getUrlAsObservable(url);
  source.Subscribe(setPageContent());
}

function showBusy() { $('.busy').show(); }
function hideBusy() { $('.busy').hide(); }
function showTabHeaders() { $('.tab-header').show(); }
function hideTabHeaders() { $('.tab-header').hide(); }
function enableSubmitButton() { $('input[type=submit]').removeAttr("disabled") }
function disableSubmitButton() { $('input[type=submit]').attr("disabled", "disabled") }

function preSubmit() {
  disableSubmitButton();
  showBusy();
}
function resetSubmitStatus() {
  hideBusy();
  enableSubmitButton();
}

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
  function initTabs() {
    $('.tab-header-insert').click(function() { showTab($(this), "insert.html"); });
    $('.tab-header-history').click(function() { showTab($(this), "history.html"); });
  }
  initTabs();
  showWelcomeTab();
  updateLoggedIn();
});