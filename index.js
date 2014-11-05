var pixelSize = 6;
var w = Math.floor(window.innerWidth / pixelSize);
var h = Math.floor(window.innerHeight / pixelSize);
var mutationFactor = 10;

// From https://github.com/sindresorhus/array-shuffle/
function shuffle(arr) {
    var rand;
    var tmp;
    var len = arr.length;
    var ret = arr.slice();

    while (len) {
        rand = Math.floor(Math.random() * len--);
        tmp = ret[len];
        ret[len] = ret[rand];
        ret[rand] = tmp;
    }

    return ret;
}

function randint(from, to) {
    if (!to) {
        to = from;
        from = 0;
    }
    return Math.floor(Math.random() * (to - from)) + from;
}

// Try not to bias averaging up or down
// Extremely small biases have a surprisingly large impact
var flip = true;

function avg(v1, v2) {
    flip = !flip;
    if (flip) {
        return Math.ceil((v1 + v2) / 2);
    } else {
        return Math.floor((v1 + v2) / 2);
    }
}

function randomcolor() {
    return [randint(255), randint(255), randint(255)];
}

function mutateColorComponent(num) {
    return Math.min(255, Math.max(0, num + randint(-90, 91)));
}

function mutatecolor(color) {
    return [mutateColorComponent(color[0]), mutateColorComponent(color[1]), mutateColorComponent(color[2])];
}

function combineColors(c1, c2) {
    var newColor = [
        avg(c1[0], c2[0]),
        avg(c1[1], c2[1]),
        avg(c1[2], c2[2])
    ];
    if (randint(mutationFactor) == 1) {
        return mutatecolor(newColor);
    } else {
        return newColor;
    }
}


function combinePosition(p1, p2, max) {
    var newPos = avg(p1, p2);
    if (randint(mutationFactor) == 1) {
        return Math.min(max, Math.max(0, newPos + randint(-30, 31)));
    } else {
        return newPos;
    }
}

function combinePixels(p1, p2) {
    return {
        x: combinePosition(p1.x, p2.x, w),
        y: combinePosition(p1.y, p2.y, h),
        color: combineColors(p1.color, p2.color)
    };
}

function randomPixel() {
    return {
        x: randint(w),
        y: randint(h),
        color: randomcolor()
    };
}


var canvas = document.createElement('canvas');
canvas.width = w * pixelSize;
canvas.height = h * pixelSize;
document.body.appendChild(canvas);
var ctx = canvas.getContext('2d');

function renderPixel(p) {
    ctx.fillStyle = 'rgb(' + p.color.join(',') + ')';
    ctx.fillRect(p.x * pixelSize, p.y * pixelSize, pixelSize, pixelSize);
}

var pixels = Array.apply(null, new Array(15)).map(randomPixel);

function iterate(ps) {
    var result = [];
    var count = Math.min(ps.length, 15);
    for (var i = 0; i < count; i++) {
        for (var j = 0; j < count; j++) {
            result.push(combinePixels(ps[i], ps[j]));
        }
    }
    return result;
}

function doit() {
    pixels = shuffle(iterate(pixels));
    pixels.forEach(renderPixel);
    requestAnimationFrame(doit);
}

doit();
