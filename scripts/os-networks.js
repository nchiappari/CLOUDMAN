
function create_new_security_group(name, description, project_id) {
  var url = URL_NETWORKING + "/v2.0/security-groups"
  post_data = {
        "project_id": project_id,
        "security_group": {
            "name": name,
            "description": description
        }
      }
  make_POST_request(url, project_id, post_data, function(body) {
    document.getElementById('new_security_group_name').value = ""
    document.getElementById('new_security_group_desc').value = ""
    document.getElementById('new_security_group_proj_id').selectedIndex = 0;
    set_loader(false)
    display_alert(true, true, 'The security group "'+ name +'" has been created successfully.')
  })

}


function create_new_group_rule() {
  var url = URL_NETWORKING + "/v2.0/security-group-rules"
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

  if (type == "SSH") {
    var port = 22
    var protocol = "tcp"
  } else if (type == "HTTP") {
    var port = 80
    var protocol = "tcp"
  } else if (type == "HTTPS") {
    var port = 443
    var protocol = "tcp"
  }

  post_data = {
      "security_group_rule": {
          "direction": direction,
          "port_range_min": port,
          "port_range_max": port,
          "security_group_id": security_group_id,
          "protocol": protocol,
      }
  }
  make_POST_request(url, project_id, post_data, function(body) {
    set_loader(false)
    if (body['security_group_rule']) {
      display_alert(true, true, 'New security rule has been added successfully.')
    } else if (body.NeutronError && body.NeutronError['type'] == "SecurityGroupRuleExists") {
      display_alert(false, true, 'This security rule already exists so no action was taken.')
    } else {
      display_alert(false, true, 'An error occurred adding the new rule.')
    }
  })

}

function get_all_security_groups(project_id, callback) {
  var url = URL_NETWORKING + "/v2.0/security-groups?tenant_id=" + project_id
  get_token(project_id, function(token) {
    console.log("TOKEN"+token + project_id)
    make_GET_request(url, token, function(body) {
      callback(body['security_groups'])
    })
  })
}
