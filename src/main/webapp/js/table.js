function updateField(target) {
  var parent = target.parent()  
  var currentValue = target.val()
  var inputParts = target.attr("name").split("-")
  var query = "id=" + inputParts[0] + "&field=" + inputParts[1] + "&value=" + escape(currentValue)
  var update = $.postAsObservable("api/update-serving", query)
    .Catch(Rx.Observable.Return("error")).Publish()
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

function addServingToTable(tableBody, s) {
  var date = $('<td class="date">' + s.date + '</td>')
  date.toObservable('click').Select(eventTarget).Subscribe(openEdit)
  var type = $('<td class="servingType">' + s.type + '</td>')
  type.toObservable('click').Select(eventTarget).Subscribe(openEdit)
  var amount = $('<td class="amount">' + s.amount + ' cl</td>')
  amount.toObservable('click').Select(eventTarget).Subscribe(openEdit)
  var row = $('<tr class="' + s.id + '"></tr>').append(date).append(type).append(amount)
  tableBody.append(row)
}
function addServingsToTable(tableBody, servings) { $.each(servings, function(i, s) { addServingToTable(tableBody, s) }) }