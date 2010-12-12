function timeValidator() {
  return function(x) {
    return  (x != undefined ) && x.match(/\d\d:\d\d/);
  }
}

$(function() {
  var time = $('#time').changes();
  var timeValidation = mkValidation(time, timeValidator());

  timeValidation.Subscribe(toggleEffect($('.time-error')));
  timeValidation.Subscribe(toggleClassEffect($('#time'), 'invalid'));

  timeValidation.Subscribe(function(x) { console.log("we got: " + x) });
});