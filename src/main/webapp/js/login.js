function loginParams() { return "email=" + $('#email').val() + "&password=" + $('#password').val(); }

function doLogin() {
  var login = $.postAsObservable("api/login", loginParams()).Publish();
  login.Subscribe(skip, function(error) {
    if(error.xmlHttpRequest.status == "401") { updateResult("Väärä kirjautumistunnus tai salasana.") }
  }, skip);
  login.Select(function(d) { return '<div id="tab-welcome" class="tab">' + d.data.message + '</div>'; })
    .Catch(Rx.Observable.Never())
    .Subscribe(setPageContent());
  login.Connect();
}

$(function() {
  $('#submit').click(function (x) { doLogin(); return false; });
});
