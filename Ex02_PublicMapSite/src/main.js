// Calculate Position

window.$ = window.jQuery = require('jquery');
var bootstrap = require('bootstrap');

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

var activePage = "home";

var wrapper = document.getElementById("wrapper");
var content = document.getElementById("content");

var leftDiv = document.getElementById("leftDiv");
var midDiv = document.getElementById("midDiv");
var rightDiv = document.getElementById("rightDiv");
var btmDiv = document.getElementById("btmDiv");

// var selectDiv = document.getElementById("selectDiv");

document.getElementById("btnPublicMap").addEventListener("click", scrollToRight);
document.getElementById("btnEducation").addEventListener("click", scrollToBtm);
document.getElementById("btnViewHistory").addEventListener("click", scrollToLeft);

var backBtn = document.body.getElementsByClassName("backHome");

for (var i = 0; i < backBtn.length; i++) {
    backBtn[i].addEventListener("click", scrollToHome);
}

var resize = function () {
    var width = window.innerWidth;
    var height = window.innerHeight;

    wrapper.style.width = width + "px";
    wrapper.style.height = height + "px";

    content.style.width = width * 3 + "px";
    content.style.height = height * 2 + "px";

    if (activePage == "home") {
        content.style.left = 0 + "px";
        content.style.top = 0 + "px";
    }
    if (activePage == "left") {
        content.style.left = width + "px";
        content.style.top = 0 + "px";
    }
    if (activePage == "btn") {
        content.style.left = 0 + "px";
        content.style.top = -height + "px";
    }
    if (activePage == "right") {
        content.style.left = -width + "px";
        content.style.top = 0 + "px";
    }

    leftDiv.style.left = width * -1 + "px";
    leftDiv.style.top = 0 + "px";
    leftDiv.style.width = width + "px";
    leftDiv.style.height = height + "px";

    midDiv.style.left = 0 + "px";
    midDiv.style.top = 0 + "px";
    midDiv.style.width = width + "px";
    midDiv.style.height = height + "px";

    rightDiv.style.left = width + "px";
    rightDiv.style.top = 0 + "px";
    rightDiv.style.width = width + "px";
    rightDiv.style.height = height + "px";

    btmDiv.style.left = 0 + "px";
    btmDiv.style.top = height + "px";
    btmDiv.style.width = width + "px";
    btmDiv.style.height = height + "px";
};

resize();

window.addEventListener("resize", function () {
    resize();

});

//******* 
// midDiv

var currentTime = 0;
var requestID;

var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
var cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;


function scrollToLeft() {
    activePage = "right";

    if (currentTime <= 120) {
        currentTime += 1;
        var increment = easeOut(currentTime, 0, -window.innerWidth, 120);
        // leftPos += increment;
        content.style.left = increment + "px";
    }
    requestID = requestAnimationFrame(scrollToLeft);
    // content.style.left = window.innerWidth * -1 + "px";
}

function scrollToRight() {
    activePage = "left";
    if (currentTime <= 120) {
        currentTime += 1;
        var increment = easeOut(currentTime, 0, window.innerWidth, 120);
        // leftPos += increment;
        content.style.left = increment + "px";
    }
    requestID = requestAnimationFrame(scrollToRight);

    // content.style.left = window.innerWidth + "px";
}

function scrollToBtm() {
    activePage = "btm";
    if (currentTime <= 120) {
        currentTime += 1;
        var increment = easeOut(currentTime, 0, -window.innerHeight, 120);
        // leftPos += increment;
        content.style.top = increment + "px";
    }
    requestID = requestAnimationFrame(scrollToBtm);
}

function scrollToHome() {
    activePage = "home";
    currentTime = 0;
    cancelAnimationFrame(requestID);
    content.style.left = 0 + "px";
}

function easeOut(currentTime, startValue, changeInValue, duration) {
    currentTime /= duration;
    return -changeInValue * currentTime * (currentTime - 2) + startValue;
}



//********
// LeftDiv

var commentOverlay = document.getElementById("commentOverlay");

var currentFeature = new Object();
var iconFeature = [];

var createIconStyle = function (type) {
    return new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 0.95],
            scale: 0.03,
            src: "./assets/img/" + type + ".png"
        })
    });
};

var vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: iconFeature
    })
});

var map = new ol.Map({
    target: 'publicMap',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }), vectorLayer
    ],
    view: new ol.View({
        center: ol.proj.transform([-73.1234, 45.678], 'EPSG:4326', 'EPSG:3857'),
        zoom: 10
    })
});

var target = map.getTarget();
var jTarget = typeof target === "string" ? $("#" + target) : $(target);

