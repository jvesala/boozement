function updateField(target) {
  var parent = target.parent()  
  var currentValue = target.val()
  var inputParts = target.attr("name").split("-")
  var query = "id=" + inputParts[0] + "&field=" + inputParts[1] + "&value=" + encodeURI(currentValue)
  $.postAsObservable("api/update-serving", query).subscribe(updateSuccessful(parent, currentValue), updateFailed)
}

function updateSuccessful(parent, currentValue) {
  return function(x) {
    parent.html(currentValue)
    updateResult(resultDataMessage(x))
  }
}
function updateFailed() { updateError("Virhetilanne.") }

function eventTarget(e) { return $(e.target) }
function enterPressed(e) { return e.keyCode == 13}
function openEdit(target) {
  var inputName = target.parent().attr("class") + '-' +  target.attr("class")
  var originalValue = deHighlight(target.html())
  var input = $('<input type="text" name="' + inputName + '" value="' + originalValue + '" />')
  input.onAsObservable('blur').select(eventTarget).subscribe(updateField)
  input.onAsObservable('keyup').where(enterPressed).select(eventTarget).subscribe(updateField)
  target.empty().append(input)
  input.focus()
}

function addServingToTable(tableBody, s) {
  var date = $('<td class="date">' + s.date + '</td>')
  date.onAsObservable('click').select(eventTarget).subscribe(openEdit)
  var type = $('<td class="servingType">' + s.type + '</td>')
  type.onAsObservable('click').select(eventTarget).subscribe(openEdit)
  var amount = $('<td class="amount">' + s.amount + ' cl</td>')
  amount.onAsObservable('click').select(eventTarget).subscribe(openEdit)
  var units = $('<td class="units">' + s.units + '</td>')
  units.onAsObservable('click').select(eventTarget).subscribe(openEdit)
  var row = $('<tr class="' + s.id + '"></tr>').append(date).append(type).append(amount).append(units)
  tableBody.append(row)
}
function addServingsToTable(tableBody, servings) { $.each(servings, function(i, s) { addServingToTable(tableBody, s) }) }
