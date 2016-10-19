var crypto = require('crypto');


var apiRoot = "http://192.168.206.129:3000";

function generatePassword(email) {

    return crypto.createHash('sha1').update(email + ':password').digest('hex');
}
function generateAuthorization(role){
  var
        email = null,
        passwd = null;
  if (typeof(role) === 'number' && (role >= 0)) {
        email = emails['' + role];
        passwd = generatePassword(email);
        headers['Authorization'] = 'Basic ' + new Buffer(email + ':' + passwd).toString('base64');
        console.log('    Authorization: ' + headers.Authorization);
  }
}
function pagerAdapt(statePager,remotePager){
    var pagerNew = {
        current: remotePager.pages,
        total: remotePager.total,
        pageSize: remotePager.size
    }
    pagerNew = Object.assign({}, statePager, pagerNew);
    return pagerNew;
};
export {apiRoot, pagerAdapt}
