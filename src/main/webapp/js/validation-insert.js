function timeValidator() {
  return function(x) {
    return ((x != undefined ) && (x.match(/\d\d:?\d\d/) != undefined)).orFailure("invalid");
  }
}

$(function() {
  var time = $('#time').changes();
  var timeValidation = mkValidation(time, timeValidator());
  timeValidation.Subscribe(toggleEffect($('.time-error')));
  timeValidation.Subscribe(toggleClassEffect($('#time'), 'invalid'));
});