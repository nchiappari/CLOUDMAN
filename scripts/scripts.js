
function get_base_security_data() {
  var fs = require('fs');
  return JSON.parse(fs.readFileSync('security_groups.json', 'utf8'));
}

function change_occurred(command, id, alt_id) {
  switch (command) {
    case "vm_select":
      action_requested_on_instance(id, alt_id)
      break
    case "new_security_group":
      set_loader(true)
      var name = document.getElementById('new_security_group_name').value
      var description = document.getElementById('new_security_group_desc').value
      var project_id = document.getElementById('new_security_group_proj_id').value
      create_new_security_group(name, description, project_id)
      break
    case "retrieve_security_groups_for_new_rule":
      set_loader(true)
      var project_id = document.getElementById('new_rule_project_select').value
      get_all_security_groups(project_id, function(security_groups) {
        add_security_group_options(security_groups, function() {
          set_loader(false)
        })

      })
      break
    case 'create_new_group_rule':
      set_loader(true)
      try {
        if (document.getElementById('new_rule_direction').checked) {
          var direction = "ingress"
        } else {
          var direction = "egress"
        }
        var security_group_id = document.getElementById('new_rule_security_group').value
        var project_id = document.getElementById('new_rule_project_select').value
        var type = document.getElementById('new_rule_type').value
      } catch (err) {
        set_loader(false)
        display_alert(false, true, "Please fill out all required fields.")
        return
      }
      create_new_group_rule(security_group_id, project_id, type, direction)
      break
    case 'submit_assign':
      var project_id = document.getElementById('select_project_group_assign').value
      var groups_to_assign = []
      for (var group in BASE_SECURITY_GROUPS) {
        if (document.getElementById('checkbox_assign_'+group).checked) {
          groups_to_assign.push(group)
        }
      }
      assign_security_groups(project_id, groups_to_assign)
      break
    default:

  }
}

function action_requested_on_instance(id, project_id) {
  set_loader(true)
  var choice = document.getElementById("vm_select_"+id).value.toLowerCase()
  if (choice == "start") {
    var post_data = {"os-start" : null}
    var new_status = "ACTIVE"
  } else if (choice == "stop") {
    var post_data = {"os-stop" : null}
    var new_status = "SHUTOFF"
  } else if (choice == "reboot") {
    var post_data = {"reboot" : {"type":"SOFT"}}
    var new_status = "ACTIVE"
  }
  var url = URL_COMPUTE + "/servers/" + id + "/action"
  make_POST_request(url, project_id, post_data, function(body) {
    for (var i = 0; i < all_instances.length; i += 1) {
      if (all_instances[i]['id'] == id) {
        all_instances[i]['status'] = new_status
        break
      }
    }
    build_vm_interaction_table(function() {
      set_loader(false)
    })
  })
}

// populates cloudman with inital data
function populate_with_initial_data() {
  set_loader(true)
  set_all_instances(function () {
    build_vm_interaction_table(function() {
      set_loader(false)
    })
  })
  set_loader(true)
  get_all_projects(function(projects) {
    build_security_group_management(projects, [])
    set_loader(false)
  })
}
