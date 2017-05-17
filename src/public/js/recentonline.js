var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    var users = JSON.parse(xhr.responseText);

    var htmlStatus = '';
    for(let i = 0; i < users.length; i ++){
      htmlStatus += '<div class="recentOnline"><table><tbody><tr><td><div class="displayPic"><img src="/static/css/assets/wallpaper.png"></div></td><td>';
      htmlStatus += '<p>';
      htmlStatus += users[i].name;
      htmlStatus += '</p>';
      htmlStatus += '<p>';
      htmlStatus += users[i].occupation;
      htmlStatus += '</p>';
      htmlStatus += '<p>';
      htmlStatus += users[i].email;
      htmlStatus += '</p>';
      htmlStatus += '</td></tr></tbody></table></div>';
    }

    document.getElementById("recent").innerHTML = htmlStatus;
  }
};

xhr.open('GET', 'lastonline');
xhr.send();
