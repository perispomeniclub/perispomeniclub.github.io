"use strict";

/* Load and cache files
 * This assumes the files don't change in the meanwhile
 * The functions can be called without callback to preload the files into cache
 * so the next time they are called, it can be almost instantly
 */

var LoadFile = (function(){
	var cache = {};
	var callbacks = {}; // this is going to be a dictionary of arrays (or sets) of functions
	
	
	
	return {
		loadText: function(filename,callback){
// 			if (cache[filename] === true){
// 				if (!callbacks[filename]){
// 					callbacks[filename] = [callback];
// 				} else {
// 					callbacks[filename].push(callback);
// 				}
// 			} else 
// 				
			if (cache[filename]){
				if (callback){
					if (cache[filename].loaded){
						callback && callback(cache[filename].value);
					} else {
						cache[filename].callbacks.push(callback);
					}
				}
			} else {
				var http = new XMLHttpRequest();
				http.onload = function(){
					cache[filename].value = http.responseText;
					cache[filename].loaded = true;
					cache[filename].callbacks.forEach(function(cb){
						cb(http.responseText);
					});
					delete cache[filename].callbacks;
// 					callback && callback(http.responseText);
				};
				cache[filename] = {
					loaded: false,
					value: "",
					callbacks: callback ? [callback] : []
				};
				http.open("GET",filename,true);
				http.send();
			}
		},
// 		loadJSON: function(filename, callback){
// 			this.loadText(fileName, function(string){
// 				callback(JSON.parse(string));
// 			});
// 		},
		loadImage: function(filename,callback){
// 			if (cache[filename] === true){
// 				if (!callbacks[filename]){
// 					callbacks[filename] = [callback];
// 				} else {
// 					callbacks[filename].push(callback);
// 				}
// 			} else 
				
			if (cache[filename]){
				if (callback){
					if (cache[filename].loaded){
						callback && callback(cache[filename].value);
					} else {
						cache[filename].callbacks.push(callback);
					}
				}
				return cache[filename].value;
			} else {
				var img = new Image();
				img.onload = function(){
					cache[filename].loaded = true;
					cache[filename].callbacks.forEach(function(cb){
						cb(img);
					});
					delete cache[filename].callbacks;
				};
				cache[filename] = {
					loaded: false,
					value: img,
					callbacks: callback ? [callback] : []
				};
				img.src = filename;
				return img;
			}
		}
	};
})();