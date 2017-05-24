
// enable the string method startsWith() if not supported
if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (searchString, position) {
      position = position || 0;
      return this.indexOf(searchString, position) === position;
    }
  });
}

// enable the string method contains() if not supported
if(!('contains' in String.prototype))
  String.prototype.contains = function(str, startIndex) { return -1 !== String.prototype.indexOf.call(this, str, startIndex); };

var valid={
	nameChars:"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_$",
	nameChar:function(char){
		return this.nameChars.contains(char);
	},
	emptyChars:" \n",
	empty:function(char){
		return this.emptyChars.contains(char);
	},
	splittingChars:"\n;",
	splitting:function(char){
		return this.splittingChars.contains(char);
	}
}


var parse={
	splitting:function(text){
		var len=0;
		var s=0;
		while(valid.splitting(text[len])||valid.empty(text[len])){
			len++;
			if (valid.splitting(text[len]))	s++;
		}
		if (s) return len;
		else return 0;
	},
	empty:function(text){
		var len=0;
		while(valid.empty(text[len])){
			len++;
		}
		return len;
	},
	name:function(text){
		var len=parse.empty(text);
		var val="";
		while(valid.nameChar(text[len])){
			val[len]=text[len];
			len++;
		}
		return val;
	},
	scriptDeclaration:function(text){
		var len=parse.empty(text);
		if (text.startsWith("#define ")) len+=8;
		else return 0;
		var name=parse.name(text.substr(len));
		if (name) len+=name.length;
		return {
			name:name,
			length:len
		};
	},
	bracket:function(text){
		var len=parse.empty(text);
		if (text[len]=='{'){
			len++;
		}else return 0;
		var st=parse.body(text.substr(len));
		st&&len+=st.length;
		len+=parse.splitting(text.substr(len));
		if (text[len]=='}'){
			return {
				length:++len,
				body:st?st.statements:0
			};
		}
		return 0;
	},
	assignment:function(text){
		var len;
		var left=parse.varName(text.substr(len));
		if (left) len=left.length;
		else return 0;
		
		len+=parse.empty(text.substr(len));
		if (text.substr(len).startsWith('=')) len++;
		else return 0;
		var right=parse.expression(text.substr(++len);
		if (right) len+=right.length;
		else return 0;
		return {
			length:len,
			left:left.name,
			right:right.data
		};
	},
	declaration:function(text){
		var len=parse.empty(text);
		var type;
		if (text.substr(len).startsWith("var ")){
			type="local";
			len+=4;
		} else if (text.substr(len).startsWith("globalvar ")){
			type="global";
			len+=10;
		} else return 0;
		
		var names=[];
		var name;
		do  {
			len+=parse.empty(text.substr(len));
			name=parse.name(text.substr(len));
			if (name) len+=name.length;
			else return 0;
			names.push(name);
			len+=parse.empty(text.substr(len));
		} while (text.substr(len++).startsWith(","))
		return {
			length:len,
			type:type,
			vars:names
		};
	},
	control:function(text){
		var len=parse.empty(text);
		var ini,con,inc,dec;
		var needBracket=0;
		if (text.substr(len).startsWith("for")){
			len+=3;
			len+=parse.empty(text.substr(len));
			if (text.substr(len).startsWith("(")) {len++; needBracket=1;}
			
			ini=parse.assignment(text.substr(len));
			if (ini) len+=ini.length;
			var splitting=parse.splitting(text.substr(len));
			if (splitting) len+=splitting.length;
			else return 0;
			
			con=parse.expression(text.substr(len));
			if (con) len+=con.length;
			var splitting=parse.splitting(text.substr(len));
			if (splitting) len+=splitting.length;
			else return 0;
			
			inc=parse.assignment(text.substr(len));
			if (inc) inc+=con.length;
			len+=parse.empty(text.substr(len));
			
			if (needBracket){
				if (text.substr(len).startsWith("(")) len++
				else return 0;
			}
			
			decl=0;
		} else if (text.substr(len).startsWith("while")){
			len+=5;
			len+=parse.empty(text.substr(len));
			if (text.substr(len).startsWith("(")) {len++; needBracket=1;}
		} else return 0;
		len+=parse.empty(text.substr(len));
		var st=parse.statement(text);
		if (st) len+=st.length;
		else return 0;
		return {
			length:len,
			init:ini,
			condition:con,
			icrement:inc,
			declaration:dec,
			statement:st
		};
	},
	statement:function(text){
		var len=parse.splitting(text);
		if (!len) return 0;
		var st
		
		st=parse.bracket(text.substr(len));
		if (st) {
			len+=st.length;
			return {
				length:len,
				type:"bracket",
				body:st.body
			};
		}
		
		st=parse.assignment(text.substr(len))
		if (st){
			len+=st.length;
			return {
				length:len,
				type:"assignment",
				left:st.left,
				right:st.right
			};
		}
		
		st=parse.declaration(text.substr(len)) // both for local and global declarations
		if (st){
			len+=st.length;
			return {
				length:len,
				type:st.type+" declaration",
				variables:st.vars
			};
		}
		
		st=parse.loop(text.substr(len))		// loops
		if (st){							// loops will be converted to for loops (with an optional declaration step)
			len+=st.length;					// with loops are not supported
			return {
				length:len,
				type:"loop",
				expressions:st.expressions,
				statement:st.statement
			};
		}
		
		st=parse.control(text.substr(len))	// conditional statements
		if (st){
			len+=st.length;
			return {
				length:len,
				type:st.type,
				expressions:st.expressions,
				statement:st.statement
			};
		}
		
		st=parse.jump(text.substr(len)) // break, continue and exit
		if (st){
			len+=st.length;
			return {
				length:len,
				type:st.type,
			};
		}
		
		st=parse.ret(text.substr(len)) // return
		if (st){
			len+=st.length;
			return {
				length:len,
				type:st.type+"-statement",
				expression:st.expression,
			};
		}
		
		
		st=parse.functionCall(text.substr(len))
		if (st){
			len+=st.length;
			return {
				length:len,
				type:"function call",
				func:st.func,
				args:st.args
			};
		}
		
	},
	body:function(text){
		var len=-1;
		var statements=[];
		
		var st=parse.statement(text);
		while (st){
			len+=st.len;
			statements+=st.val;
			st=parse.statement(text.substr(len));
			statements.push(st.statement/* ? */);
		}
		return {
			length:len,
			statements:statements
		};
	},
	script:function(text){		// will parse a script after the comments have been removed
		var len=parse.splitting(text);
		var head,body;
		var scripts=[]
		do{
			head=parse.scriptDeclaration(text.substr(len));
			if (head) {
				len+=head.length;
				body=parse.scriptbody(text.substr(len));
				len+=body
				scripts+={name:head.name,statements:body.statements};
			}
		}while (head);
		return {
			length:len,
			functions:scripts
		};
	}
}




var compiler={
	translate:function(text){
		return parse.script(text);
	}
}

