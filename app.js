//the budget data module BUDGET CONTROLLER
var budgetController = (function(){

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var IndExp = function(id, value){
        this.id = id;
        this.value = value;
    }

    // var calculateTotal = function(type) {
    //     var sum = 0;
    //     data.allItems[type].forEach(function(curr){
    //         sum += curr.value;
    //     })

    //     data.totals[type] = sum;
    // }

    var calculateTotal = function(type){
        data.totals[type] = data.allItems[type].reduce((accumulator,currentValue) => accumulator + currentValue.value,0)
    };

    //1.push individual expense  into an array;
    var showVal = function(){
        // data.allItems.exp.forEach(function(curr){
        //     data.expPerc.push(curr.value/data.totals.inc * 100);
        // })
        data.values.push(new IndExp(data.allItems.exp[data.allItems.exp.length - 1].id, data.allItems.exp[data.allItems.exp.length - 1].value));
        // data.allItems.exp[data.allItems.exp.length - 1].value
    }


    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        values: [],
    };

    return {
        addItem: function(type, des, val){
            var newItem, ID;

            //[1 2 3 4 5 ] next ID = 6;
            //[1 2 4 6 8] next ID = 9;
            //ID = last ID + 1;

            //create new ID
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }

            //create a new item based on "inc" or "exp" type
            if(type === "exp"){
               newItem = new Expense(ID, des, val);
            } else if ( type === "inc"){
               newItem = new Income(ID, des, val);
            }

            //push it into our data structure
            data.allItems[type].push(newItem);
            //return the new ITEM
            return newItem;
        },

        calculateBudget: function() {
            //1. Calculate total incomes and expenses
            calculateTotal("exp");
            calculateTotal("inc");
            
            //2. Calculate the budget: income - expenses
            return {
                budget: data.totals.inc - data.totals.exp,
                percentage: parseFloat(  ( (data.totals.exp/data.totals.inc) * 100 ).toFixed(1)  ),
            }
            //3. Calculate the percaentage of income that we spent(expenses)
        },
        returnTotals: function(){
            return {
                incomeTotal: data.totals.inc,
                expensesTotal: data.totals.exp
            }
        },

        valPush: function(type){
            //1.push individual expense percentages into an array only if type is "exp";
            if(type === "exp"){
                showVal();
                return data.values
            }else{
            //2.return expPerc Array;
                return data.values
            }
        },

        itemDelete: function(ID, type){
            data.allItems[type].forEach(function(curr){
                if(curr.id === ID){
                    data.allItems[type].splice(data.allItems[type].indexOf(curr), 1);
                    data.totals[type] -= curr.value;
                }
            })
        },

        valueDelete: function(ID){
            data.values.forEach(function(curr){
                if(curr.id === ID){
                    data.values.splice(data.values.indexOf(curr), 1)
                }
            })
        },

        returnValues: function(){
            return data.values;
        },
        

        testing: function(){
            console.log(data)
        }
    }

})();


//the UI module UI CONTROLLER
var UIController = (function(){

    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list",
        budgetValue: ".budget__value",
        percentage: ".budget__expenses--percentage",
        incomeTotal: ".budget__income--value",
        expensesTotal: ".budget__expenses--value",
        deleteButton: ".item__delete--btn",
        dateLabel: ".budget__title--month"
    }

     return {
         getInput: function() {
             return {
                type: document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
             };
         },

         addListItem: function(obj, type){
             var html, newHtml, element;

            //create HTML string with placeholder text;
            if(type === "inc"){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn inc " id="%idd%"><i class="ion-ios-close-outline">X</i></button></div></div></div>';
            }else if(type === "exp"){
                element = DOMstrings.expensesContainer;
                html ='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage" id="percentage-%idp%">21%</div><div class="item__delete"><button class="item__delete--btn exp " id="%idd%"><i class="ion-ios-close-outline">X</i></button></div></div></div>'
            }

            //replace the placeholder text with some actual data
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);
            newHtml = newHtml.replace("%idp%", obj.id);
            newHtml = newHtml.replace("%idd%", obj.id);

            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
         },

         clearFields: function(){
             var fields, fieldsArr;

             fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);

             fieldsArr = Array.prototype.slice.call(fields);

             fieldsArr.forEach( function(current, index, array){
                 current.value = "";

             });
             fieldsArr[0].focus()
         },

         displayBudget: function(budg){
             document.querySelector(DOMstrings.budgetValue).textContent = budg;
         },

         displayPercentage: function(perc){
            document.querySelector(DOMstrings.percentage).textContent = perc + "%";
         },

         displayTotals: function(type, total){
             if(type === "income"){
                 document.querySelector(DOMstrings.incomeTotal).textContent = total;
             }else if(type ==="expenses"){
                 document.querySelector(DOMstrings.expensesTotal).textContent = total;
             }     
         },

         displayIndPerc: function(arr, inc){
            arr.forEach(function(curr){
                document.querySelector("#percentage-" + curr.id).textContent = parseFloat((curr.value/inc * 100).toFixed(1)) + "%";
                // console.log( document.querySelector("#percentage-" + index).textContent + " " + curr);
            })
         },

         removelistItem: function(ID ,type){
             if(type === "inc"){
                 document.querySelector("#income-" + ID).style.display = "none";
             }else if(type ==="exp"){
                 document.querySelector("#expense-" + ID).style.display = "none";
             }
         },

         displayMonth: function(){
            var now, months, month, year;
            now = new Date(); 
            months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + " " + year;  
         },

         getDOMstrings: function(){
             return DOMstrings;
         },   

     };
    //some code later
})();

