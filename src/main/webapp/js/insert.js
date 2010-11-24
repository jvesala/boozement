function openInsertPage() {
  $.ajax({
    url: "/api/insert-page/",
    cache: false,
    success: function(html) {
      $('#content').html(html);
    },
    error: function(data) {
      $('#content').html("error!");
    }
  })
}

$(function () {
  openInsertPage();
});