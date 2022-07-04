var pantryModal = $('#pantryModal')

/* Open and close pantry modal*/
$(document).on("click", "#pantry", function (event) {
    pantryModal.css("display", "block")
});

$(document).on("click", ".close", function () {
    pantryModal.css("display", "none")
});

/*Get List of ingredients*/

$(document).on("click", "#addItemBtn", function(event){ //Add ingredient listener
    var itemVal = $(this).siblings("input").val()
    if(itemVal != ""){ //Simple validation for if any input at all
        var itemCheckUrl = "https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=597241d5914540eb9a064d99f044c672&query=" + itemVal
        $.ajax({ //Fetch validation. Call api to see if an ingredient exsists with the name of the input
            url: itemCheckUrl,
            method: "GET"
        })
            .then(function(response){
                if(response.length > 0){ //Real items will return an array with at least 1 element
                    //console.log("real ingredient")
                    addPantryIngredient(itemVal)
                } else { //Fake items will return an empty array
                    fakeItemAlert() //Notify user that it is a fake ingredient
                }
            })
    }
})

function addPantryIngredient(item){ //Add input into pantry list
    var ingCont = $(".ingredients-container")
    var ing = $("<li>").text(item)
    ingCont.prepend(ing)
}

function fakeItemAlert(){ //Notify user that input is not a real ingredient
    /*Add alert elements to modal*/
    var alertCont = $("<div>").addClass("callout small alert")
    var alrMsg = $("<h5>").text("Please input a real ingredient")
    alertCont.append(alrMsg)
    pantryModal.append(alertCont)

    var secondsLeft = 5 //Run the alert for 5 seconds
    var timerInterval = setInterval(function() { 
        secondsLeft--
        console.log(secondsLeft)
        if(secondsLeft === 0){ //Auto close the alert after time runs out
            clearInterval(timerInterval)
            alertCont.remove()
        }
    }, 1000)
}

/* API ingredient check

https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=597241d5914540eb9a064d99f044c672&query=god&number=5

*/



//shopping modal 
var shoppingModal = $('#cartModal')

/* Open and close pantry modal*/
$(document).on("click", "#cart", function (event) {
    shoppingModal.css("display", "block")
});

$(document).on("click", ".close", function () {
    shoppingModal.css("display", "none")
});
