function hideTabs() { $('.tab').each(function() { $(this).hide() }); }
function deSelectTabHeader() { $('.tab-header').each(function() { $(this).removeClass("selected") }); }

function getCurrentTime() {
  var now = new Date();
  var hours = (now.getHours() > 10) ? now.getHours() : "0"  + now.getHours();
  var minutes = (now.getMinutes() > 10) ? now.getMinutes() : "0"  + now.getMinutes();
  return hours + ":" + minutes;
}

function showInsertTab() {
  hideTabs();
  deSelectTabHeader();
  resetSubmitStatus();
  $('#time').val(getCurrentTime());
  $('#result').html("");
  $('#tab-insert').fadeIn();
  $('.tab-header-insert').addClass("selected");
}

function showHistoryTab() {
  hideTabs();
  deSelectTabHeader();
  $('#tab-history').fadeIn();
  $('.tab-header-history').addClass("selected");
}

function showBusy() { $('busy').show(); }
function hideBusy() { $('busy').hide(); }
function enableSubmitButton() { $('input[type=submit]').removeAttr("disabled") }
function disableSubmitButton() { $('input[type=submit]').attr("disabled", "disabled") }

function preSubmit() {
  disableSubmitButton();
  showBusy();
}
function resetSubmitStatus() {
  hideBusy();
  enableSubmitButton();
}

$(function () {
  function initTabs() {
    $('.tab-header-insert').click(function() { showInsertTab(); });
    $('.tab-header-history').click(function() { showHistoryTab(); });
  }
  function initInsertForm() {
    $('#form-insert').submit(function() {
      $(this).ajaxSubmit({
        beforeSubmit: preSubmit,
        dataType: 'json',
        success: function(json) {
          resetSubmitStatus();
          $('#result').html(json.status);
        }
      });
      return false;
    });
  }
  initTabs();
  initInsertForm();
  showInsertTab();
});