var params = window.location.hash.replace(/^#/, '').split(';').reduce(function(ps, p) {
    var parts = p.split(':');
    ps[parts[0]] = parts[1];
    return ps;
}, {});

function numParam(name, deflt) {
    var val = parseFloat(params[name]);
    if (!isNaN(val)) {
        return val;
    } else {
        return deflt;
    }
}

var opts = {
    pixelsize: numParam('pixelsize', 6),
    colormutationrate: numParam('colormutationrate', 0.1),
    colormutationamount: numParam('colormutationamount', 90),
    positionmutationrate: numParam('positionmutationrate', 0.1),
    positionmutationamount: numParam('positionmutationamount', 30),
    alpha: numParam('alpha', 0.1),
    bw: params['bw'] == 'true',
    running: true
};

var w = Math.floor(window.innerWidth / opts.pixelsize);
var h = Math.floor(window.innerHeight / opts.pixelsize);

var canvas = document.createElement('canvas');
canvas.width = w * opts.pixelsize;
canvas.height = h * opts.pixelsize;
document.body.appendChild(canvas);
var ctx = canvas.getContext('2d');

function clear() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, w * opts.pixelsize, h * opts.pixelsize);
}

clear();

var controls = document.getElementById('controls');

function wrapInput(input, name) {
    var div = document.createElement('div');
    var subDiv = document.createElement('div');
    subDiv.innerText = name + ':';
    div.appendChild(subDiv);
    div.appendChild(input);
    controls.appendChild(div);
}

function addSlider(name, min, max, step) {
    var range = document.createElement('input');
    range.type = 'range';
    range.min = min;
    range.max = max;
    range.step = step;
    range.value = opts[name];
    range.addEventListener('change', function(evt) {
        opts[name] = parseFloat(evt.target.value);
    });
    wrapInput(range, name);
    return range;
}

function addCheckbox(name) {
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = opts[name];
    checkbox.addEventListener('change', function(evt) {
        opts[name] = evt.target.checked;
    });
    wrapInput(checkbox, name);
    return checkbox;
}

function addButton(text, fn) {
    var btn = document.createElement('button');
    btn.innerText = text;
    btn.addEventListener('click', fn);
    controls.appendChild(btn);
}

addSlider('pixelsize', 1, 50, 1).addEventListener('change', function() {
    w = Math.floor(window.innerWidth / opts.pixelsize);
    h = Math.floor(window.innerHeight / opts.pixelsize);
});
addSlider('colormutationrate', 0, 1, 0.01);
addSlider('colormutationamount', 0, 255, 1);
addSlider('positionmutationrate', 0, 1, 0.01);
addSlider('positionmutationamount', 0, 100, 1);
addSlider('alpha', 0, 1, 0.01);
addCheckbox('bw');
addButton('Stop', function() {
    opts.running = false;
});
addButton('Start', function() {
    opts.running = true;
    doit();
});
addButton('Clear', clear);
var downloadlink = document.createElement('a');
downloadlink.href = '#';
downloadlink.addEventListener('click', function() {
    this.href = canvas.toDataURL();
    this.download = 'furiously.png';
});
downloadlink.innerText = '↓';
controls.appendChild(downloadlink);

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
    return [randint(256), randint(256), randint(256)];
}

function mutateColorComponent(num) {
    return Math.min(255, Math.max(0, num + randint(-opts.colormutationamount, opts.colormutationamount + 1)));
}

function mutatecolor(color) {
    return color.map(mutateColorComponent);
}

function combineColors(c1, c2) {
    var newColor;
    if (opts.bw) {
        newColor = [
            avg(c1[0], c2[0]),
            avg(c1[0], c2[0]),
            avg(c1[0], c2[0])
        ];
    } else {
        newColor = [
            avg(c1[0], c2[0]),
            avg(c1[1], c2[1]),
            avg(c1[2], c2[2])
        ];
    }
    if (Math.random() < opts.colormutationrate) {
        return mutatecolor(newColor);
    } else {
        return newColor;
    }
}

function combinePosition(x1, y1, x2, y2) {
    var newX, newY;
    if (Math.random() < opts.positionmutationrate) {
        var distance = randint(opts.positionmutationamount);
        var angle = Math.random() * Math.PI * 2;
        var xDelta = Math.cos(angle) * distance;
        var yDelta = Math.sin(angle) * distance;
        newX = avg(x1 + xDelta, x2 + xDelta);
        newY = avg(y1 + yDelta, y2 + yDelta);
        return {
            x: Math.max(0, Math.min(w, newX)),
            y: Math.max(0, Math.min(h, newY)),
            drawX: newX,
            drawY: newY
        };
    } else {
        newX = avg(x1, x2);
        newY = avg(y1, y2);
        return {
            x: newX,
            y: newY,
            drawX: newX,
            drawY: newY
        };
    }
}

function combinePixels(p1, p2) {
    var newPixel = combinePosition(p1.x, p1.y, p2.x, p2.y);
    newPixel.color = combineColors(p1.color, p2.color);
    return newPixel;
}

function randomPixel() {
    var x = randint(w);
    var y = randint(h);
    return {
        x: x,
        y: y,
        drawX: x,
        drawY: y,
        color: randomcolor()
    };
}

function renderPixel(p) {
    ctx.fillStyle = 'rgba(' + p.color.join(',') + ', ' + opts.alpha + ')';
    ctx.fillRect(p.drawX * opts.pixelsize, p.drawY * opts.pixelsize, opts.pixelsize, opts.pixelsize);
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
    if (opts.running) {
        requestAnimationFrame(doit);
    }
}

doit();
