function deSelectTabHeader() { $('.tab-header').each(function() { $(this).removeClass("selected") }); }
function setPageContent() { return function(content) { setElementContent($('#page-content'), content); }}
function setElementContent(element, content) { element.children().detach(); element.append(content);}

function getUrlAsObservable(url) {
  return $.ajaxAsObservable({ url: url})
      .Catch(Rx.Observable.Return({data: "Virhetilanne"}))
      .Select(function(d) { return d.data; });
}
function showTab(tabHeader, url) {
  deSelectTabHeader();
  tabHeader.addClass("selected");
  var source = getUrlAsObservable(url);
  source.Subscribe(setPageContent());
}

function showBusy() { $('.busy').show(); }
function hideBusy() { $('.busy').hide(); }
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
    $('.tab-header-insert').click(function() { showTab($(this), "insert.html"); });
    $('.tab-header-history').click(function() { showTab($(this), "history.html"); });
  }
  initTabs();
  //showInsertTab();
});