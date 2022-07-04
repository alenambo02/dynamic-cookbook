var pantryModal = $('#pantryModal')

/* Open and close pantry modal*/
$(document).on("click", "#pantry", function (event) {
    pantryModal.css("display", "block")
});

$(document).on("click", ".close", function () {
    pantryModal.css("display", "none")
});

