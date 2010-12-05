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
  $('#time').val(getCurrentTime());
  $('#tab-insert').fadeIn();
  $('.tab-header-insert').addClass("selected");
}

function showHistoryTab() {
  hideTabs();
  deSelectTabHeader();
  $('#tab-history').fadeIn();
  $('.tab-header-history').addClass("selected");
}

$(function () {
  function initTabs() {
    $('.tab-header-insert').click(function() { showInsertTab(); });
    $('.tab-header-history').click(function() { showHistoryTab(); });
  }
  initTabs();
  showInsertTab();
});