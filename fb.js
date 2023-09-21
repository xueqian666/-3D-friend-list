function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);

  if (response.status === 'connected') {
    testAPI();
  } else {
    document.getElementById('status').innerHTML = 'Please log into this webpage.';
  }
}

function checkLoginState() {
  console.log("Check Login Status");
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '339934468382342',
    cookie     : true,
    xfbml      : true,
    version    : 'v18.0',
  });

  console.log("Facebook SDK initialized successfully");

  FB.getLoginStatus(function(response) {
    console.log("Get Login Status")
    statusChangeCallback(response);
  });
};

function testAPI() {
  console.log('Welcome! Fetching your information and friends.... ');
  FB.api('/me', function(userResponse) {
    console.log('Successful login for: ' + userResponse.name);
    console.log('User ID: ' + userResponse.id);

    FB.api('/me/friends','GET',{},function(friendsResponse) {
      console.log('User Friends: ');
      console.log(friendsResponse.data);

      if (friendsResponse.data) {
        console.log('Friend List: ');
        for (var i = 0; i < friendsResponse.data.length; i++) {
          console.log(friendsResponse.data[i].name);
        }
      } else {
        console.log('No friends data available.');
      }

      document.getElementById('status').innerHTML =
        'Hello ' + userResponse.name + '.' +'<br/>'+ 'Please refresh the page to Fetching your friends!';
    }, {scope:'email,user_friends'});
  }, {scope:'email,user_friends'});
}
