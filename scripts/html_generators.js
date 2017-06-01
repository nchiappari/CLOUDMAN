
var create_accordion_entry = function(title, content, link) {
  return '<div class="panel panel-default"> \
            <div class="panel-heading"> \
              <h4 class="panel-title"> \
                <a data-toggle="collapse" data-parent="#accordion" href="#' + link + '">' + title + '</a> \
              </h4> \
            </div> \
            <div id="' + link + '" class="panel-collapse collapse"> \
              <div class="panel-body" style="background-color: #F6FDFF;"> \
                ' + content + ' \
              </div> \
            </div> \
          </div>'
}


function build_vm_interaction_table(callback) {

    var table = '<table class="table"> \
                    <tr> \
                      <th>VM</th><th>Status</th><th>Action</th> \
                    </tr>'
    all_instances.forEach(function(instance) {
        table += '<tr> \
                    <td>' + instance["name"] + '</td>\
                    <td>' + instance["status"] + '</td>\
                    <td> \
                      <select onchange="change_occurred(\'vm_select\', \'' + instance['id'] + '\', \'' + instance['tenant_id'] + '\')" id="vm_select_' + instance["id"] + '"> \
                        <option>Select option...</option>'
        if (instance["status"] == "SHUTOFF") {
          table += '<option>Start</option>'
        }
        if (instance["status"] == "ACTIVE") {
          table += '<option>Stop</option>'
        }
        if (instance["status"] == "ACTIVE") {
          table += '<option>Reboot</option>'
        }
        table += '</select> \
                    </td> \
                  </tr>'
    })
    table += "</table>"
    document.getElementById('vm_interaction_table').innerHTML = table
    callback()
}

// toggles the loading screen
function set_loader(bool) {
  if (bool) {
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

function display_alert(success_status, set_timeout, message) {
  var success = '<div class="alert alert-success alert-dismissable fade in">\
    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
    <strong>Success!</strong> ' + message + ' \
  </div>';
  var failure = '<div class="alert alert-danger alert-dismissable fade in">\
    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
    <strong>Error:</strong> ' + message +'\
  </div>'
  var alert_area = document.getElementById("alert_area");
  if (success_status) {
    alert_area.innerHTML = success
  } else {
    alert_area.innerHTML = failure
  }
  if (set_timeout) {
    setTimeout(function() {
      alert_area.innerHTML = ""
    }, 5000);
  }
}
