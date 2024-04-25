var canvas = document.getElementById('preview-canvas');
width = canvas.width;
height = canvas.height;
var ctx = canvas.getContext('2d');
data = ctx.getImageData(0, 0, width, height);
var scene = {};

scene.camera = {
    point: {
        x: 0,
        y: 0,
        z: 10,
    },
    fieldOfView: 45,
    vector: {
        x: 0,
        y: 0,
        z: 0,
    },
};

scene.lights = [
    {
        x: 0,
        y: 0,
        z: 0,
    },
];
scene.objects = [];

function render(scene) {
    var camera = scene.camera,
        objects = scene.objects,
        lights = scene.lights;
    var eyeVector = Vector.unitVector(
            Vector.subtract(camera.vector, camera.point)
        ),
        vpRight = Vector.unitVector(Vector.crossProduct(eyeVector, Vector.UP)),
        vpUp = Vector.unitVector(Vector.crossProduct(vpRight, eyeVector)),
        fovRadians = (Math.PI * (camera.fieldOfView / 2)) / 180,
        heightWidthRatio = height / width,
        halfWidth = Math.tan(fovRadians),
        halfHeight = heightWidthRatio * halfWidth,
        camerawidth = halfWidth * 2,
        cameraheight = halfHeight * 2,
        pixelWidth = camerawidth / (width - 1),
        pixelHeight = cameraheight / (height - 1);
    var index, color;
    var ray = {
        point: camera.point,
    };
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var xcomp = Vector.scale(vpRight, x * pixelWidth - halfWidth),
                ycomp = Vector.scale(vpUp, y * pixelHeight - halfHeight);

            ray.vector = Vector.unitVector(Vector.add3(eyeVector, xcomp, ycomp));
            color = trace(ray, scene, 0);
            index = x * 4 + y * width * 4;
            data.data[index] = color.x;
            data.data[index + 1] = color.y;
            data.data[index + 2] = color.z;
            data.data[index + 3] = 255;
        }
    }
    ctx.putImageData(data, 0, 0);
}
function trace(ray, scene, depth) {
    if (depth > 3) return;

    var distObject = intersectScene(ray, scene);
    if (distObject[0] === Infinity) {
        return Vector.GREY;
    }

    var dist = distObject[0],
        object = distObject[1];
    var pointAtTime = Vector.add(ray.point, Vector.scale(ray.vector, dist));

    return surface(
        ray,
        scene,
        object,
        pointAtTime,
        sphereNormal(object, pointAtTime),
        depth
    );
}

function intersectScene(ray, scene) {
    var closest = [Infinity, null];
    for (var i = 0; i < scene.objects.length; i++) {
        var object = scene.objects[i];
        if (object.type === "sphere") {
            dist = sphereIntersection(object, ray);
        }
        if (dist !== undefined && dist < closest[0]) {
            closest = [dist, object];
        }
    }
    return closest;
}

function sphereIntersection(sphere, ray) {
    var eye_to_center = Vector.subtract(sphere.point, ray.point),
        v = Vector.dotProduct(eye_to_center, ray.vector),
        eoDot = Vector.dotProduct(eye_to_center, eye_to_center),
        discriminant = sphere.radius * sphere.radius - eoDot + v * v;
    if (discriminant < 0) {
        return;
    } else {
        return v - Math.sqrt(discriminant);
    }
}

function sphereNormal(sphere, pos) {
    return Vector.unitVector(Vector.subtract(pos, sphere.point));
}

function surface(ray, scene, object, pointAtTime, normal, depth) {
    var b = object.color,
        c = Vector.ZERO,
        lambertAmount = 0;
    if (object.lambert) {
        for (var i = 0; i < scene.lights.length; i++) {
            var lightPoint = scene.lights[i];
            if (!isLightVisible(pointAtTime, scene, lightPoint)) continue;
            var contribution = Vector.dotProduct(
                Vector.unitVector(Vector.subtract(lightPoint, pointAtTime)),
                normal
            );
            if (contribution > 0) lambertAmount += contribution;
        }
    }
    if (object.specular) {
        var reflectedRay = {
            point: pointAtTime,
            vector: Vector.reflectThrough(ray.vector, normal),
        };
        var reflectedColor = trace(reflectedRay, scene, ++depth);
        if (reflectedColor) {
            c = Vector.add(c, Vector.scale(reflectedColor, object.specular));
        }
    }
    lambertAmount = Math.min(1, lambertAmount);
    return Vector.add3(
        c,
        Vector.scale(b, lambertAmount * object.lambert),
        Vector.scale(b, object.ambient)
    );
}
function isLightVisible(pt, scene, light) {
    var distObject = intersectScene(
        {
            point: pt,
            vector: Vector.unitVector(Vector.subtract(pt, light)),
        },
        scene
    );
    return distObject[0] > -0.005;
}