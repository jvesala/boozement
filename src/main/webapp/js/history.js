function addServingToTable() { return function(serving) {
  $('#tab-history table tbody').append(
      "<tr><td>" + serving.date + "</td><td>" + serving.type + "</td><td>" + serving.amount + " cl</td></tr>");
}}

function getServings() {
  var servings = $.ajaxAsObservable({ url: "api/servings"})
    .Catch(Rx.Observable.Return({"data": {"servings":[]}}))
    .SelectMany(function(data) { return Rx.Observable.FromArray(data.data.servings) })
    .Select(function(data) { return $.parseJSON(data)})
   servings.Subscribe(addServingToTable());
}

$(function() {
  getServings();
});
