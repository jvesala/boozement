function initLoginForm() {
  $('form').submit(function() {
    $(this).ajaxSubmit({
      beforeSubmit: preSubmit,
      dataType: 'json',
      success: function(json) {
        resetSubmitStatus();
        setElementContent($('#page-content'), json.message);
      }
    });
    return false;
  });
}

$(function() {
  initLoginForm();
});
