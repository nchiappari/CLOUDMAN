

function get_all_projects(callback) {
  var url = URL_IDENTITY + "/projects/"
  make_GET_request(url, UNSCOPED_TOKEN, function(body) {
    callback(body['projects'])
  })
}
