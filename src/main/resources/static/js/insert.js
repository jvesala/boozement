
function getCurrentTime() {
  var now = new Date()
  return padZero(now.getHours()) + ":" + padZero(now.getMinutes())
}

function doInsert() {
  preSubmit()
  var insert = $.postAsObservable("api/insert", $('#form-insert').serialize()).publish()
  handleUnauthorized(insert)
  var insertResult = insert.select(resultDataMessage).catch(Rx.Observable.return("error"))
  insertResult.subscribe(resetSubmitStatus)
  insertResult.where(validData).subscribe(updateResult)
  insertResult.where(errorData).select(function(x) { return "Virhe syötössä!" } ).subscribe(updateError)
  insert.connect()
}

function fetchSuggestions(term) {
  var params = { query:escape(term) }
  return $.ajaxAsObservable({ url: "api/servings-suggestions", data: params})
    .doAction(function() {}, handleSuggestionsError).onErrorResumeNext(Rx.Observable.never())
}

function updateSuggestions(result) {
  var ul = $(".insert-form .type-suggestions-list")
  if (result.data.suggestions.length == 0) { ul.html("").hide() } else { ul.html("").show() }
  _.each(result.data.suggestions, function(item) {
    ul.append($("<li>").text(item))
  })
}
function handleSuggestionsError() { $(".insert-form .type-suggestions-list").html("").hide() }
function suggestionText(event) { return event.target.textContent }

$(function() {
  $(".dateElement").continuousCalendar({weeksBefore: 60,weeksAfter: 1, isPopup: true, locale: DateLocale.FI, selectToday: true})
  $('#submit').onAsObservable('click').doAction(preventDefault).subscribe(doInsert)
  $('#time').val(getCurrentTime())
  updateLoggedIn()
  var type = $('#type')
  var typeInput = type.onAsObservable('keyup').throttle(50).select(targetValue).distinctUntilChanged()
  var suggestions = typeInput.select(fetchSuggestions).switchLatest()
  suggestions.subscribe(updateSuggestions)
  $('.insert-form ul').onAsObservable("click", "li").select(suggestionText).subscribe(function(suggestion) {
    $(".insert-form .type-suggestions-list").hide()
    $('#type').val(suggestion)
    $('#amount').focus()
  })
  type.focus()
})
