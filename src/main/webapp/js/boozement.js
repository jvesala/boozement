function hideTabs() { $('.tab').each(function() { $(this).hide() }); }
function deSelectTabHeader() { $('.tab-header').each(function() { $(this).removeClass("selected") }); }

function showInsertTab() {
  hideTabs();
  deSelectTabHeader();
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