// GLOBAL APP CONTROLLER the controller module....the connection between the other two modules.
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener("click", function(){
            ctrlAddItem(); 
            addPerc(); 
            setUpdelete();
        });
        // document.querySelector(".test__add").addEventListener("click", addPerc);

        //keypress event
        document.addEventListener("keypress", function(event){
            if(event.keyCode === 13 || event.which === 13){ //keypress event listener for Enter
                ctrlAddItem();
            }
        }); 
    };
    var setUpdelete = function(){
        var buttons, allButtons, eventID, type;
       buttons =  document.querySelectorAll(".item__delete--btn");

       allButtons = Array.prototype.slice.call(buttons);
       
       allButtons.forEach(function(element){
           element.addEventListener("click", function(e){
                  eventID = parseInt(e.currentTarget.id); //this is because we want the element that has the event listener attached to it.....in this case event .target owould return the icon that was clicked because it is the on that cause the event to bubble......the bubbled event is the event listener we are dealing with now            
                  type = e.currentTarget.className.slice(-4,21);

                  deleteItem(eventID, type);
        })
       })
    }

    var updateBudget = function(){
        var budget ,incomeTot, expensesTot;
        
        //1. Calculate the budget
        budgetCtrl.calculateBudget();

        //2. Return the budget
        budget = budgetCtrl.calculateBudget().budget;
        percentage = budgetCtrl.calculateBudget().percentage;

        //3. Display the budget on the UI
        UICtrl.displayBudget(budget);
        UICtrl.displayPercentage(percentage);

        //4. display the total income and expenses
        //4.1 return total incomes and expenses
         incomeTot = budgetCtrl.returnTotals().incomeTotal;
         expensesTot = budgetCtrl.returnTotals().expensesTotal;
        //4.2 display
        UICtrl.displayTotals("income", incomeTot);
        UICtrl.displayTotals("expenses", expensesTot);

    };

    var ctrlAddItem = function() {

        var input, newItem;

        //1. Get the field input Data 
         input =  UICtrl.getInput();

        
         if(input.description !== "" && !isNaN(input.value) && input.value > 0){
                     //2. Add the item to the budget controller
         newItem = budgetCtrl.addItem(input.type, input.description, input.value);

         //3. Add the item to the UI
         UICtrl.addListItem(newItem, input.type);
 
         //4.clear the fields
         UICtrl.clearFields();
 
         //5.calculate and update budget
         updateBudget();
         }
    };

    var addPerc = function(){
        var incomeTot, inputValue, values;
        //6.make sure that the values array is only updated  if the input type was "exp"/user puts in (-)
         inputValue = UICtrl.getInput().type;
         //7.calculate and return percentage of each expense
         values = budgetCtrl.valPush(inputValue);
         //8.display percentage of each expense
         //8.1 return total income
         incomeTot = budgetCtrl.returnTotals().incomeTotal;
         UICtrl.displayIndPerc(values, incomeTot);
    };

    var deleteItem = function(ID, type){

        if (type ==="inc"){
            //1.delete from array //bc
            //2.subtract the value from the total //bc
            budgetCtrl.itemDelete(ID, type);

            //3.delete the element from the dom //ui //use display:none
            UICtrl.removelistItem(ID, type);
            //4.recalculate percentage.
            var incomeTot, inputValue, values;
            values = budgetCtrl.returnValues();
            incomeTot = budgetCtrl.returnTotals().incomeTotal;
            UICtrl.displayIndPerc(values, incomeTot);
            // //redisplay the total income in the UI
            // UICtrl.displayTotals("income", incomeTot);
            // //redisplay the budget
            updateBudget();
    
        }else if(type === "exp"){

            //1.delete from array //bc
            //2.subtract the value from the total //bc
            budgetCtrl.itemDelete(ID, type)

            //3.delete the value, according to index, from the values array
            budgetCtrl.valueDelete(ID);

            //4.delete the element from the dom //ui //use remove
            UICtrl.removelistItem(ID, type);
            updateBudget();
        }
        
    }


    return {
        init: function(){
            console.log("application has started");
            UICtrl.displayMonth();
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();

//1.push individual expense percentages into an array using forEach;
//2.display the entries in the array in the right html string...use the id's coz they are corresponding.

var test = [ {num:1}, {num:2}, {num:3}];

delete test[1]

//1. create a function constructor for the objects to be put in the values array***********
//2. push the new objects into the array.***********
//3. rewrite all other relevant functions.*****************
//4. in the delete function, use Array.prototype.splice on the values array instead of delete