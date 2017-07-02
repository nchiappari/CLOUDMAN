
function make_UNSCOPED_GET_request(url, callback) {
  handle_making_GET_request(url, UNSCOPED_TOKEN, callback)
}

function make_GET_request(url, project_id, callback) {
  get_token(project_id, function(token) {
    handle_making_GET_request(url, token, callback)
  })
}

function handle_making_GET_request(url, token, callback) {
  request({
      url: url,
      method: 'GET',
      headers: {'X-Auth-Token': token},
      json: true
  }, function(error, response, body) {
      handle_response(error, response, body, callback)
  });
}

function make_UNSCOPED_POST_request(url, post_data, callback) {
  console.log("url:"+url)
  handle_making_POST_request(url, post_data, UNSCOPED_TOKEN, callback)
}

function make_POST_request(url, project_id, post_data, callback) {
  get_token(project_id, function (token) {
    handle_making_POST_request(url, post_data, token, callback)
  })
}

function handle_making_POST_request(url, post_data, token, callback) {
  request({
      url: url,
      method: 'POST',
      json: post_data,
      headers: {'X-Auth-Token': token},
  }, function(error, response, body) {
    handle_response(error, response, body, callback)
  })
}

function make_DELETE_request(url, project_id, callback) {
  get_token(project_id, function (token) {
    request({
        url: url,
        method: 'DELETE',
        headers: {'X-Auth-Token': token},
    }, function(error, response, body) {
      handle_response(error, response, body, callback)
    });
  })
}

function handle_response(error, response, body, callback) {
  if (response.statusCode && response.statusCode == 401) {
    reset_loader()
    display_alert(false, true, "You are not authorized to complete this action.")
  } else if (response.statusCode && response.statusCode == 404) {
    reset_loader()
    display_alert(false, true, "OpenStack returned a 404 Not Found response.")
  } else if (body.NeutronError) {
    reset_loader(false)
    handle_os_network_errors(body.NeutronError)
  } else if (error) {
    reset_loader(false)
    console.error("error handling coming to a codebase near you soon"+response)
  } else {
    callback(body)
  }
}

//gets token for a specific project - sets it first if necessary
function get_token(project_id, callback) {
  if (project_id in TOKEN_MAP) {
    return callback(TOKEN_MAP[project_id])
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
      TOKEN_MAP[project_id] = response['headers']['x-subject-token']
      callback(TOKEN_MAP[project_id])
    });
}

function build_endpoints(body, callback) {
  var catalog = body['token']['catalog']
  catalog.forEach(function (service) {
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
        reset_loader()
        display_alert(false, false, "Could not connect to OpenStack.")
      } else {
        UNSCOPED_TOKEN = response['headers']['x-subject-token']
        build_endpoints(body)
        callback()
      }
    });
}


// defines global all_instances
function define_all_instances(callback) {
  make_UNSCOPED_GET_request(URL_COMPUTE + "/servers/detail", function(body) {
    all_instances = body['servers']
    callback()
  })
}
