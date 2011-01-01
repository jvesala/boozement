function addServingToTable() { return function(serving) {
  $('#tab-history table tbody').append(
      "<tr><td>" + serving.date + "</td><td>" + serving.type + "</td><td>" + serving.amount + " cl</td></tr>");
}}

function skip() { return function(x) {} };
function fetchLoginToContent() {
  $.ajaxAsObservable({ url: "login.html"}).Select(function(d) { return d.data; }).Subscribe(setPageContent());  
}

function getServings() {
  var servings = $.ajaxAsObservable({ url: "api/servings"}).Publish();
  servings.Subscribe(skip, function(error) {
    if(error.xmlHttpRequest.status == "401") {
      fetchLoginToContent();     
    }
  }, skip);
  var servingsData = servings
    .Catch(Rx.Observable.Return({"data": {"servings":[]}}))
    .SelectMany(function(data) { return Rx.Observable.FromArray(data.data.servings) })
    .Select(function(data) { return $.parseJSON(data)});
  servingsData.Subscribe(addServingToTable());
  servings.Connect();
}

$(function() {
  getServings();
});
