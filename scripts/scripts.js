function change_occurred(command, id, project_id) {
  switch (command) {
    case "vm_select":
      action_requested_on_instance(id, project_id)
      break;
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
  make_POST_request(url, project_id, post_data, function(response) {
    if (response.statusCode == 202) {
      for (var i = 0; i < all_instances.length; i += 1) {
        if (all_instances[i]['id'] == id) {
          all_instances[i]['status'] = new_status
          break
        }
      }
      build_vm_interaction_table(function() {
        set_loader(false)
      })
    } else {

    }
  })
}

function populate_with_initial_data() {
  set_all_instances(function () {
    build_vm_interaction_table(function() {

    })
  })

}
