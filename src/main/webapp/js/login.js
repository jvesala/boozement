function initLoginForm() {
  $('form').submit(function() {
    $(this).ajaxSubmit({
      beforeSubmit: preSubmit,
      dataType: 'json',
      success: function(json) {
        resetSubmitStatus();
        setElementContent($('#page-content'), "<div>" + json.message + "</div>");
      },
    });
    return false;
  });
}

$(function() {
  initLoginForm();
});
