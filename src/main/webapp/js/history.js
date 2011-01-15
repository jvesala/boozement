var tBody = $('#tab-history table tbody')
function clearServings() { tBody.empty("") }
function addServingToTable(serving) { 
  tBody.append("<tr><td>" + serving.date + "</td><td>" + serving.type + "</td><td>" + serving.amount + " cl</td></tr>");
}

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

function query(term, page) {
  var params = { query:escape(term), page:page }
  var servings = $.ajaxAsObservable({ url: "api/servings", data: params}).Publish()
  handleUnauthorized(servings)
  servings.Connect()
  return servings
    .Catch(Rx.Observable.Never())
    .SelectMany(function(data) { return Rx.Observable.FromArray(data.data.servings) })
    .Select(function(data) { return $.parseJSON(data)});
}

function servings() {
  var input = $('#search').toObservable('keyup')
    .Throttle(50)
    .Select(function(e) { return $(e.target).val() })
    .DistinctUntilChanged()
  var paging = function(term) {
    return scrollBottom
      .Scan(0, function(current, x) { return current+1 })
      .SelectMany(function(page) { return query(term, page) })
  }
  var first = input.Select(function(term) { return query(term, 0) }).Switch()
  var initialResults = query("", 0)
  var first = initialResults.Merge(input.Select(function(term) { return query(term, 0) }).Switch())
  var more = input.Select(paging).Switch()
  var scrollBottom = $('table tbody').toObservable('scroll')
    .Select(isScrolledToBottom)
    .DistinctUntilChanged()
    .Where(function(inBottom) { return inBottom })
  
  first.Subscribe(function(serving) { clearServings(); addServingToTable(serving) })
  more.Subscribe(function(serving) { addServingToTable(serving) })

}

function debug(x) { console.log(x) }

$(function() {
  showBusy();
  servings();
  //getServings();
  updateLoggedIn();  
});



function isScrolledToBottom(e) {
  var scrollTolerance = 100
  return e.target.scrollTop + e.target.offsetHeight + scrollTolerance > e.target.scrollHeight
}




