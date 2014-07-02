function timeValidator() {
  return function(x) {
    return ((x != undefined ) && (x.match(/\d\d:?\d\d/) != undefined)).orFailure("invalid")
  }
}

function amountValidator() {
  return function(x) {
    return (x != undefined && ( x > 0 && x < 101)).orFailure("invalid")
  }
}

function unitValidator() {
  return function(x) {
    return (x != undefined && ( x > 0 && x < 5)).orFailure("invalid")
  }
}

$(function() {
  var time = $('#time').changes()
  var timeValidation = mkValidation(time, timeValidator())
  timeValidation.subscribe(toggleEffect($('.time-error')))
  timeValidation.subscribe(toggleClassEffect($('#time'), 'invalid'))

  var type = $('#type').changes()
  var typeValidation = mkValidation(type, requiredValidator())
  typeValidation.subscribe(toggleEffect($('.type-error')))
  typeValidation.subscribe(toggleClassEffect($('#type'), 'invalid'))

  var amount = $('#amount').changes()
  var amountValidation = mkValidation(amount, emptyOk(amountValidator()))
  amountValidation.subscribe(toggleEffect($('.amount-error')))
  amountValidation.subscribe(toggleClassEffect($('#amount'), 'invalid'))

  var units = $('#units').changes()
  var unitsValidation = mkValidation(units, emptyOk(unitValidator()))
  unitsValidation.subscribe(toggleEffect($('.units-error')))
  unitsValidation.subscribe(toggleClassEffect($('#units'), 'invalid'))

  var requiredValidation = required([amount, units])

  var all = combine([timeValidation, typeValidation, amountValidation, unitsValidation, requiredValidation])
  all.subscribe(disableEffect($('#submit')))
});