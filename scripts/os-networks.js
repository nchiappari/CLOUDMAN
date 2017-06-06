
// ################################################################################ //
// ### SECURITY _RULE_ FUNCTIONS ###

// gets and then deletes the default security rules created by openstack
function delete_default_security_rules(project_id, group_id, callback) {
  get_security_rules(project_id, group_id, function(rules_to_delete) {
    delete_security_rules(project_id, rules_to_delete, callback)
  })
}

// deletes all rules passed in (see delete_default_security_rules)
function delete_security_rules(project_id, rules_to_delete, callback) {
  if (rules_to_delete.length == 0) {
    callback()
  } else {
    rule = rules_to_delete.pop()
    delete_security_rule(project_id, rule['id'], function() {
      delete_security_rules(project_id, rules_to_delete, callback)
    })
  }
}

function delete_security_rule(project_id, rule_id, callback) {
  var url = URL_NETWORKING + "/v2.0/security-group-rules/"+rule_id
  make_DELETE_request(url, project_id, callback)
}

// creates new security rule for specified security group
function create_new_group_rule(security_group_id, project_id, type, direction) {
    var url = URL_NETWORKING + "/v2.0/security-group-rules"

    var rule_data = BASE_SECURITY_RULES[type.toLowerCase()]

    var ports = rule_data['ports']

    ports.forEach(function(port) {
        post_data = {
            "security_group_rule": {
                "direction": direction,
                "port_range_min": port,
                "port_range_max": port,
                "security_group_id": security_group_id,
                "protocol": rule_data['protocol'],
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
    })
}

function get_security_rules(project_id, security_group_id, callback) {
  var url = URL_NETWORKING + "/v2.0/security-group-rules?security_group_id=" + security_group_id
  make_GET_request(url, project_id, function(body) {
    callback(body['security_group_rules'])
  })
}

// ################################################################################ //
// ### SECURITY _GROUP_ FUNCTIONS ###

// function is recursive to ensure callback is not called until all are deleted
function delete_security_groups(project_id, groups_to_delete, callback) {
  if (groups_to_delete.length == 0) {
    callback()
  } else {
    group = groups_to_delete.pop()
    delete_security_group(project_id, group['id'], function() {
      delete_security_groups(project_id, groups_to_delete, callback)
    })
  }
}

function delete_security_group(project_id, group_id, callback) {
  var url = URL_NETWORKING + "/v2.0/security-groups/"+group_id
  make_DELETE_request(url, project_id, callback)
}

// creates new security group - passes new group's id into callback
function create_new_security_group(name, description, project_id, callback) {
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
      callback(body['security_group']['id'])
    })
}

// assigns our predefined security groups
function assign_security_groups(project_id, groups_to_assign) {
  groups_to_assign.forEach(function (group_key) {

    group = BASE_SECURITY_GROUPS[group_key]
    // delete any old versions/duplicates that may already exist
    delete_security_groups_by_name(project_id, group_key, function () {
      create_new_security_group(group_key, group['description'], project_id, function(new_security_group_id) {
        // delete default rules added on group create
        delete_default_security_rules(project_id, new_security_group_id, function () {
          // create group specific rules
          group = BASE_SECURITY_GROUPS[group_key]
          group['rules'].forEach(function (rule) {
            if (rule['ingress']) {
              create_new_group_rule(new_security_group_id, project_id, rule['type'], "ingress")
            }
            if (rule['egress']) {
              create_new_group_rule(new_security_group_id, project_id, rule['type'], "egress")
            }
          })
        })
      })
    })
  })
}

function delete_security_groups_by_name(project_id, name, callback) {
  get_security_groups_by_name(project_id, name, function (security_groups) {
      delete_security_groups(project_id, security_groups, callback)
  })
}

function get_security_groups_by_name(project_id, name, callback) {
    var url = URL_NETWORKING + "/v2.0/security-groups?tenant_id=" + project_id + "&name=" + name
    make_GET_request(url, project_id, function(body) {
      callback(body['security_groups'])
    })
}

function get_all_security_groups(project_id, callback) {
    var url = URL_NETWORKING + "/v2.0/security-groups?tenant_id=" + project_id
    make_GET_request(url, project_id, function(body) {
      callback(body['security_groups'])
    })
}
