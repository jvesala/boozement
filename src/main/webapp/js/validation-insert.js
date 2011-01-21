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
  timeValidation.Subscribe(toggleEffect($('.time-error')))
  timeValidation.Subscribe(toggleClassEffect($('#time'), 'invalid'))

  var type = $('#type').changes()
  var typeValidation = mkValidation(type, requiredValidator())
  typeValidation.Subscribe(toggleEffect($('.type-error')))
  typeValidation.Subscribe(toggleClassEffect($('#type'), 'invalid'))

  var amount = $('#amount').changes()
  var amountValidation = mkValidation(amount, amountValidator())
  amountValidation.Subscribe(toggleEffect($('.amount-error')))
  amountValidation.Subscribe(toggleClassEffect($('#amount'), 'invalid'))

  var all = combine([timeValidation, typeValidation, amountValidation])
  all.Subscribe(disableEffect($('#submit')))
});