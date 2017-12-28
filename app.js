//Implementing stand-alone modules

//Budget Controller
var budgetController = (function() {
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }; 
    
    var calculateTotal = function(type){
      var sum = 0;
      Data.allItems[type].forEach(function(current){  //Parameter: Current index
          sum = sum + current.value;   
      });     
      
      Data.totals[type] = sum;

    };
    
    var Data = {
        allItems: {
          exp: [],
          inc: [],    
        },
        
        totals: {
            exp: 0,
            inc: 0
        },
        
        budget: 0,
        percentage: -1
    };
    
    return {
        addItem: function(type, des, val){
            var ID, newItem;
            
            //Id of new item should equal to the value of the last ID in the array added by 1
            
            //Create new ID
            if(Data.allItems[type].length > 0){
                ID = Data.allItems[type][Data.allItems[type].length - 1].id + 1;                
            } else {
                ID = 0;
            }
        
           
            //Create new item based off type: 'inc' or 'exp'
            if (type === 'exp'){
                newItem =  new Expense(ID, des, val);
            }  else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            }
      
            //Push to data structure and return new Item
            Data.allItems[type].push(newItem);
            return newItem;
        
        },
        
        deleteItem: function(type, id){
            var index, ids;
            
           //Function has access to current element, current index and entire array
           ids = Data.allItems[type].map(function(current){
               return current.id;
           });
            
           index = ids.indexOf(id);
            
           if(index !== -1){
               Data.allItems[type].splice(index, 1,);
           }
            
        },
        
        
        
        calculateBudget: function(){
          
            //1.Calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');
            
            //2.Calculate budget (Income - Expenses)
            Data.budget = Data.totals.inc - Data.totals.exp;
            
            //3.Calculate percentage of income spent (Expenses / Income)
            if(Data.totals.inc > 0){
                Data.percentage = Math.round((Data.totals.exp / Data.totals.inc) * 100);
            } else {
                Data.percentage = -1;
            }
                  
        },
        
        getBudget: function() {
            return {
                budget: Data.budget,
                totalIncome: Data.totals.inc,
                totalExpenses: Data.totals.exp,
                percentage: Data.percentage
            };    
        },
        
        testing: function() {
            console.log(Data);
        }
    
    };
    
})();


// User Interface Controller
var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',   
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percantageLabel: '.budget__expenses--percentage',
        container: '.container'
    };
    
    
    return {
      getInput: function(){
          return {
              type: document.querySelector(DOMstrings.inputType).value, //Either Income or Expense
              description: document.querySelector(DOMstrings.inputDescription).value,
              value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
          };    
       },      
    
      addListItem: function(obj, type){
          var html, newHtml, element;
          
          //Create HTML string with placeholder text
           
          if(type === 'inc'){
               element = DOMstrings.incomeContainer;
               html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                   
          } else if(type === 'exp'){
               element = DOMstrings.expenseContainer;
               html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'; 
          }
        
          //Replace placeholder text with real data
          newHtml = html.replace('%id%', obj.id);
          newHtml = newHtml.replace('%description%', obj.description);
          newHtml = newHtml.replace('%value%', obj.value);

          //Insert HTML into DOM (Will be inserted as last child of container - 'beforeend')
          document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
      },  
        

      deleteListItem: function(selectorID){
          
          var element = document.getElementById(selectorID);
          element.parentNode.removeChild(element);
      
      },          
        
    
        
      clearFields: function() {
            var fields, fieldsArray;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            //Convert non-live NodeList to Array
            fieldsArray = Array.prototype.slice.call(fields);
            
            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            });
            
            //Sets focus on "Add Desciption" field so user can continue to add items
            fieldsArray[0].focus();
        },   
        
      displayBudget: function(obj){
        
        
          document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
          document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalIncome;
          document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExpenses;
            
          if(obj.percentage > 0){
              document.querySelector(DOMstrings.percantageLabel).textContent = obj.percentage + '%';    
          } else {
              document.querySelector(DOMstrings.percantageLabel).textContent = '-/-';     
          }
          
      },    
          
      getDOMstrings: function(){
          return DOMstrings;
      }  
    };

})();



//Synchronizing Budget and UI controllers

//Global App Controller
var AppController = (function(budgetControl, UIControl) {
    
    var setUpEventListeners = function(){
        
        var DOM = UIControl.getDOMstrings();
    
        //Add button event listener
        document.querySelector(DOM.inputButton).addEventListener('click', controlAddItem);

        //"Enter" button event listener
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                controlAddItem();
            }
        }); 
        
        document.querySelector(DOM.container).addEventListener('click', controlDeleteItem);
        
    };
   
    var updateBudget = function(){
        var Budget;    
        
        //1. Calculate budget
        budgetControl.calculateBudget();
    
        //2. Return budget
        Budget = budgetControl.getBudget();        
        
        //3. Display budget on the UI
        UIControl.displayBudget(Budget);
    }
    
    var controlAddItem = function(){
        console.log("Button was clicked.");
        var newItem, input;
        
        //1. Get user inputted data
        input = UIControl.getInput();
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
       
            //2. Add item/data to budget controller
            newItem = budgetControl.addItem(input.type, input.description, input.value);
    
            //3. Add item/data to UI
            UIControl.addListItem(newItem, input.type);
        
            //4. Clear the fields
            UIControl.clearFields();        
         
            //5. Calculate and update budget
            updateBudget();
        }
    };
    
    var controlDeleteItem = function(event){
        var itemID, split, type, ID;
        
        //DOM traversing; deleting entire section rather than exlusively removing the "X" button that triggers the event 
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID){
            
            // Example: "inc-1"
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            //Delete item from data structure
            budgetControl.deleteItem(type, ID);
            
            //Delete item from UI
            UIControl.deleteListItem(itemID);
            
            //Update UI with new budget
            updateBudget();
            
        }
    };
    
    return {
        init: function(){
            console.log('Application has started');
            UIControl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1
            });
            
            setUpEventListeners();
        }
    }
    
})(budgetController, UIController);

AppController.init();