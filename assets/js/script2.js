
// var granimInstance = new Granim({
//     element: '#granim',
//     name: 'granimFirst',
//     elToSetClassOn: ".wrapper",
//     direction: 'top-bottom',
//     isPausedWhenNotInView: true,
//     image: {
//         source: './images/3.png',
//         stretchMode: ["stretch-if-smaller", "stretch-if-smaller"],

//         blendingMode: 'multiply',
//     },
//     states: {
//         "default-state": {
//             gradients: [
//                 ['#29323c', '#485563'],
//                 ['#FF6B6B', '#556270'],
//                 ['#80d3fe', '#7ea0c4'],
//                 ['#f0ab51', '#eceba3']
//             ],
//             transitionSpeed: 7000
//         }
//     }
// });


$(".clickMe").on("click", function () {
    window.location = "./index.html"
});

var granimInstance = new Granim({
    element: '#granim',
    direction: 'top-bottom',
  
    isPausedWhenNotInView: true,
    image: {
        source: './images/5.png',
        stretchMode: ["stretch-if-smaller", "stretch-if-smaller"],
        blendingMode: 'multiply'
    },
    states: {
        "default-state": {
            gradients: [
                ['#29323c', '#485563'],
                ['#FF6B6B', '#556270'],
                ['#80d3fe', '#7ea0c4'],
                ['#f0ab51', '#eceba3']
            ],
            transitionSpeed: 7000
        }
    }
 });
 