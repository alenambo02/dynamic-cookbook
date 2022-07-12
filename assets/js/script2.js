

$(".clickMe").on("click", function () {
    window.location = "./index.html"
});

var granimInstance = new Granim({
    element: '#granim',
    direction: 'top-bottom',

    isPausedWhenNotInView: true,
    image: {
        source: './assets/images/food.jpeg',
        position: ['center', 'center'],
        stretchMode: ["stretch-if-smaller", "stretch-if-smaller"],
        blendingMode: 'multiply'
    },
    states: {
        "default-state": {
            gradients: [
                ['#CECECE', '#F2E6DA'],
                // ['#ADD100', '#7B920A'],
                ['#1A2980', '#26D0CE']
            ],
            transitionSpeed: 7000
        }
    }
});
