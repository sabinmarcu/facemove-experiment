var tolerance = 10;
var viewport = document.getElementById('viewport');

var faceMove = true;

var moveImage = function(percents) {
	var img = document.querySelector(".bg");

	img.style.left = "-" + (tolerance + percents.x * tolerance )+ "%";
	img.style.right = "-" + (tolerance - percents.x * tolerance )+ "%";
	img.style.top = "-" + (tolerance + percents.y * tolerance )+ "%";
	img.style.bottom = "-" + (tolerance - percents.y * tolerance )+ "%";
    console.log("Moving", {
        left: img.style.left,
        right: img.style.right,
        top: img.style.top,
        bottom: img.style.bottom
    });
}

window.addEventListener("mousemove", function(evt) {
    if (!faceMove) {
        var win = {
            x: window.innerWidth,
            y: window.innerHeight
        }, pointer = {
            x: evt.clientX - win.x / 2,
            y: evt.clientY - win.y / 2
        }, percents = {
            x: pointer.x / win.x * 2,
            y: pointer.y / win.y * 2
        };
        moveImage(percents);
    }
})

var initTracking = function() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var coords = {
        x: 0,
        y: 0
    };
	var tracker = new tracking.ObjectTracker('face');
	tracker.setInitialScale(4);
	tracker.setStepSize(2);
	tracking.track('#video', tracker, { camera: true });
	tracker.on('track', function(event) {
        if (faceMove) {
            var maxRectArea = 0;
            var maxRect;
            event.data.forEach(function(rect) {
                if (rect.width * rect.height > maxRectArea){
                    maxRectArea = rect.width * rect.height;
                    maxRect = rect;
                }
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.strokeStyle = 'magenta';
                context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                context.font = '11px Helvetica';
                context.fillStyle = "#fff";
                context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
                context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
            });
            if(maxRectArea > 0) {
                var rectCenterX = maxRect.x + (maxRect.width/2);
                var rectCenterY = maxRect.y + (maxRect.height/2);
                faceX = rectCenterX;
                faceY = rectCenterY;
                coords = {
                    x: ( faceX / viewport.offsetWidth - 0.5 ) * 3,
                    y: ( faceY / viewport.offsetHeight - 0.5 ) * -3
                }
            }
            moveImage(coords);
        }
	});
}

var waitInterval = setInterval(function() {
	if (tracking) {
		initTracking();
		clearInterval(waitInterval);
	}
}, 100);


Array.prototype.slice.apply(document.getElementsByName("input")).map(function(it) {
    if (it.id === "mouse") {
        if (!faceMove) {
            it.checked = true;
        }
        it.addEventListener("change", function() {
            faceMove = false;
            moveImage({
                x: 0,
                y: 0
            });
        });
    } else if (it.id === "face") {
        if (faceMove) {
            it.checked = true;
        }
        it.addEventListener("change", function() {
            faceMove = true;
            moveImage({
                x: 0,
                y: 0
            });
        });
    }
});