
function create_accordion_entry(title, content, link) {
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
                      <select onchange="change_occurred(`vm_select`, `' + instance['id'] + '`, `' + instance['tenant_id'] + '`)" id="vm_select_' + instance["id"] + '"> \
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

function add_security_group_options(security_groups, callback) {
  var content = '<select id="new_rule_security_group"><option>Select Security Group...</option>'
  if (security_groups.length > 1) {
    security_groups.forEach(function (security_group) {
      content += '<option value="' + security_group['id'] + '">' + security_group['name'] + '</option>'
    })
  } else {
    content += '<option selected="selected" value="' + security_groups[0]['id'] + '">' + security_groups[0]['name'] + '</option>'
  }
  content += '</select>'
  document.getElementById('security_group_select_area').innerHTML = content
  callback()
}

function build_security_group_management(projects, security_groups) {
    projects.sort(function (a, b) {
      return a.name.localeCompare(b.name)
    })
    var content = '<b>Assign Pre-Configured Security Groups</b>\
                    <table>\
                      <tr>\
                        <td>Project:</td>\
                        <td>\
                          <select id="select_project_group_assign">\
                            <option>Select Project...</option>'
    projects.forEach(function(project) {
      content +=            '<option value="' + project['id'] + '">' + project['name'] + '</option>'
    })
    content +=            '</select>\
                        </td>\
                      </tr>\
                      <tr>\
                        <td>\
                          Groups to assign:\
                        </td>\
                        <td>'
    for (var group in BASE_SECURITY_GROUPS) {
      content += '<label><input type="checkbox" id="checkbox_assign_' + group + '">'+group+'</label> '
    }
    content +=          '</td>\
                      </tr>\
                      <tr>\
                        <td></td>\
                        <td>\
                          <button onclick="change_occurred(`submit_assign`)">Assign</button>\
                        </td>\
                      </tr>\
                    </table><br>\
                  <b>Manually Create New Security Group</b>\
                    <table>\
                      <tr>\
                        <td>Name:</td><td><input type="text" id="new_security_group_name"></td>\
                      </tr>\
                      <tr>\
                        <td>Description:</td><td><input type="text" id="new_security_group_desc"></td>\
                      </tr>\
                      <tr>\
                        <td>Project:</td>\
                        <td>\
                          <select id="new_security_group_proj_id">\
                            <option>Select Project...</option>'
    projects.forEach(function(project) {
      content +=            '<option value="' + project['id'] + '">' + project['name'] + '</option>'
    })
    content +=            '</select>\
                        </td>\
                      </tr>\
                      <tr>\
                        <td></td><td><button onclick="change_occurred(`new_security_group`)">Create</button></td>\
                      </tr>\
                    </table><br>\
                    <b>Manually Add Security Group Rule</b>\
                    <table>\
                      <tr>\
                        <td>Project:</td>\
                        <td>\
                          <select id="new_rule_project_select" onchange="change_occurred(`retrieve_security_groups_for_new_rule`)">\
                            <option>Select Project...</option>'
      projects.forEach(function(project) {
        content +=          '<option value="' + project['id'] + '">' + project['name'] + '</option>'
      })
      content +=          '</select>\
                        </td>\
                      </tr>\
                      <tr>\
                        <td>Security Group:</td>\
                        <td>\
                          <span id="security_group_select_area">\
                            <select>\
                              <option>Select Security Group...</option>\
                            </select>\
                          </span>\
                        </td>\
                      </tr>\
                      <tr>\
                        <td>Rule Type:</td>\
                        <td>\
                          <span id="security_rule_select">\
                            <select id="new_rule_type">\
                              <option>Select Rule Type...</option>'
      for (var key in BASE_SECURITY_RULES) {
        content +=             '<option value="' + key + '">' + BASE_SECURITY_RULES[key]['name'] + '</option>'
      }
      content +=            '</select>\
                          </span>\
                        </td>\
                      </tr>\
                      <tr>\
                        <td>Direction:</td>\
                        <td>\
                          <label><input id="new_rule_direction" type="radio" checked="checked" name="direction" value="ingress">Ingress</label> <label><input type="radio" name="direction" value="egress">Egress</label>\
                        </td>\
                      </tr>\
                      <tr>\
                        <td></td><td><button onclick="change_occurred(`create_new_group_rule`)">Add</button></td>\
                      </tr>\
                    </table><br>'
    document.getElementById('security_group_management').innerHTML = content
}
