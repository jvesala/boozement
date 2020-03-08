
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
  if ($('#type').is(":focus")) {
    var ul = $(".insert-form .type-suggestions-list")
    if (result.data.suggestions.length == 0) { ul.html("").hide() } else { ul.html("").show() }
    _.each(result.data.suggestions, function(item) {
      ul.append($("<li>").text(item))
    })
  }
}
function handleSuggestionsError() { hideSuggestionsBox() }
function suggestionText(event) { return event.target.textContent }
function hideSuggestionsBox() { $(".insert-form .type-suggestions-list").html("").hide() }
function selectSuggestion(suggestion) {
  hideSuggestionsBox()
  $('#type').val(suggestion)
  $('#amount').focus()
}
function clearTypeField() { hideSuggestionsBox(); $('#type').val("").keyup().focus() }

$(function() {
  $(".dateElement").continuousCalendar({weeksBefore: 60,weeksAfter: 1, isPopup: true, locale: DateLocale.FI, selectToday: true})
  $('#submit').onAsObservable('click').doAction(preventDefault).subscribe(doInsert)
  $('#time').val(getCurrentTime())
  updateLoggedIn()
  var type = $('#type')
  var typeInput = type.onAsObservable('keyup').throttle(50).select(targetValue).distinctUntilChanged()
  var typeBlurs = type.onAsObservable('blur').throttle(150)
  var suggestions = typeInput.select(fetchSuggestions).switchLatest()
  var selectedSuggestions = $('.insert-form ul').onAsObservable("click", "li").select(suggestionText)
  var clearTypeValues = $('#clear').onAsObservable('click')

  typeInput.where(emptyData).subscribe(hideClear)
  typeInput.where(notF(emptyData)).subscribe(showClear)
  typeBlurs.subscribe(hideSuggestionsBox)
  suggestions.subscribe(updateSuggestions)
  selectedSuggestions.subscribe(selectSuggestion)
  clearTypeValues.subscribe(clearTypeField)
  type.focus()
})
