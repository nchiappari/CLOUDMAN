function make_GET_request(url, token, callback) {
  console.log("MAKING GET REQUEST: " + url)
  console.log("TOKEN: " + token)
  request({
      url: url,
      method: 'GET',
      headers: {'X-Auth-Token': token},
  }, function(error, response, body) {
      if (response.statusCode && response.statusCode == 401) {
        set_loader(false)
        display_alert(false, true, "You are not authorized to complete this action.")
      }
      else if (error) {
        set_loader(false)
        display_alert(false, false, "An error occurred making a GET request to " + url)
        handle_errors(response)
      } else {
        callback(JSON.parse(body))
      }
  });
}

function make_POST_request(url, project_id, post_data, callback) {
  get_token(project_id, function (token) {
    console.log("MAKING POST REQUEST - " + url);
    request({
        url: url,
        method: 'POST',
        json: post_data,
        headers: {'X-Auth-Token': token},
    }, function(error, response, body) {
      if (response.statusCode && response.statusCode == 401) {
        set_loader(false)
        display_alert(false, true, "You are not authorized to complete this action.")
      }
      else if (error) {
        handle_errors(response)
      } else {
        callback(body)
      }
    });
  })
}

function handle_errors(response) {
  console.error("error handling coming to codebase near you soon"+response)
}


//gets token for a specific project - sets it first if necessary
function get_token(project_id, callback) {
  console.log("IN GET TOKEN")
  if (project_id in TOKEN_MAP) {
    return callback(TOKEN_MAP[project_id])
  }
  set_access_token(project_id, callback)
}

// sets an access token scoped to a specific project
function set_access_token(project_id, callback) {
    console.log("IN SET ACCESS")
    console.log("URL:"+URL_AUTH)

    post_data = {"auth": {"identity": {"methods": ["password"],"password": {"user": {
                  "domain": {"name": "users"},"name": USER_NAME,"password": PASSWORD}}},
                  "scope":
                  {"project": {"domain": {"name": "users"},"id": project_id}}}}

    console.log("POST DATA:"+JSON.stringify(post_data))

    request({
      url: URL_AUTH,
      method: 'POST',
      json: post_data
    }, function(error, response, body) {
      TOKEN_MAP[project_id] = response['headers']['x-subject-token']
      console.log("FINAL TOKEN"+response['headers']['x-subject-token'])
      callback(TOKEN_MAP[project_id])
    });
}


// TODO not actually unscoped yet
function set_unscoped_access_token(callback) {
    post_data = {"auth": {"identity": {"methods": ["password"],"password": {"user": {
                  "domain": {"name": "users"},"name": USER_NAME,"password": PASSWORD}}},
                  "scope":
                  {"project": {"domain": {"name": "users"},"name": "Other"}}}}

    request({
      url: URL_AUTH,
      method: 'POST',
      json: post_data
    }, function(error, response, body) {
      if (error) {
        set_loader(false)
        display_alert(false, false, "Could not connect to OpenStack.")
      } else {
        UNSCOPED_TOKEN = response['headers']['x-subject-token']
        body['token']['catalog'].forEach(function (service) {
          // console.log(service)
          var endpoints = service['endpoints']
          for (var i = 0; i < endpoints.length; i += 1) {
            if (endpoints[i]['interface'] == "public") {
              var url = endpoints[i]['url']
              break
            }
          }
          if (service['name'] == "nova") {
            URL_COMPUTE = url
          } else if (service['name'] == "neutron") {
            URL_NETWORKING = url
          } else if (service['name'] == "keystone") {
            URL_IDENTITY = url.replace("/v2.0", "/v3") //v2.0 is deprecated
          }
        })
        callback()
      }
    });
}

// defines global all_instances
function set_all_instances(callback) {
  make_GET_request(URL_COMPUTE + "/servers/detail", UNSCOPED_TOKEN, function(body) {
    all_instances = body['servers']
    callback()
  })
}
