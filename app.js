//Implementing stand-alone modules

//Budget Controller
var budgetController = (function() {
    
    
})();

// User Interface Controller
var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    };
    
    
    return {
      getInput: function(){
          return {
              type: document.querySelector(DOMstrings.inputType).value, //Either Income or Expense
              description: document.querySelector(DOMstrings.inputDescription).value,
              value: document.querySelector(DOMstrings.inputValue).value
          };    
       },      
    
        getDOMstrings: function(){
            return DOMstrings;
        }  
    };

})();



//Synchronizing Budget and UI controllers

//Global App Controller
var AppController = (function(budgetControl, UIControl) {

   
    var DOM = UIControl.getDOMstrings();
   
    var controlAddItem = function(){
        console.log("It was clicked.")
        
    //1. Get user inputted data
    var input = UIControl.getInput();
    console.log(input);    
    
    //2. Add item/data to budget controller
    
    //3. Add item/data to UI
    
    //4. Calculate budget
    
    //5. Display budget on the UI
        
    }
    
    //Add button event listener
    document.querySelector(DOM.inputButton).addEventListener('click', controlAddItem);

    //"Enter" button event listener
    document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13){
            controlAddItem();
        }
    });
    
})(budgetController, UIController);