
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

function populate_with_initial_data() {
  set_all_instances(function () {
    build_vm_interaction_table(function() {
      set_loader(false)
    })
  })
  build_security_group_management()

}
