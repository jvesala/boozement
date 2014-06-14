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

  var requiredValidation = required([amount])

  var all = combine([timeValidation, typeValidation, amountValidation, requiredValidation])
  all.subscribe(disableEffect($('#submit')))
});