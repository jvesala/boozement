var clear = $('#clear')
var search = $('#search')
var tBody = $('#tab-history table tbody')
function clearServings() { tBody.empty("") }
function clearSearch() { search.val("").keyup() }
function addServingToTable(s) { tBody.append('<tr><td class="date">' + s.date + '</td><td class="servingType">' + s.type + '</td><td class="amount">' + s.amount + " cl</td></tr>") }
function addServingsToTable(servings) { $.each(servings, function(i, s) { addServingToTable(s) }) }
function highlight(s, terms) {
  if(terms != "") {
    var regExp = new RegExp('(' + terms.split(" ").join(")|(") + ')', 'gi')
    var replacement = '<span class="highlight">$&</span>'
    s.date = s.date.replace(regExp, replacement)
    s.type = s.type.replace(regExp, replacement)
    s.amount = s.amount.toString().replace(regExp, replacement)
  }
  return s
}

function query(terms, page) {
  showBusy()  
  var params = { query:escape(terms), page:page }
  var servings = $.ajaxAsObservable({ url: "api/servings", data: params}).Publish()
  handleUnauthorized(servings)
  servings.Connect()
  return servings
    .Catch(Rx.Observable.Never())
    .Select(function(data) { return data.data.servings ? data.data.servings : [] })
    .Select(function(data) { return $.map(data, function(s) { return highlight($.parseJSON(s), terms)}) })
}

function servings() {
  var input = search.toObservable('keyup')
    .Throttle(50)
    .Select(function(e) { return $(e.target).val() })
    .DistinctUntilChanged()
  var paging = function(term) {
    return scrollBottom
      .Scan(0, function(current, x) { return current+1 })
      .SelectMany(function(page) { return query(term, page) })
  }
  input.Where(function(x) { return x == ""}).Subscribe(function(_) { clear.hide() })
  input.Where(function(x) { return x != ""}).Subscribe(function(_) { clear.show() })
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
  clearSearch()
  clear.toObservable('click').Subscribe(function(_) { clearSearch() })
}

function isScrolledToBottom(e) {
  var scrollTolerance = 10
  return e.target.scrollTop + e.target.offsetHeight + scrollTolerance > e.target.scrollHeight
}

$(function() {
  servings()
  updateLoggedIn()
});
