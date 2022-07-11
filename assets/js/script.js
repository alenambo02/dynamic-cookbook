var pantryModal = $('#pantryModal')
var ingredientList = []

if(localStorage.getItem("pantryIngredients")){ //Check if there is any stored history to grab
    ingredientList = JSON.parse(localStorage.getItem("pantryIngredients"))
}

//console.log(queryStringifyIngredients())

var ingredientCounts = {}
var shoopingList = []
var shoopingCounts = {}

/* Open and close pantry modal*/
$(document).on("click", "#pantry", function (event) {
    pantryModal.css("display", "block")
    displayPantryIngredietns()
});

$(document).on("click", ".close", function () {
    pantryModal.css("display", "none")
});

$(document).on("click", ".increase-count-btn", function(){
    changeCount($(this).parent().siblings(".name").html() ,"+")
    
})

$(document).on("click", ".decrease-count-btn", function(){
    changeCount($(this).parent().siblings(".name").html() ,"-")
})

$(document).on("click", ".delete-ing-btn", function(){
    deleteItemInPantry($(this).parent().siblings(".name").html())
})
/*Get List of ingredients*/

$(document).on("click", "#addItemBtn", function (event) { //Add ingredient listener
    var itemVal = $(this).siblings("input").val()
    if (itemVal != "") { //Simple validation for if any input at all
        var itemCheckUrl = "https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=597241d5914540eb9a064d99f044c672&query=" + itemVal
        $.ajax({ //Fetch validation. Call api to see if an ingredient exsists with the name of the input
            url: itemCheckUrl,
            method: "GET"
        })
            .then(function (response) {
                if (response.length > 0) { //Real items will return an array with at least 1 element
                    //console.log("real ingredient")
                    addPantryIngredient(response[0].name.charAt(0).toUpperCase() + response[0].name.slice(1))
                } else { //Fake items will return an empty array
                    fakeItemAlert() //Notify user that it is a fake ingredient
                }
            })
    }
})


function addPantryIngredient(item){ //Add input into pantry list
    if(includesIngredient(item)){
        return
    } else {
        var ingObj = {}
        ingObj["name"] = item
        ingObj["count"] = 1
        ingredientList.push(ingObj)
        //ingredientCounts[item] = 1
        //console.log(ingredientCounts)
        //localStorage.setItem("pantryIngredientsCount", JSON.stringify(ingredientCounts))
        saveIngredientList()
        displayPantryIngredietns()
        console.log(item)
    }
}


function saveIngredientList(){
    localStorage.setItem("pantryIngredients", JSON.stringify(ingredientList))
}

function includesIngredient(ingName){
    for(var i = 0; i < ingredientList.length; i++){
        if(ingredientList[i].name == ingName){
            return true
        }
    }
    return false
}

function displayPantryIngredietns(){
    var ingCont = $(".ingredients-container")
    ingCont.empty() 
    for(var i = 0; i < ingredientList.length; i++){
        var ing = $("<tr>")
        var delBtnCont = $("<td>")
        var deleteBtn = $("<button>").text("del").addClass("button is-small is-danger delete-ing-btn")
        delBtnCont.append(deleteBtn)
        var name = $("<th>").text(ingredientList[i].name).addClass("name")
        var iBtnCont = $("<td>")
        var incBtn = $("<button>").text("+").addClass("button is-small is-info is-light increase-count-btn")
        iBtnCont.append(incBtn)
        //console.log(ingredientList[i])
        //console.log(ingredientCounts.ingredientList[i])
        var ingCount = $("<td>").text(ingredientList[i].count)
        var dBtnCont = $("<td>")
        var decBtn = $("<button>").text("-").addClass("button is-small is-danger is-light decrease-count-btn")
        dBtnCont.append(decBtn)
        ing.append(delBtnCont,name,iBtnCont,ingCount,dBtnCont)
        ingCont.prepend(ing)
    }
}

function changeCount(name, direction){
    console.log(name, direction)
    if(direction == "+"){
        ingredientList[findObjectIndex(name)].count += 1
    } else if(ingredientList[findObjectIndex(name)].count > 1){
        ingredientList[findObjectIndex(name)].count -= 1
    }
    saveIngredientList()
    displayPantryIngredietns()
    
}

function deleteItemInPantry(name){
    var i = findObjectIndex(name)
    if(i > -1){
        ingredientList.splice(i,1)
    }
    saveIngredientList()
    displayPantryIngredietns()
}

function findObjectIndex(name){
    for(var i = 0; i < ingredientList.length; i++){
        if(ingredientList[i].name == name){
            console.log("Found " + name, " at index" + i)
            return i
        }
    }
    return -1
}

