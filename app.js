//Determining public and private....
//Budget Controller
var budgetcontroller=(function(){

var Expense=function(id,description,value){
 this.id=id;;
 this.description=description;
 this.value=value; 
 this.percentage=-1;
};

Expense.prototype.calcPercentage=function(totalIncome){
if(totalIncome>0){
 
this.percentage=Math.round((this.value/totalIncome)*100);

}else{
    this.percentage=-1;
}

};


Expense.prototype.getpercentage=function(){
return this.percentage;


};
var Income=function(id,description,value){
    this.id=id;;
    this.description=description;
    this.value=value; 
   };
var calculatetotal=function(type){
var sum=0;
data.allitems[type].forEach(function(cur){
sum=sum+cur.value;

})
data.totals[type]=sum;

};

var totalexpenses=0;
var data={
    allitems:{
exp:[],
inc:[]
    },
totals:{
    ecp:0,
    inc:0
},
budget:0,
percentage:-1


       
};

return{
    additem:function(type,des,val){
        var newitem,ID;
        //create a new id prev.id+1
        if(data.allitems[type].length>0){
             ID=data.allitems[type][data.allitems[type].length-1].id+1;
        }else{
            ID=0;
        }
        //create a new  item based on inc or exp
        if(type==='exp'){
            newitem=new Expense(ID,des,val);
  }
  else if(type==='inc'){
    newitem=new Income(ID,des,val);
  }
  //PUSH INTO DS
data.allitems[type].push(newitem);

return newitem;
   },

   deleteitem:function(type,id){
//[1,2,4,6,8]
//id=6
//index=3
var ids=data.allitems[type].map(function(current){
return current.id;
});
var index=ids.indexOf(id);
if(index!==-1){

    data.allitems[type].splice(index,1);
}
   },

   calculatebudget:function(){
//calculate total income and expense
calculatetotal('inc');
calculatetotal('exp');

//calculate budget income-expense
data.budget=data.totals.inc-data.totals.exp;
//calculate the percentage of income that we spent
if(data.totals.inc>0){
data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
}else{
    data.percentage=-1;
}
   },



calculatepercentages:function(){
//a=10
//b=20
//c=40
//income=100
//perc of a=10/100=10%
//perc of b=20/100=20%
//perc of c=40/100=40%
data.allitems.exp.forEach(function(cur){
cur.calcPercentage(data.totals.inc);
});

},
getpercentages:function () {
    var allpercent=data.allitems.exp.map(function(cur){
return cur.getpercentage();

    });
   
return allpercent;
},
getbudget:function(){
return{
    budget:data.budget,
    totalinc:data.totals.inc,
    totalexp:data.totals.exp,
    percentage:data.percentage
}
},



   testing:function(){
console.log(data);
   }
};

})();

