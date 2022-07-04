var pantryModal = $('#pantryModal')

/* Open and close pantry modal*/
$(document).on("click", "#pantry", function (event) {
    pantryModal.css("display", "block")
});

$(document).on("click", ".close", function () {
    pantryModal.css("display", "none")
});

/*Get List of ingredients*/



/* API ingredient check

https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=597241d5914540eb9a064d99f044c672&query=god&number=5

*/