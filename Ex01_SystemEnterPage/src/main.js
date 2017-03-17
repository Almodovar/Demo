// window.$ = window.jQuery = require('jquery');
// var bootstrap = require('bootstrap');

// var container = document.getElementById("container");
// var width = container.offsetWidth;
// var height = container.offsetHeight;
// container.style["margin-top"] = (window.innerHeight - height)/2;
// container.style["margin-left"] = (window.innerWidth-width)/2;

var navBar = document.getElementById("navBar");
var container = document.getElementById("container");
var imgWrapper = document.getElementById("wrapper");
var leftButton = document.body.getElementsByTagName("button")[0];
var rightButton = document.body.getElementsByTagName("button")[2];
var startButton = document.body.getElementsByTagName("button")[1];
// var itemThree = document.getElementById("itemThree");
var requestID;
var currentTime = 0;
var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
var cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
var initLeftPos = imgWrapper.offsetLeft;
var onPosition = false;

function resize() {
    var height = window.innerHeight;
    var width = window.innerWidth;
    navBar.style.top = height * 0.07 + "px";
    navBar.style.height = height * 0.05 + "px";
    navBar.style.width = width + "px";
    container.style.width = width * 0.8 + "px";
    container.style.height = height * 0.45 + "px";
    container.style.marginTop = height * 0.23 + "px";
    container.style.marginLeft = width * 0.1 + "px";
    imgWrapper.style.width = width * 1.6 + "px";
    imgWrapper.style.height = height * 0.4 + "px";
    imgWrapper.style.top = 0 + "px";
    imgWrapper.style.left = width * -0.4 + "px";
    initLeftPos = imgWrapper.offsetLeft;
    // itemThree.style.width = width * 0.8 + "px";
    // itemThree.style.left = width * 0.4 + "px";

    currentTime = 0;

    startButton.style.left = width / 2 - 30 + "px";
    if (onPosition === true) {
        leftButton.style.left = width / 2 - width * 0.2 - width * 0.07 + "px";
        rightButton.style.left = width / 2 + width * 0.2 - width * 0.07 + "px";
    }



}

resize();

window.addEventListener("resize", function () {
    resize();
});

startButton.addEventListener("mouseover", showLRButton);
startButton.addEventListener("mouseleave", hideStartButton);


var transforms = ["transform", "msTransform", "mozTransform", "webkitTransform", "oTransform"];
var transformProperty = getSupportedPropertyName(transforms);

function getSupportedPropertyName(properties) {
    for (var i = 0; i < properties.length; i++) {
        if (typeof document.body.style[properties[i]] != "undefined") {
            return properties[i];
        }
    }
    return null;
}

function showLRButton() {
    onPosition = true;
    leftButton.style[transformProperty] = "scale(1,1)";
    rightButton.style[transformProperty] = "scale(1,1)";

    leftButton.style.left = window.innerWidth / 2 - window.innerWidth * 0.2 - window.innerWidth * 0.07 + "px";
    rightButton.style.left = window.innerWidth / 2 + window.innerWidth * 0.2 - window.innerWidth * 0.07 + "px";

    // slideUp();
}

// var value = 1;
// function slideUp() {
//     if (value >0) {
//         value -=0.005;
//         itemThree.style.opacity = value;
//     }
//     requestAnimationFrame(slideUp);
// }

function hideStartButton() {
    startButton.style[transformProperty] = "scale(0,0)";
    startButton.style.opacity = 0;
}


leftButton.addEventListener("mouseover", animateToRight);
leftButton.addEventListener("mouseleave", reset);
rightButton.addEventListener("mouseover", animateToLeft);
rightButton.addEventListener("mouseleave", reset);

function animateToRight() {
    if (currentTime <= 120) {
        currentTime += 1;
        var increment = easeOut(currentTime, initLeftPos, -initLeftPos, 120);
        // leftPos += increment;
        imgWrapper.style.left = increment + "px";
    }
    requestID = requestAnimationFrame(animateToRight);
    rightButton.style.opacity = 0.2;

}

function animateToLeft() {
    if (currentTime <= 120) {
        currentTime += 1;
        var increment = easeOut(currentTime, initLeftPos, initLeftPos, 120);
        // leftPos += increment;
        imgWrapper.style.left = increment + "px";
    }
    requestID = requestAnimationFrame(animateToLeft);
    leftButton.style.opacity = 0.2;
}

function reset() {
    cancelAnimationFrame(requestID);
    imgWrapper.style.left = initLeftPos + "px";
    currentTime = 0;
    rightButton.style.opacity = 1;
    leftButton.style.opacity = 1;
}

function easeOut(currentTime, startValue, changeInValue, duration) {
    currentTime /= duration;
    return -changeInValue * currentTime * (currentTime - 2) + startValue;
}