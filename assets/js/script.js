var pantryModal = $('#pantryModal')
var cartModal = $('#cartModal')
var ingredientList = []

if (localStorage.getItem("pantryIngredients")) { //Check if there is any stored history to grab
    ingredientList = JSON.parse(localStorage.getItem("pantryIngredients"))
}

//console.log(queryStringifyIngredients())
var shoppingList = []
//var shoopingCounts = {}

if (localStorage.getItem("shoppingIngredients")) { //Check if there is any stored history to grab
    shoppingList = JSON.parse(localStorage.getItem("shoppingIngredients"))
}

/* Open and close pantry modal*/
$(document).on("click", "#pantry", function (event) {
    pantryModal.css("display", "block")
    displayPantryIngredietns()
});

/* Open and close pantry modal*/
$(document).on("click", "#cart", function (event) {
    cartModal.css("display", "block")
    displayShoppingIngredients()
});

$(document).on("click", ".close", function () {
    pantryModal.css("display", "none")
});

/* Button listners for increase/decrease ingredient quantiy and deleting ingredient */
$(document).on("click", ".increase-count-btn", function () {
    changeCount($(this).parent().siblings(".name").html(), "+")

})

$(document).on("click", ".decrease-count-btn", function () {
    changeCount($(this).parent().siblings(".name").html(), "-")
})

$(document).on("click", ".delete-ing-btn", function () {
    deleteItemInPantry($(this).parent().siblings(".name").html())
})
/*Get List of ingredients*/

$(document).on("click", "#addItemBtn", function (event) { //Add ingredient listener
    var itemVal = $(this).siblings("input").val()
    if (itemVal != "") { //Simple validation for if any input at all
        var itemCheckUrl = "https://api.edamam.com/auto-complete?app_id=fd3763f8&app_key=4577463150cadf088b2a86813ab799da&q=" + itemVal + "&limit=5"
        $.ajax({ //Semanitc validation. Call api to see if an ingredient exsists with the name of the input
            url: itemCheckUrl,
            method: "GET"
        })
            .then(function (response) {
                console.log(response)
                if (response.length > 0) { //Real items will return an array with at least 1 element
                    addPantryIngredient(response[0].charAt(0).toUpperCase() + response[0].slice(1))
                } else { //Fake items will return an empty array
                    fakeItemAlert() //Notify user that it is a fake ingredient
                }
            })
    }
})

function addPantryIngredient(item) { //Add input into pantry list
    if (includesIngredient(item)) {
        return
    } else {
        var ingObj = {} //Save input as ingredient object with attributes
        ingObj["name"] = item
        ingObj["count"] = 1
        ingredientList.push(ingObj) //Add object to larger ingredient list
        saveIngredientList()
        displayPantryIngredietns()
        console.log(item)
    }
}


function saveIngredientList() { //Helper function to store pantry items in local storage
    localStorage.setItem("pantryIngredients", JSON.stringify(ingredientList))
}

function includesIngredient(ingName) { //Helper function to avoid double adding ingredients to list if it is already there
    for (var i = 0; i < ingredientList.length; i++) {
        if (ingredientList[i].name == ingName) {
            return true
        }
    }
    return false
}

function displayPantryIngredietns() { //Dynamically display saved ingredients
    var ingCont = $(".ingredients-container")
    ingCont.empty() //Clear preivous display to freshly generate
    for (var i = 0; i < ingredientList.length; i++) {
        var ing = $("<tr>")
        var delBtnCont = $("<td>")
        var deleteBtn = $("<button>").text("del").addClass("button is-small is-danger delete-ing-btn")
        delBtnCont.append(deleteBtn)
        var name = $("<th>").text(ingredientList[i].name).addClass("name") //Add class name to make calling includesIngredient function easier from an event listener
        var iBtnCont = $("<td>")
        var incBtn = $("<button>").text("+").addClass("button is-small is-info is-light increase-count-btn")
        iBtnCont.append(incBtn)
        var ingCount = $("<td>").text(ingredientList[i].count)
        var dBtnCont = $("<td>")
        var decBtn = $("<button>").text("-").addClass("button is-small is-danger is-light decrease-count-btn")
        dBtnCont.append(decBtn)
        ing.append(delBtnCont, name, iBtnCont, ingCount, dBtnCont)
        ingCont.prepend(ing)
    }
}

function changeCount(name, direction) { //Dynamic function to change ingredient quantity based on wheter increase or decrease was clicked
    console.log(name, direction)
    if (direction == "+") {
        ingredientList[findObjectIndex(name)].count += 1
    } else if (ingredientList[findObjectIndex(name)].count > 1) {
        ingredientList[findObjectIndex(name)].count -= 1
    }
    saveIngredientList()
    displayPantryIngredietns()

}

