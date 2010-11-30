function showInsertTab() {
  $('#tab-history').hide();
  $('.tab-header-history').removeClass("selected");
  $('#tab-insert').fadeIn();
  $('.tab-header-insert').addClass("selected");
}

function showHistoryTab() {
  $('#tab-insert').hide();
  $('.tab-header-insert').removeClass("selected");
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