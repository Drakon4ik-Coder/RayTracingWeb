document.addEventListener("DOMContentLoaded", function () {
    var addObjectBtn = document.getElementById("add-object-btn");
    var clsBtn = document.getElementById("clear-btn");
    var helpBtn = document.getElementById("help-btn");
    var randomBtn = document.getElementById("random-btn");
    var fullBtn = document.getElementById("full-btn");
    clsBtn.addEventListener("click", function () {
        var x = document.getElementById("object-position-x");
        var y = document.getElementById("object-position-y");
        var z = document.getElementById("object-position-z");
        var size = document.getElementById("object-size");
        scene.objects = [];
        x.value = 0;
        y.value = 0;
        z.value = 20;
        size.value = 4;
        localStorage.setItem("scene", "{}");
    });
    addObjectBtn.addEventListener("click", function () {
        addNewObj();
        var jsonData = JSON.stringify(scene);

        localStorage.setItem("scene", jsonData);
    });
    helpBtn.addEventListener("click", function () {
        window.location.href = "help.html";
    });
    randomBtn.addEventListener("click", function () {
        lightAngle += Math.random() * Math.PI * 10;
        updateLightPosition(true);
    });
    fullBtn.addEventListener("click", function () {
        var jsonData = JSON.stringify(scene);

        localStorage.setItem("scene", jsonData);
        window.location.href = "fullscreen.html";
    })
});

function addNewObj() {
    var type = document.getElementById("object-type").value;
    var colorValue = document.getElementById("object-color").value;
    var r = parseInt(colorValue.substring(1, 3), 16);
    var g = parseInt(colorValue.substring(3, 5), 16);
    var b = parseInt(colorValue.substring(5, 7), 16);
    var posX = document.getElementById("object-position-x").value / 10;
    var posY = -document.getElementById("object-position-y").value / 10;
    var posZ = -document.getElementById("object-position-z").value / 10;
    var size = document.getElementById("object-size").value / 10;
    scene.objects.push({
        type: type,
        point: {
            x: posX,
            y: posY,
            z: posZ,
        },
        color: {
            x: r,
            y: g,
            z: b,
        },
        specular: 0.2,
        lambert: 0.7,
        ambient: 0.1,
        radius: size,
    });
}

document.addEventListener("keydown", function (event) {
    var x = document.getElementById("object-position-x");
    var y = document.getElementById("object-position-y");
    var z = document.getElementById("object-position-z");
    if (event.key === "w" || event.key === "W") {
        y.value = parseInt(y.value) + 1;
    } else if (event.key === "s" || event.key === "S") {
        y.value = parseInt(y.value) - 1;
    } else if (event.key === "a" || event.key === "A") {
        x.value = parseInt(x.value) - 1;
    } else if (event.key === "d" || event.key === "D") {
        x.value = parseInt(x.value) + 1;
    } else if (event.key === "q" || event.key === "Q") {
        z.value = parseInt(z.value) - 1;
    } else if (event.key === "e" || event.key === "E") {
        z.value = parseInt(z.value) + 1;
    }
});

function renderLoop() {
    addNewObj();
    render(scene);
    scene.objects.pop();
}
var jsonData = localStorage.getItem("scene");
if (jsonData !== null && jsonData !== undefined) {
    if (jsonData!=="{}") {
        scene=JSON.parse(jsonData);
    }
}

canvas.width = window.innerWidth*0.8;
canvas.height = window.innerHeight*0.65;
width = canvas.width;
height = canvas.height;
data = ctx.getImageData(0, 0, width, height);

var x = document.getElementById("object-position-x");
var y = document.getElementById("object-position-y");
var z = document.getElementById("object-position-z");
var size = document.getElementById("object-size");

x.value = 0;
y.value = 0;
z.value = 0;
size.value = 4;

setInterval(renderLoop, 10);

var lightRadius = 100; // orbit radius
var lightSpeed = 0.02; // speed
var lightAngle = 0; // current angle

// Function to update the position of the light
function updateLightPosition(force = false) {
    var light = document.getElementById("light");
    if (light.checked && !force) {
        return;
    }
    // Calculate the new position of the light
    var lightX = scene.camera.point.x + lightRadius * Math.sin(lightAngle);
    var lightY = scene.camera.point.y + lightRadius * Math.cos(lightAngle);
    var lightZ = scene.camera.point.z + lightRadius * Math.cos(lightAngle);

    // Update the position of the light in the scene
    scene.lights[0].x = lightX;
    scene.lights[0].y = lightY;
    scene.lights[0].z = lightZ;

    lightAngle += lightSpeed;
}

// Call the updateLightPosition function periodically to animate the light orbit
setInterval(updateLightPosition, 10);

function updateCameraPosition() {
    // Get the slider values
    var latitude = parseFloat(document.getElementById("latitudeSlider").value);
    var longitude = parseFloat(document.getElementById("longitudeSlider").value);
    var distance = parseFloat(document.getElementById("distanceSlider").value);

    // Convert latitude and longitude to radians
    var latRad = latitude * Math.PI / 180;
    var longRad = longitude * Math.PI / 180;

    // Calculate the new camera position using spherical coordinates
    var x = distance * Math.sin(latRad) * Math.cos(longRad);
    var y = distance * Math.sin(latRad) * Math.sin(longRad);
    var z = distance * Math.cos(latRad);

    // Update the camera's position in the scene
    scene.camera.point.x = x;
    scene.camera.point.y = y;
    scene.camera.point.z = z;
}

setInterval(updateCameraPosition, 10);