function addServingToTable() { return function(serving) {
  $('#tab-history table tbody').append(
      "<tr><td>" + serving.date + "</td><td>" + serving.type + "</td><td>" + serving.amount + " cl</td></tr>");
}}

function getServings() {
  var servings = $.ajaxAsObservable({ url: "api/servings"}).Publish();
  handleUnauthorized(servings);
  var servingsData = servings
    .Catch(Rx.Observable.Never())
    .SelectMany(function(data) { return Rx.Observable.FromArray(data.data.servings) })
    .Select(function(data) { return $.parseJSON(data)});
  servingsData.Subscribe(addServingToTable());
  servings.Subscribe(function(x) { hideBusy() });
  servings.Connect();
}

$(function() {
  showBusy();
  getServings();
});