function deleteItemInPantry(name) { //Delete specific ingredient based on delete button being clicked
    var i = findObjectIndex(name)
    if (i > -1) {
        ingredientList.splice(i, 1)
    }
    saveIngredientList()
    displayPantryIngredietns()
}

function findObjectIndex(name) { //Helper function to search for specific ingredient object in the ingredient array
    for (var i = 0; i < ingredientList.length; i++) {
        if (ingredientList[i].name == name) {
            console.log("Found " + name, " at index" + i)
            return i
        }
    }
    return -1
}

function fakeItemAlert() { //Notify user that input is not a real ingredient
    /*Add alert elements to modal*/
    var alertCont = $("<div>").addClass("fakeItem")
    var alrMsg = $("<h5>").text("Please input a real ingredient")
    alertCont.append(alrMsg)

    $(".modal-content").append(alertCont)

    var secondsLeft = 5 //Run the alert for 5 seconds
    var timerInterval = setInterval(function () {
        secondsLeft--
        console.log(secondsLeft)
        if (secondsLeft === 0) { //Auto close the alert after time runs out
            clearInterval(timerInterval)
            alertCont.remove()
        }
    }, 1000)
}

function queryStringifyIngredients() { //Convert ingredients in ingredient array as a passable string in spoonacular API call
    var rtn = ""
    for (var i = 0; i < ingredientList.length; i++) {
        if (i == 0) {
            rtn += ingredientList[i].name
        } else {
            rtn += ",+" + ingredientList[i].name
        }
    }
    return rtn
}

/* API ingredient check

https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=597241d5914540eb9a064d99f044c672&query=god&number=5

*/

//shopping modal 
var shoppingModal = $('#cartModal')

/* Open and close shopping modal*/
$(document).on("click", "#cart", function (event) {
    shoppingModal.css("display", "block")
});

$(document).on("click", ".close", function () {
    shoppingModal.css("display", "none")
});

/* Button listners for increase/decrease ingredient quantiy and deleting ingredient */
$(document).on("click", ".increase-sItm-btn", function () {
    changeSCount($(this).parent().siblings(".name").html(), "+")
})

$(document).on("click", ".decrease-sItm-btn", function () {
    changeSCount($(this).parent().siblings(".name").html(), "-")
})

$(document).on("click", ".delete-shpng-btn", function () {
    deleteItemInShopping($(this).parent().siblings(".name").html())
})




$(document).on("click", "#addCartBtn", function (event) {//Add ingredient listener
    var cartVal = $(this).siblings("input").val()
    if (cartVal != "") { //Simple validation for if any input at all
        var cartCheckUrl = "https://api.edamam.com/auto-complete?app_id=fd3763f8&app_key=4577463150cadf088b2a86813ab799da&q=" + cartVal + "&limit=5"
        $.ajax({ //Semantic validation. Call api to see if an ingredient exsists with the name of the input
            url: cartCheckUrl,
            method: "GET"
        })
            .then(function (response) {
                if (response.length > 0) { //Real items will return an array with at least 1 element
                    addShoppingList(response[0].charAt(0).toUpperCase() + response[0].slice(1))
                } else {
                    itemNotAValidInput() //Notify user that it is a fake ingredient
                }
            })

    }
})


function addShoppingList(item) { //Add input into pantry list
    if (includesItm(item)) {
        return
    } else {
        var itmObj = {} //Save input as ingredient object with attributes
        itmObj["name"] = item
        itmObj["count"] = 1
        shoppingList.push(itmObj) //Add object to larger shopping cart list
        saveShoppingList()
        displayShoppingIngredients()
        console.log(item)
    }
}

function saveShoppingList() { //Helper function to store shopping list items in local storage
    localStorage.setItem("shoppingIngredients", JSON.stringify(shoppingList))
}

function includesItm(itmName) { //Helper function to avoid double adding ingredients to list if it is already there
    for (var i = 0; i < shoppingList.length; i++) {
        if (shoppingList[i].name == itmName) {
            console.log(shoppingList[i].name, itmName)
            return true
        }
    }
    return false
}

function displayShoppingIngredients() { //Dynamically display saved ingredients
    var sCont = $(".shopping-container")
    sCont.empty() //Clear preivous display to freshly generate
    for (var i = 0; i < shoppingList.length; i++) {
        console.log("reached display", shoppingList[i].name)
        var ing = $("<tr>")
        var delBtnCont = $("<td>")
        var deleteBtn = $("<button>").text("del").addClass("button is-small is-danger delete-shpng-btn")
        delBtnCont.append(deleteBtn)
        var name = $("<th>").text(shoppingList[i].name).addClass("name") //Add class name to make calling includesIngredient function easier from an event listener
        var iBtnCont = $("<td>")
        var incBtn = $("<button>").text("+").addClass("button is-small is-info is-light increase-sItm-btn")
        iBtnCont.append(incBtn)
        var ingCount = $("<td>").text(shoppingList[i].count)
        var dBtnCont = $("<td>")
        var decBtn = $("<button>").text("-").addClass("button is-small is-danger is-light decrease-sItm-btn")
        dBtnCont.append(decBtn)
        ing.append(delBtnCont, name, iBtnCont, ingCount, dBtnCont)
        sCont.prepend(ing)
    }
}

