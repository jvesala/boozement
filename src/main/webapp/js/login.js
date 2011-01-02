function loginParams() { return "email=" + $('#email').val() + "&password=" + $('#password').val(); }

function doLogin() {
  var login = $.postAsObservable("api/login", loginParams()).Publish();
  login.Subscribe(skip, function(error) {
    if(error.xmlHttpRequest.status == "401") { updateResult("Väärä kirjautumistunnus tai salasana.") }
  }, skip);
  var loginContent = login.Select(function(d) { return d.data; }).Catch(Rx.Observable.Never()).Publish();
  loginContent.Subscribe(setPageContent());
  loginContent.Subscribe(function(x) { showTabHeaders() });
  login.Connect();
  loginContent.Connect();
}

$(function() {
  $('#submit').click(function (x) { doLogin(); return false; });
});
