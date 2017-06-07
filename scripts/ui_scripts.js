
// show loading symbol when DISPLAY_LOADER_COUNT > 0
DISPLAY_LOADER_COUNT = 0

// toggles the loading screen - increments counter so that if loader is requested from
// multible functions is only stops showing loading symbol when it actually is done loading
function set_loader(bool) {
  if (bool) {
    DISPLAY_LOADER_COUNT += 1
  } else {
    DISPLAY_LOADER_COUNT -= 1
  }
  if (DISPLAY_LOADER_COUNT > 0) {
    content = '<div class="popup spinner">\
                <div class="rect1"></div>\
                <div class="rect2"></div>\
                <div class="rect3"></div>\
                <div class="rect4"></div>\
                <div class="rect5"></div>\
              </div>\
              <div class="fadeMe"></div>'
  } else {
    content = ""
  }
  document.getElementById('loader').innerHTML = content
}

function reset_loader() {
  DISPLAY_LOADER_COUNT = 1
  set_loader(false)
}


function display_alert(is_success, is_timeout, message) {
  var success = '<div class="alert alert-success alert-dismissable fade in cloudman-alert">\
    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
    <strong>Success!</strong> ' + message + ' \
  </div>';
  var failure = '<div class="alert alert-danger alert-dismissable fade in cloudman-alert">\
    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
    <strong>Error:</strong> ' + message +'\
  </div>'
  var alert_area = document.getElementById("alert_area");
  if (is_success) {
    alert_area.innerHTML = success
  } else {
    alert_area.innerHTML = failure
  }
  if (is_timeout) {
    setTimeout(function() {
      alert_area.innerHTML = ""
    }, 5000);
  }
}
