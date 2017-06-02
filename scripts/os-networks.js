
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