function fakeItemAlert() { //Notify user that input is not a real ingredient
    /*Add alert elements to modal*/
    var alertCont = $("<div>").addClass("callout small alert")
    var alrMsg = $("<h5>").text("Please input a real ingredient")
    alertCont.append(alrMsg)
    pantryModal.append(alertCont)

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

function queryStringifyIngredients() {
    var rtn = ""
    for(var i = 0; i < ingredientList.length; i++){
        if(i==0){
            rtn+= ingredientList[i].name
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

$(document).on("click", "#addCartBtn", function (event) {
    var cartVal = $(this).siblings("input").val()
    if (cartVal != "") {
        var cartCheckUrl = "https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=597241d5914540eb9a064d99f044c672&query=" + cartVal
        $.ajax({
            url: cartCheckUrl,
            method: "GET"
        })
            .then(function (response) {
                if (response.length > 0) {
                    addShoopingList(cartVal)
                } else {
                    itemNotAValidInput()
                }
            })

    }
})

function addShoopingList(item) {
    var listCont = $(".shopping-container")
    var list = $("<li>").text(item)
    listCont.prepend(list)
}

function addShoopingList(item) { //Add input into pantry list
    if (shoopingList.includes(item)) {
        return
    } else {
        shoopingList.push(item)
        shoopingCounts[item] = 1
        console.log(shoopingCounts)
        localStorage.setItem("shoppingListCount", JSON.stringify(shoopingCounts))
        localStorage.setItem("shoopingIngredients", JSON.stringify(shoopingList))
        displayShoopingIngredietns()
        console.log(item)
    }
}

function displayShoopingIngredietns() {
    var shpngCont = $(".shopping-container")
    shpngCont.empty()

    for (var i = 0; i < shoopingList.length; i++) {
        // debugger
        var shopng = $("<div>").addClass("is-flex-direction-row")
        var name = $("<h5>").text(shoopingList[i])
        var incBtn = $("<button>").text("+").addClass("increase-count-btn").attr('id', 'addBtn')

        //console.log(ingredientList[i])
        //console.log(ingredientCounts.ingredientList[i])
        var ingCount = $("<h5>").text(shoopingCounts[shoopingList[i]])
        var decBtn = $("<button>").text("-").addClass("decrease-count-btn")
        shopng.append(name, incBtn, ingCount, decBtn)
        shpngCont.prepend(shopng)
    }
}

$(document).on("click", "#cart", function (event) {
    cartModal.css("display", "block")
    displayShoopingIngredietns()
});

$(document).on("click", "#addBtn", function (event) {
    console.log("imhere")
    // pantryModal.css("display", "block")
    // displayPantryIngredietns()
});

function itemNotAValidInput() {
    var alertCont = $("<div>").addClass("callout small alert")
    var alertMessage = $("<h5>").text("Please input a real ingredient")
    alertCont.append(alertMessage)
    shoppingModal.append(alertCont)

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




//generate recipes btn
$(document).on("click", "#generateRecipes", function (event) {
    cardContanier.empty()
    var ingredientParse = queryStringifyIngredients()

    var makeRecipes = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=c8ae3021308e4c6fa278becfa56df80b&ingredients=" + ingredientParse + "&number=9&ranking=2"
    $.ajax({
        url: makeRecipes,
        method: "GET"

    })
        .then(function (response) {

            console.log(response)

            
           
        generateRecipeCards(response)
  

        })

});



var cardContanier = $("#cardscontainer")



function generateRecipeCards(data) {


    for (var i = 0; i < data.length; i++) {

        
        var cards = $("<div>").addClass("card card-shadow-is-1em p-5");
        cards.css('background-color', '#aae39c');
        var title = $("<h3>").text(data[i].title).addClass("box has-text-centered has-text-weight-bold");
        var img = $("<img>").attr("src", data[i].image).addClass("image is-fullwidth mb-3 card-image is-clickable"); 
        img.attr("data-id", data[i].id)
        var missing = $("<h2>").text("Ingredients needed: ")

        for (var j = 0; j < data[i].missedIngredients.length; j ++) {
              missing.append($("<h2>").text(data[i].missedIngredients[j].name)).addClass("has-text-centered");
            
        }
        var used = $("<h2>").text( "Ingredients used from pantry: ")

        for (var k = 0; k < data[i].usedIngredients.length; k ++) {   
            used.append($("<h2>").text(data[i].usedIngredients[k].name)).addClass(" has-text-centered");
        }
        
        
        
        cards.append(title, img, missing, used);
        cardContanier.append(cards);

    }
}


// working on api call for link to websites below 

$(document).on("click", ".card-image", function (event) {
    var id = $(this).attr("data-id")
    getRecipeUrl(id)
})

function getRecipeUrl(id) {

var getUrlLink = "https://api.spoonacular.com/recipes/" + id + "/information?apiKey=c8ae3021308e4c6fa278becfa56df80b"

$.ajax({
    url: getUrlLink,
    method: "GET"

})
    .then(function(response) {
       

        window.open(response.sourceUrl)
        
        console.log(response)
        
        // if (!response.length) {
        //     console.log('No results found!');
    

    })
    
}




// function generateMissUsed (data) {
// for (var j = 0; j < data.length; j ++) {
//     var missing = $("<h2>").text("Ingredients needed: "  + data[j].missedIngredients[j].name);
//     var used = $("<h2>").text("Ingredients used from pantry: " + data[j].usedIngredients[j].name);
//     }
// }
// console.log(generateMissUsed(data));


// var pageHeader = $("<h2>").text("Recepies Below: ").addClass("container")
//     // var containerContent

