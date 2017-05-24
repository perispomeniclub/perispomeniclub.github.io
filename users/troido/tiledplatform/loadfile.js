"use strict";

/* Load and cache files
 * This assumes the files don't change in the meanwhile
 * The functions can be called without callback to preload the files into cache
 * so the next time they are called, it can be almost instantly
 */

var LoadFile = (function(){
	var textCache = {};
	var imgCache = {};
	var callbacks = {}; // this is going to be a dictionary of arrays (or sets) of functions
	
	
	
	
	function getFileType(name){
		// get the last dot and the alphanumeric characters behind it
		var extension = name.match(/\.\w+$/);
	}
	
	
	
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
			if (textCache[filename]){
				if (callback){
					if (textCache[filename].loaded){
						callback && callback(textCache[filename].value);
					} else {
						textCache[filename].callbacks.push(callback);
					}
				}
			} else {
				var http = new XMLHttpRequest();
				http.onload = function(){
					textCache[filename].value = http.responseText;
					textCache[filename].loaded = true;
// 					cache[filename].callbacks.forEach(function(cb){
					for (var i=0, l=textCache[filename].callbacks.length; i<l; i++){
						textCache[filename].callbacks[i](http.responseText);
					}
					delete textCache[filename].callbacks;
// 					callback && callback(http.responseText);
				};
				textCache[filename] = {
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
				
			if (imgCache[filename]){
				if (callback){
					if (imgCache[filename].loaded){
						callback && callback(imgCache[filename].value);
					} else {
						imgCache[filename].callbacks.push(callback);
					}
				}
				return imgCache[filename].value;
			} else {
				var img = new Image();
				img.onload = function(){
					imgCache[filename].loaded = true;
// 					cache[filename].callbacks.forEach(function(cb){
					for (var i=0, l=imgCache[filename].callbacks.length; i<l; i++){
						imgCache[filename].callbacks[i](img);
					}
					delete imgCache[filename].callbacks;
				};
				imgCache[filename] = {
					loaded: false,
					value: img,
					callbacks: callback ? [callback] : []
				};
				img.src = filename;
				return img;
			}
		},
		
		loadBatch: function(files, callback){
			
			for (var i=0; i<files.length; i++){
				
			}
		}
	};
})();