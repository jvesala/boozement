var clear = $('#clear')
var search = $('#search')
var tBody = $('#tab-history table tbody')

function showSummary(count, units) { $('#summary').show(); $('#summary .count').html(count); $('#summary .units').html(units) }
function hideSummary() { $('#summary').hide() }
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
  var servings = $.ajaxAsObservable({ url: "api/servings", data: params}).publish()
  handleUnauthorized(servings)
  servings.connect()
  return servings
    .catch(Rx.Observable.never()).select(resultData)
    .select(function(data) { return [$.map(data.servings, function(s) { return highlight($.parseJSON(s), terms)}), data.count, data.units] })
    .catch(Rx.Observable.never())
}

function isScrolledToBottom(e) {
  var scrollTolerance = 10
  return e.target.scrollTop + e.target.offsetHeight + scrollTolerance > e.target.scrollHeight
}

$(function() {
  var input = search.onAsObservable('keyup').throttle(50).select(targetValue).distinctUntilChanged()
  var paging = function(term) {
    return scrollBottom
      .scan(0, function(current, x) { return current+1 })
      .selectMany(function(page) { return query(term, page) })
  }
  var scrollBottom = $('table tbody').onAsObservable('scroll')
    .select(isScrolledToBottom)
    .distinctUntilChanged()
    .where(function(inBottom) { return inBottom })
  
  input.where(emptyData).subscribe(hideClear)
  input.where(notF(emptyData)).subscribe(showClear)
  var first = input.subscribe(function(_) { hideSummary(); showBusy() })
  var first = input.select(function(term) { return query(term, 0) }).switch().publish()
  var more = input.select(paging).switch().publish()
  first.subscribe(function(x) { clearServings(); addServingsToTable(tBody, x[0]) })
  first.subscribe(function(x) { hideBusy(); showSummary(x[1], x[2]) })
  more.subscribe(function(x) { addServingsToTable(tBody, x[0]) })
  first.connect()
  more.connect()
  clearSearch()
  clear.onAsObservable('click').subscribe(clearSearch)

  updateLoggedIn()
})
