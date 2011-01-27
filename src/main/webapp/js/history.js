var clear = $('#clear')
var search = $('#search')
var tBody = $('#tab-history table tbody')
function showCount(count) { $('#count').show(); $('#count span').html(count) }
function hideCount() { $('#count').hide() }
function clearServings() { tBody.empty("") }
function clearSearch() { search.val("").keyup() }

function updateField(target) {
  var parent = target.parent()  
  var currentValue = target.val()
  var inputParts = target.attr("name").split("-")
  var query = "id=" + inputParts[0] + "&field=" + inputParts[1] + "&value=" + escape(currentValue)
  var update = $.postAsObservable("api/update-serving", query)
    .Catch(Rx.Observable.Return("error")).Publish()
  handleUnauthorized(update)
  update.Where(validData).Subscribe(function(x) {parent.html(currentValue)} )
  update.Where(validData).Select(resultDataMessage).Subscribe(updateResult)
  update.Where(errorData).Select(function(x) { return "Virhetilanne." } ).Subscribe(updateError)
  update.Connect()
}
function eventTarget(e) { return $(e.target) }
function enterPressed(e) { return e.keyCode == 13}
function openEdit(target) {
  var inputName = target.parent().attr("class") + '-' +  target.attr("class")
  var originalValue = target.html()
  var input = $('<input type="text" name="' + inputName + '" value="' + originalValue + '" />')
  input.toObservable('blur').Select(eventTarget).Subscribe(updateField)
  input.toObservable('keyup').Where(enterPressed).Select(eventTarget).Subscribe(updateField)
  target.empty().append(input)
  input.focus()
}

function addServingToTable(s) {
  var date = $('<td class="date">' + s.date + '</td>')
  date.toObservable('click').Select(eventTarget).Subscribe(openEdit)
  var type = $('<td class="servingType">' + s.type + '</td>')
  type.toObservable('click').Select(eventTarget).Subscribe(openEdit)
  var amount = $('<td class="amount">' + s.amount + ' cl</td>')
  amount.toObservable('click').Select(eventTarget).Subscribe(openEdit)
  var row = $('<tr class="' + s.id + '"></tr>').append(date).append(type).append(amount)
  tBody.append(row)
}
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
  var params = { query:escape(terms), page:page }
  var servings = $.ajaxAsObservable({ url: "api/servings", data: params}).Publish()
  handleUnauthorized(servings)
  servings.Connect()
  return servings
    .Catch(Rx.Observable.Never()).Select(resultData)
    .Select(function(data) { return [$.map(data.servings, function(s) { return highlight($.parseJSON(s), terms)}), data.count] })
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
  
  input.Where(function(x) { return x == ""}).Subscribe(function(_) { clear.hide() })
  input.Where(function(x) { return x != ""}).Subscribe(function(_) { clear.show() })
  var first = input.Subscribe(function(_) { hideCount(); showBusy() })
  var first = input.Select(function(term) { return query(term, 0) }).Switch().Publish()
  var more = input.Select(paging).Switch().Publish()
  first.Subscribe(function(x) { clearServings(); addServingsToTable(x[0]) })
  first.Subscribe(function(x) { hideBusy(); showCount(x[1]) })
  more.Subscribe(function(x) { addServingsToTable(x[0]) })
  first.Connect()
  more.Connect()
  clearSearch()
  clear.toObservable('click').Subscribe(clearSearch)

  updateLoggedIn()
});
