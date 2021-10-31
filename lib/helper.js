var helper = {};

helper.generateRandomString = (stringLength) => {
    stringLength = typeof(stringLength) === 'number' ? stringLength : 20;
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var str = '';
    for (i = 0; i < stringLength; i++){
        var randomChar = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        str+= randomChar;
    }
    return str;
}

// generate an id for new users
helper.generateUserId = (stringLength) => {
    stringLength = typeof(stringLength) === 'number' ? stringLength : 6;
    var possibleId = '0123456789';
    var int = '';
    for (i = 0; i < stringLength; i++){
        var randomChar = possibleId.charAt(Math.floor(Math.random() * possibleId.length));
        int+= randomChar;
    }
    return int;
}


helper.formatObject = (oldObject = {}, newObject = {}) => {
    let tempObj = {};
    Object.keys(newObject).map(key => {
        if (oldObject.hasOwnProperty(key)){
            tempObj[key] = oldObject[key];
        }
    })
    return {...oldObject, ...tempObj};
}

module.exports = helper;