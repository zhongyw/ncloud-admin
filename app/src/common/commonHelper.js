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

var dateHelper = {
  toDate: function(timestamp){
    var date = new Date(timestamp),
        year = date.getYear() + 1900,
        month = date.getMonth() + 1,
        d = date.getDate(),
        // Hours part from the timestamp
        hours = date.getHours(),
        // Minutes part from the timestamp
        minutes = "0" + date.getMinutes(),
        // Seconds part from the timestamp
        seconds = "0" + date.getSeconds();

    return year + '-' + month + '-' + d + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  }
}

export {apiRoot, pagerAdaptor, generateAuthorization, constants, dateHelper}
