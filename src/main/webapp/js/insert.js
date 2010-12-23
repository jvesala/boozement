function getCurrentTime() {
  var now = new Date();
  var hours = (now.getHours() > 10) ? now.getHours() : "0"  + now.getHours();
  var minutes = (now.getMinutes() > 10) ? now.getMinutes() : "0"  + now.getMinutes();
  return hours + ":" + minutes;
}
function initInsertForm() {
  $('#form-insert').submit(function() {
    $(this).ajaxSubmit({
      beforeSubmit: preSubmit,
      dataType: 'json',
      success: function(json) {
        resetSubmitStatus();
        $('#result').html(json.message);
      }
    });
    return false;
  });
}

$(function() {
  initInsertForm();
  $('#time').val(getCurrentTime());
  $('#result').empty();
});
