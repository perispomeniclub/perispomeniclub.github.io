
// based on http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters

// todo: does url decoding work properly?

var QueryString = function () {
    // This function is anonymous, is executed immediately and 
    // the return value is assigned to QueryString!
    var queryParams = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (typeof pair[1] === "undefined") {
            pair[1] = true;
        }
        queryParams[pair[0]] = decodeURIComponent(pair[1]);
    } 
    return queryParams;
}();
