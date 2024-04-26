var Vector = {};

// # Constants
Vector.UP = { x: 0, y: 1, z: 0 };
Vector.ZERO = { x: 0, y: 0, z: 0 };
Vector.WHITE = { x: 255, y: 255, z: 255 };
Vector.GREY = { x: 192, y: 192, z: 192 };
Vector.ZEROcp = function() {
    return { x: 0, y: 0, z: 0 };
};

Vector.dot_product = function(a, b) {
    return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
};

Vector.cross_product = function(a, b) {
    return {
        x: (a.y * b.z) - (a.z * b.y),
        y: (a.z * b.x) - (a.x * b.z),
        z: (a.x * b.y) - (a.y * b.x)
    };
};

Vector.scale = function(a, t) {
    return {
        x: a.x * t,
        y: a.y * t,
        z: a.z * t
    };
};

Vector.unit_vector = function(a) {
    return Vector.scale(a, 1 / Vector.length(a));
};

// add 2 vectors
Vector.add = function(a, b) {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
        z: a.z + b.z
    };
};

// add 3 vectors
Vector.add3 = function(a, b, c) {
    return {
        x: a.x + b.x + c.x,
        y: a.y + b.y + c.y,
        z: a.z + b.z + c.z
    };
};

// sub 2 vectors
Vector.subtract = function(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z
    };
};

// get vector length
Vector.length = function(a) {
    return Math.sqrt(Vector.dot_product(a, a));
};

Vector.reflect_through = function(a, normal) {
    var d = Vector.scale(normal, Vector.dot_product(a, normal));
    return Vector.subtract(Vector.scale(d, 2), a);
};
