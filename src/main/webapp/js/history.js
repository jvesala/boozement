var tBody = $('#tab-history table tbody')
function clearServings() { tBody.empty("") }
function addServingToTable(s) { tBody.append('<tr><td class="date">' + s.date + '</td><td class="servingType">' + s.type + '</td><td class="amount">' + s.amount + " cl</td></tr>") }
function addServingsToTable(servings) { $.each(servings, function(i, s) { addServingToTable($.parseJSON(s)) }) }

function query(term, page) {
  showBusy()  
  var params = { query:escape(term), page:page }
  var servings = $.ajaxAsObservable({ url: "api/servings", data: params}).Publish()
  handleUnauthorized(servings)
  servings.Connect()
  return servings
    .Catch(Rx.Observable.Never())
    .Select(function(data) { return data.data.servings ? data.data.servings : [] })
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
  var first = input.Select(function(term) { return query(term, 0) }).Switch().Publish()
  var more = input.Select(paging).Switch().Publish()
  var scrollBottom = $('table tbody').toObservable('scroll')
    .Select(isScrolledToBottom)
    .DistinctUntilChanged()
    .Where(function(inBottom) { return inBottom })
  first.Subscribe(function(servings) { clearServings(); addServingsToTable(servings) })
  first.Subscribe(function(x) { hideBusy() })  
  more.Subscribe(function(servings) { addServingsToTable(servings) })
  more.Subscribe(function(x) { hideBusy() })
  first.Connect()
  more.Connect()
  $('#search').keyup()
}

function isScrolledToBottom(e) {
  var scrollTolerance = 10
  return e.target.scrollTop + e.target.offsetHeight + scrollTolerance > e.target.scrollHeight
}

$(function() {
  servings()
  updateLoggedIn()
});
