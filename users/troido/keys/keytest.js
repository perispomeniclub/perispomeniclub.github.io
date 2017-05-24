

function main(){
    
    var attributes = ["which", "keyCode", "charCode", "key", "char", "code"];
    
    window.addEventListener("keydown", function(e){
        console.log(e);
        for (var attr of attributes){
            document.getElementById(attr).innerHTML = e[attr];
        }
    });
}

window.addEventListener("load", main);