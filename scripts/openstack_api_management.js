function make_GET_request(url, token, callback) {
  console.log("MAKING GET REQUEST - " + url)
  request({
      url: url,
      method: 'GET',
      headers: {'X-Auth-Token': token},
  }, function(error, response, body) {
      if (error) {
          handle_errors(response.statusCode, response)
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
        if (error) {
            handle_errors(response.statusCode, response)
        } else {
          callback(response)
        }
    });
  })
}

function handle_errors(statusCode, response) {
  console.error("error handling coming to codebase near you soon"+statusCode)
}


//gets token for a specific project - sets it first if necessary
function get_token(project_id, callback) {
  if (project_id in token_map) {
    return callback(token_map[project_id])
  }
  set_access_token(project_id, callback)
}

// sets an access token scoped to a specific project
function set_access_token(project_id, callback) {
    post_data = {"auth": {"identity": {"methods": ["password"],"password": {"user": {
                  "domain": {"name": "users"},"name": USER_NAME,"password": PASSWORD}}},
                  "scope":
                  {"project": {"domain": {"name": "users"},"id": project_id}}}}
    request({
      url: URL_AUTH,
      method: 'POST',
      json: post_data
    }, function(error, response, body) {
      token_map[project_id] = response['headers']['x-subject-token']
      callback(token_map[project_id])
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
          if (service['name'] == "nova") {
            endpoints = service['endpoints']
            URL_COMPUTE = endpoints[endpoints.length - 1]['url']
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
