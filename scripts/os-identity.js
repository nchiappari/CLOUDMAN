

function get_all_projects(callback) {
  var url = URL_IDENTITY + "/projects/"
  make_UNSCOPED_GET_request(url, function(body) {

    callback(body['projects'])
  })
}
