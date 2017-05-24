function Parser(obj,settings){
	this.require=function(name,data){
		if (!data.correct) return false;
		var data2={
			text:data.text.substr(data.length),
			correct:true,
			length:0
		}
		var ans=this["_"+name](data2);
		data.correct=data.correct&&data2.correct;
		data.length+=data2.length;
		return ans;
	};
	this.request=function(name,required,data){
		if (!data.correct) return 0;
		var data2={
			text:data.text.substr(data.length),
			correct:true,
			length:0
		}
		var ans=this["_"+name](data2);
		if (!data2.correct){
			if (required)
				data.correct=false;
			return false;
		}else{
			data.length+=data2.length;
			return ans;
		}
	};
	this.base=function(fn,required,data,arg){
		if (!data.correct)
			return false;
		var i=0;
		while(this.skip.indexOf(data.text[i])>=0){
			i++;
		}
		data.length+=i;
		data.text=data.text.substr(i);
		if (arg)
			var ans=fn(data.text.substr(data.length),arg);
		else
			var ans=fn(data.text.substr(data.length));
		if (ans.length){
			data.length+=ans.length;
			return ans;
		} else {
			if (required)
				data.correct=false;
			return false;
		}
	};
	this.baseChars=function(chars,required,data){
		return this.base(function(text,chars){
				var i=0;
				while (chars.indexOf(text[i])>=0){
					i++;
				}
				return text.substr(0,i);
			},required,data,chars);
	};
	this.baseChar=function(chars,required,data){
		return this.base(function(text,chars){
				return (chars.indexOf(text[0])>=0)?text[0]:false;
			},required,data,chars);
	};
	this.baseSub=function(substrings,required,data){
		return this.base(function(text,substrings){
				for (i=0;i<substrings.length;i++){
					if (text.substr(0,substrings[i].length)==substrings[i])
						return substrings[i];
				}
				return "";
			},required,data,substrings);
	};
	this.parse=function(text){
		return this.request(this.begin,1,{text:text,length:0,correct:true});
	}
	this.begin="parse";
	this.skip=""
	if (settings){
		settings.begin&&(this.behin=settings.begin);
		settings.skip&&(this.skip=settings.skip);
	}
	for (var x in obj){
		this["_"+x]=obj[x];
	}
}
