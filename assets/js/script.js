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
                console.log(response)
            })
    }
})

/* API ingredient check

https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=597241d5914540eb9a064d99f044c672&query=god&number=5

*/