//UI controller
var UIcontroller = (function(){
var Domstrings={

    inputtype:'.add__type',
    inputdescription:'.add__description',
    inputvalue:'.add__value',
    inputbutn:'.add__btn',
    incomeContainer:'.income__list',
    expenseContainer:'.expenses__list',
    budgetlabel:'.budget__value',
    inclabel :'.budget__income--value',
    explabel:'.budget__expenses--value',
    percentagelabel:'.budget__expenses--percentage',
    container:'.container',
    expensespercentage:'.item__percentage',
    month:'.budget__title--month'
}

var formatNumber=function(num,type){
    /*
    + or - before the number
    set exactly 2 decimal points
    comma seperating thousands
    23401.4567  ->   +23,401.46
    
    
    */ 
    var int,dec;
    
    num=Math.abs(num);
    num=num.toFixed(2);
    
    var numSplit=num.split('.');
    int= numSplit[0];
    dec=numSplit[1];
    console.log(int);
    if(int.length>3){
        int=int.substr(0,int.length-3)+','+substr(int.length-3,3);
        console.log(int);
    }
    
    return (type==='exp'?'-':'+')+' '+int+'.'+dec;
    };
    var nodeListForEach=function (List,callback) {
        for(var i=0;i<List.length;i++){
            callback(List[i],i);
        }
    };
    return{

        getInput:function(){
            return {
            type:document.querySelector(Domstrings.inputtype).value,
            description:document.querySelector(Domstrings.inputdescription).value,
            value:parseFloat(document.querySelector(Domstrings.inputvalue).value)
         } ;},
        addlistitem:function(obj,type){
//1.create html string placeholder tag
var html,newhtml,element;
if(type==='inc'){
element=Domstrings.incomeContainer;
html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
}else if(type==='exp'){
    element=Domstrings.expenseContainer;
    html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>';
}

//2.replace the placeholder with actual data
newhtml=html.replace('%id%',obj.id);
newhtml=newhtml.replace('%description%',obj.description);

newhtml=newhtml.replace('%value%',formatNumber(obj.value,type));


//3.insert html into dom
document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);

        },

deletelistite:function(selectorid){
document.getElementById(selectorid).parentNode.removeChild(document.getElementById(selectorid));
},


clearFields:function(){

    //quertselectorall returns list...so we have to convert list to array..using slice
    var fields;
fields=document.querySelectorAll(Domstrings.inputdescription+','+Domstrings.inputvalue);

var fieldsarray=Array.prototype.slice.call(fields);
fieldsarray.forEach(function(current,index,array){

    current.value="";
});
fieldsarray[0].focus();
},
dispaybudget:function(obj){
var type;
obj.budget>0?type='inc':type='exp';
document.querySelector(Domstrings.budgetlabel).textContent=formatNumber( obj.budget,type );
document.querySelector(Domstrings.inclabel).textContent=formatNumber(obj.totalinc,'inc');
document.querySelector(Domstrings.explabel).textContent=formatNumber(obj.totalexp,'exp');
if(obj.percentage>0){
document.querySelector(Domstrings.percentagelabel).textContent=obj.percentage+'%';
}else{
    document.querySelector(Domstrings.percentagelabel).textContent='---';

}
},
displaypercentages:function(percentages) {
   var fields=document.querySelectorAll(Domstrings.expensespercentage); 



   nodeListForEach(fields,function(current,index){

    if(percentages[index]>0){

        current.textContent=percentages[index]+'%';

    }else{
        
current.textContent='---';

    }
   });
},
datedisplay:function(){
    var now,year,monthh,months;
now=new Date();
months=['january','february','march','april','may','june','july','august','sept','oct'];
monthh=now.getMonth();
year=now.getFullYear();
document.querySelector(Domstrings.month).textContent=months[monthh]+' '+year;
},
changedtype:function(){
var fields=document.querySelectorAll(Domstrings.inputtype+','
+Domstrings.inputdescription+','+Domstrings.inputvalue);
nodeListForEach(fields,function(cur){
cur.classList.toggle('red-focus');
});

document.querySelector(Domstrings.inputbutn).classList.toggle('red');
},
         getDomstrings:function(){
             return Domstrings;
         }
    };

})();


//Global app controller
var controller=(function(budgetctrl,UIctrl){


var setupeventlisteners=function(){

    var Dom=UIctrl.getDomstrings();

    document.querySelector(Dom.inputbutn).addEventListener('click',ctrladditem);


    document.addEventListener('keypress',function(event){
    
    if(event.keyCode==13 ||event.which==13){
    ctrladditem();
    }
    });


    document.querySelector(Dom.container).addEventListener('click',ctrldeleteitem);
    document.querySelector(Dom.inputtype).addEventListener('change', UIctrl.changedtype );
};

var updatepercentages=function()
{
//calculate percentage

budgetctrl.calculatepercentages();
//read the PERCETEAGE budget controller
var percentages=budgetctrl.getpercentages();
//uopdate the UI
UIctrl.displaypercentages(percentages);
};
 var updatebudget=function(){

//4.calculate the buddget
budgetctrl.calculatebudget();
//return the budget
var budget=budgetctrl.getbudget();
//5.display the budget
UIctrl.dispaybudget(budget);
}

var ctrladditem = function(){
    //TO-DO list
    var input,newitem;
//1. Get the filled input data
input=UIctrl.getInput();

if(input.description!==" " &&  !isNaN(input.value) && input.value>0){

//2.add item to the budget controller

newitem=budgetctrl.additem(input.type,input.description,input.value);

//3.add item to the UI controller

UIctrl.addlistitem(newitem,input.type);
//clear tthe fields

UIctrl.clearFields();

//calculate an update the budget

updatebudget();

//CALCULATE AND UUPDATE PERCE

updatepercentages();

}
};


var ctrldeleteitem=function(event){
    var itemid,splitid;
    itemid=(event.target.parentNode.parentNode.parentNode.parentNode.id);
if(itemid){
    //inc-1
splitid=itemid.split('-');
type=splitid[0];
ID=parseInt(splitid[1]);

//delete item from DS
budgetctrl.deleteitem(type,ID);
//delete item from UI
UIctrl.deletelistite(itemid);
//update and show the new budgett
updatebudget();
}


};

return{
init:function(){
    console.log('started');
    UIctrl.datedisplay();
UIctrl.dispaybudget({
budget:0,
totalinc:0,
totalexp:0,
percentage:-1
});
    setupeventlisteners();

}

};
})(budgetcontroller,UIcontroller);


controller.init();