

define(function(){
	var loadFile = (function(){
		var cache = {};
		
		return function(filename,callback){
			if (cache[filename]){
				callback(cache[filename]);
			} else {
				var http = new XMLHttpRequest();
				http.onload = function(){
					cache[filename] = http.responseText;
					callback(http.responseText);
				};
				http.open("GET",filename,true);
				http.send();
			}
		}
	})();
	return loadFile;
});