function changeSCount(name, direction) { //Dynamic function to change ingredient quantity based on wheter increase or decrease was clicked
    if (direction == "+") {
        shoppingList[findItmObjectIndex(name)].count += 1
    } else if (shoppingList[findItmObjectIndex(name)].count > 1) {
        shoppingList[findItmObjectIndex(name)].count -= 1
    }
    saveShoppingList()
    displayShoppingIngredients()
}


function deleteItemInShopping(name) { //Delete specific ingredient based on delete button being clicked
    var i = findItmObjectIndex(name)
    console.log(name)
    console.log(i)
    if (i > -1) {
        shoppingList.splice(i, 1)
    }
    saveShoppingList()
    displayShoppingIngredients()
}

//Helper function to find index of ingredient object in shopping list array
function findItmObjectIndex(name) {
    for (var i = 0; i < shoppingList.length; i++) {
        if (shoppingList[i].name == name) {
            console.log("Found " + name, " at index" + i)
            return i
        }
    }
    return -1
}

//Notify users that input isn't valid via a message block
function itemNotAValidInput() {
    var alertCont = $("<div>").addClass("fakeItem")
    var alertMessage = $("<h5>").text("Please input a real ingredient")
    alertCont.append(alertMessage)

    $(".shoppingModalContent").append(alertCont)

    var secondsLeftCart = 5
    var timerInterval = setInterval(function () {
        secondsLeftCart--
        console.log(secondsLeftCart)
        if (secondsLeftCart === 0) {
            clearInterval(timerInterval)
            alertCont.remove()
        }
    }, 1000)
}



//generate recipes section

var recipesBtn = $('#generateRecipes')

var displayCards = $('#displaycardshere')

var photo = $('#photo')




//created an event listener for the generate recipes btn
$(document).on("click", "#generateRecipes", function (event) {
    pantryModal.css("display", "none")
    photo.css("display", "none")

// this empties the card container for the user when they generate new recipes 
    cardContanier.empty()

    var ingredientParse = queryStringifyIngredients()
// the api call takes in the variable above so that it can generate recipes when the ingredients choosen
    var makeRecipes = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=c8ae3021308e4c6fa278becfa56df80b&ingredients=" + ingredientParse + "&number=9&ranking=2"
    $.ajax({
        url: makeRecipes,
        method: "GET"

    })
        .then(function (response) {

            console.log(response)


// call on generate recipes card function 
            generateRecipeCards(response)

        })

});



var cardContanier = $("#cardscontainer")


// this function creates html elements that is attached to a specific data request 
function generateRecipeCards(data) {

// this for loop displays the data for all the recipes retrieved
    for (var i = 0; i < data.length; i++) {


        var cards = $("<div>").addClass("card card-shadow-is-1em p-5");
        cards.css('background-color', '#aae39c');

        var title = $("<h3>").text(data[i].title).addClass("box has-text-centered has-text-weight-bold");
        var img = $("<img>").attr("src", data[i].image).addClass("image is-fullwidth mb-3 card-image is-clickable");

        img.attr("data-id", data[i].id)
        var missing = $("<h2>").text("Ingredients needed: ")
// additonally there is two nested for loops, in order to be able to retrieve the total length of the missing and used ingredients  
        for (var j = 0; j < data[i].missedIngredients.length; j++) {
            missing.append($("<h2>").text(data[i].missedIngredients[j].name)).addClass("has-text-centered");

        }
        var used = $("<h2>").text("Ingredients used from pantry: ")

        for (var k = 0; k < data[i].usedIngredients.length; k++) {
            used.append($("<h2>").text(data[i].usedIngredients[k].name)).addClass(" has-text-centered");
        }


// displays cards onto page 
        cards.append(title, img, missing, used);
        cardContanier.append(cards);

    }
}


// working on api call to link the websites below 

// created an event listener that is attached to the image
// so that when the user clicks on the image they are taken to the actual recipe page
$(document).on("click", ".card-image", function (event) {
    var id = $(this).attr("data-id")
    getRecipeUrl(id)
})
// this function makes the api call and passes the recipe ID through it
function getRecipeUrl(id) {

    var getUrlLink = "https://api.spoonacular.com/recipes/" + id + "/information?apiKey=c8ae3021308e4c6fa278becfa56df80b"

    $.ajax({
        url: getUrlLink,
        method: "GET"

    })
        .then(function (response) {

// opens the url into a new browser
            window.open(response.sourceUrl)

            console.log(response)

           
        })
}

