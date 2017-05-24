"use strict";

define(function () {

// clamp x between lower and upper
function clamp(x, lower, upper){
    return Math.min(Math.max(x, lower), upper)
}


// square the number
function sqr(x){
    return x*x;
}


// return val if it is defined, else defaultValue
// this is mainly useful for numbers or strings because 0 and "" are falsy
// and for either of those val || defaultValue will give the defaultValue
function def(val, defaultValue){
    for (var i=0; i<arguments.length; i++){
        if (typeof arguments[i] !== 'undefined'){
            return arguments[i];
        }
    }
    return undefined;
}


// generate a random name by alternating vowels and consonants
function generateName(){
    
    /*var vowelChances = {
        a: 11,
        e: 10,
        i: 8,
        o: 8,
        u: 4,
        y: 1
    }
    
    var consonantChances = {
        b: 4,
        c: 4,
        d: 5,
        f: 3,
        g: 4,
        h: 2,
        j: 4,
        k: 4,
        l: 4,
        m: 6,
        n: 6,
        p: 4,
        q: 1,
        r: 6,
        s: 6,
        t: 7,
        v: 3,
        w: 2,
        x: 1,
        z: 1
    }
    
    var vowels = [];
    var consonants = [];
    for (var vowel in vowelChances){
        for (var i=0; i<vowelChances[vowel]; i++){
            vowels.push(vowel)
        }
    }
    for (var consonant in consonantChances){
        for (var i=0; i<consonantChances[consonant]; i++){
            consonants.push(consonant)
        }
    }
    
    /*/
    
    var vowels = "aaaeeeiiiooouuuy";
    var consonants = "bbcddffgghjjkkllmmmnnnppqrrrsssttttvvwxz";
    /**/
    var name = "";
    var wroteVowel = Math.random()>0.5;
    var length = (Math.random()*Math.random()*10+3)|0;
    for (var i=0; i<length; i++){
        if (!wroteVowel){
            name += vowels.charAt((Math.random()*vowels.length)|0);
        } else {
            name += consonants.charAt((Math.random()*consonants.length)|0);
        }
        if (i==0){
            name = name.toUpperCase();
        }
        wroteVowel = !wroteVowel;
    }
    return name;
}


return {clamp: clamp, sqr:sqr, generateName: generateName, def: def};
});