map.on('click', function (event) {
    var feature = map.forEachFeatureAtPixel(event.pixel,
        function (feature, layer) {
            return true;
        });
    if (feature) {

    } else {
        commentOverlay.style[transformProperty] = "scale(1,1)";
        commentOverlay.style.opacity = 0.8;
        if (currentFeature.feature === undefined) {
            var featurePos = event.coordinate;
            addFeature(featurePos, "default", 2);
        }
    }
});

$(map.getViewport()).on('mousemove', function (e) {
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
        return feature;
    });
    if (hit) {
        jTarget.css("cursor", "pointer");
        console.log(hit.getStyle().getImage().getScale());
        hit.getStyle().getImage().setScale(0.04);
        vectorLayer.getSource().changed();
    } else {
        jTarget.css("cursor", "");
        if (vectorLayer.getSource().getFeatures().length !== 0) {
            for (var i = 0; i < vectorLayer.getSource().getFeatures().length; i++) {
                vectorLayer.getSource().getFeatures()[i].getStyle().getImage().setScale(0.03);
            }
            vectorLayer.getSource().changed();

        }
    }
});

function addFeature(position, type, level) {
    var feature = new ol.Feature(new ol.geom.Point(position));
    currentFeature.feature = feature;
    feature.setStyle(createIconStyle(type));
    vectorLayer.getSource().addFeature(feature);
}

function writeJson(featureArray) {
    var featureJSON = new ol.format.GeoJSON();
    console.log(featureJSON.writeFeatures(featureArray));
}

document.getElementById("wTag").addEventListener("click", function () {
    document.getElementById("wTag").style.background = '#5bc0de';
    document.getElementById("wTag").style.color = 'white';
    document.getElementById("sTag").style.background = 'white';
    document.getElementById("sTag").style.color = '#5bc0de';
    document.getElementById("lTag").style.background = 'white';
    document.getElementById("lTag").style.color = '#5bc0de';
    currentFeature.featuretype = "water";
    currentFeature.feature.setStyle(createIconStyle(currentFeature.featuretype));

});
document.getElementById("sTag").addEventListener("click", function () {
    document.getElementById("sTag").style.background = '#ffbb33';
    document.getElementById("sTag").style.color = 'white';
    document.getElementById("wTag").style.background = 'white';
    document.getElementById("wTag").style.color = '#5bc0de';
    document.getElementById("lTag").style.background = 'white';
    document.getElementById("lTag").style.color = '#5bc0de';
    currentFeature.featuretype = "soil";
    currentFeature.feature.setStyle(createIconStyle(currentFeature.featuretype));
});
document.getElementById("lTag").addEventListener("click", function () {
    document.getElementById("lTag").style.background = '#5cb85c';
    document.getElementById("lTag").style.color = 'white';
    document.getElementById("sTag").style.background = 'white';
    document.getElementById("sTag").style.color = '#5bc0de';
    document.getElementById("wTag").style.background = 'white';
    document.getElementById("wTag").style.color = '#5bc0de';
    currentFeature.featuretype = "livestock";
    currentFeature.feature.setStyle(createIconStyle(currentFeature.featuretype));
});

for (var i = 0; i < document.body.getElementsByClassName("commentLevel").length; i++) {
    document.body.getElementsByClassName("commentLevel")[i].addEventListener("click", function (event) {
        for (var j = 0; j < document.body.getElementsByClassName("commentLevel").length; j++) {
            document.body.getElementsByClassName("commentLevel")[j].style.color = "#5bc0de";
            document.body.getElementsByClassName("commentLevel")[j].style.background = 'white';
        }
        event.target.style.color = "white";
        event.target.style.background = '#d62d20';
        currentFeature.level = event.target.text;
    });
}


document.getElementById("commentSubmitBtn").addEventListener("click", function () {
    var feature = currentFeature.feature;
    var type = currentFeature.featuretype;
    var level = currentFeature.level;
    var content = document.getElementById("commentText").value;
    feature.setProperties({
        "type": type,
        "level": level,
        "content": content
    });
    iconFeature.push(feature);
    writeJson(iconFeature);
    commentOverlay.style[transformProperty] = "scale(0,0)";
    commentOverlay.style.opacity = 0;
    currentFeature.feature = undefined;    
});

document.getElementById("commentCancelBtn").addEventListener("click", function () {
    commentOverlay.style[transformProperty] = "scale(0,0)";
    commentOverlay.style.opacity = 0;
    vectorLayer.getSource().removeFeature(currentFeature.feature);
    currentFeature.feature = undefined;
});