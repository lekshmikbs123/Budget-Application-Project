//Determining public and private....

var budgetcontroller=(function(){
var x=23;
var add=function(a){
    return x+a;

}
return{
    publicTest:function(b){
        return add(b);
    }
}

})();

var UIcontroller = (function(){


})();

var controller=(function(budgetctrl,UIctrl){

var z=budgetctrl.publicTest(5);
return {
    anotherPublic:function(){
      console.log(z);
    }
}


})(budgetcontroller,UIcontroller);