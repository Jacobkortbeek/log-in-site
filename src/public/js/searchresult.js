
$(document).on('submit', '.searchForm', function(e) {

  $.ajax({
    url: $(this).attr('action'),
    type: $(this).attr('method'),
    data: $(this).serialize(),
    success: function(html) {
      console.log(html[0].name);

          console.log('start of loop');
          var htmlStatus = '';
          for(let i = 0; i < html.length; i ++){
            htmlStatus += '<div class="recentOnline"><table><tbody><tr><td><div class="displayPic"><img src="/static/css/assets/wallpaper.png"></div></td><td>';
            htmlStatus += '<p>';
            htmlStatus += html[i].name;
            htmlStatus += '</p>';
            htmlStatus += '<p>';
            htmlStatus += html[i].occupation;
            htmlStatus += '</p>';
            htmlStatus += '<p>';
            htmlStatus += html[i].email;
            htmlStatus += '</p>';
            htmlStatus += '</td></tr></tbody></table></div>';
          }
          console.log(htmlStatus);
          document.getElementById("searchResult").innerHTML = htmlStatus;
        },
    });
  e.preventDefault();
});

// var xhr = new XMLHttpRequest();
// xhr.onreadystatechange = function () {
//   if(xhr.readyState === 4) {
//     var searchUsers = JSON.parse(xhr.responseText);
//     console.log(searchUsers);
//   }
// };
// xhr.open('GET', 'search');
// xhr.send();
