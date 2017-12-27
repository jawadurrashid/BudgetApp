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
    
    var Data = {
        allItems: {
          exp: [],
          inc: [],    
        },
        
        totals: {
            exp: 0,
            inc: 0
        }
    }
    
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
            }  else if (type = 'inc'){
                newItem = new Income(ID, des, val);
            }
      
            //Push to data structure and return new Item
            Data.allItems[type].push(newItem);
            return newItem;
        
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
        expenseContainer: '.expenses__list'
    };
    
    
    return {
      getInput: function(){
          return {
              type: document.querySelector(DOMstrings.inputType).value, //Either Income or Expense
              description: document.querySelector(DOMstrings.inputDescription).value,
              value: document.querySelector(DOMstrings.inputValue).value
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
    };
   
    var controlAddItem = function(){
        console.log("It was clicked.");
        var newItem, input;
        
        //1. Get user inputted data
        input = UIControl.getInput();
    
        //2. Add item/data to budget controller
        newItem = budgetControl.addItem(input.type, input.description, input.value);
    
        //3. Add item/data to UI
        UIControl.addListItem(newItem, input.type);
        
        //4. Clear the fields
        UIControl.clearFields();    
    
        //5. Calculate budget
    
        //6. Display budget on the UI
        
    };
    
    return {
        init: function(){
            console.log('Application has started');
            setUpEventListeners();
        }
    }
    
})(budgetController, UIController);

AppController.init();