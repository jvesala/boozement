var clear = $('#clear')
var search = $('#search')
var tBody = $('#tab-history table tbody')

function showCount(count) { $('#count').show(); $('#count span').html(count) }
function hideCount() { $('#count').hide() }
function showUnits(units) { $('#units').show(); $('#units span').html(units) }
function hideUnits() { $('#units').hide() }
function clearServings() { tBody.empty("") }
function clearSearch() { search.val("").keyup() }
function showClear() { clear.show() }
function hideClear() { clear.hide() }

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

function deHighlight(text) {
  var regExp = new RegExp('<span class="highlight">(.*?)</span>', 'gi')
  var replaceMent = '$1'
  return text.replace(regExp, replaceMent)
}

function query(terms, page) {
  var params = { query:escape(terms), page:page }
  var servings = $.ajaxAsObservable({ url: "api/servings", data: params}).Publish()
  handleUnauthorized(servings)
  servings.Connect()
  return servings
    .Catch(Rx.Observable.Never()).Select(resultData)
    .Select(function(data) { return [$.map(data.servings, function(s) { return highlight($.parseJSON(s), terms)}), data.count, data.units] })
    .Catch(Rx.Observable.Never())
}

function isScrolledToBottom(e) {
  var scrollTolerance = 10
  return e.target.scrollTop + e.target.offsetHeight + scrollTolerance > e.target.scrollHeight
}

$(function() {  
  var input = search.toObservable('keyup')
    .Throttle(50)
    .Select(function(e) { return $(e.target).val() })
    .DistinctUntilChanged()
  var paging = function(term) {
    return scrollBottom
      .Scan(0, function(current, x) { return current+1 })
      .SelectMany(function(page) { return query(term, page) })
  }
  var scrollBottom = $('table tbody').toObservable('scroll')
    .Select(isScrolledToBottom)
    .DistinctUntilChanged()
    .Where(function(inBottom) { return inBottom })
  
  input.Where(emptyData).Subscribe(hideClear)
  input.Where(notF(emptyData)).Subscribe(showClear)
  var first = input.Subscribe(function(_) { hideCount(); hideUnits(); showBusy() })
  var first = input.Select(function(term) { return query(term, 0) }).Switch().Publish()
  var more = input.Select(paging).Switch().Publish()
  first.Subscribe(function(x) { clearServings(); addServingsToTable(tBody, x[0]) })
  first.Subscribe(function(x) { hideBusy(); showCount(x[1]); showUnits(x[2]) })
  more.Subscribe(function(x) { addServingsToTable(tBody, x[0]) })
  first.Connect()
  more.Connect()
  clearSearch()
  clear.toObservable('click').Subscribe(clearSearch)

  updateLoggedIn()
});
