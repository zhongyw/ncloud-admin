var crypto = require('crypto'),
    _ = require('lodash'),
    constants = require('../../constants');

var apiRoot = "http://192.168.206.129:3000";

function generatePassword(email) {

    return crypto.createHash('sha1').update(email + ':password').digest('hex');
}

var emails = {};

_.each(constants.role, function (role, roleName) {
    if (role !== constants.role.GUEST) {
        emails['' + role] = roleName.toLowerCase() + '@nbn8.com';
    }
});

function generateAuthorization(role){
  var
        email = null,
        passwd = null;
  if (typeof(role) === 'number' && (role >= 0)) {
        email = emails['' + role];
        passwd = generatePassword(email);

        return 'Basic ' + new Buffer(email + ':' + passwd).toString('base64');
  }
}

var pagerAdaptor = {
  getPagerFromRemote: function(statePager,remotePager){
      var pagerNew = {
          current: remotePager.index,
          total: remotePager.total,
          pageSize: remotePager.size
      }
      pagerNew = Object.assign({}, statePager, pagerNew);
      return pagerNew;
  }

}
export {apiRoot, pagerAdaptor, generateAuthorization, constants}
