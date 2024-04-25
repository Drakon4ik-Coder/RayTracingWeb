var canvas = document.getElementById('preview-canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
width = canvas.width;
height = canvas.height;

var ctx = canvas.getContext('2d');
data = ctx.getImageData(0, 0, width, height);

var jsonData = localStorage.getItem("scene");

console.log(jsonData);

scene = JSON.parse(jsonData);

render(scene);

function saveCanvasImage() {
    var dataURI = canvas.toDataURL("image/png");
    var link = document.createElement("a");
    link.download = "canvas_image.png";
    link.href = dataURI;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

var saveBtn = document.getElementById('save-btn');

saveBtn.addEventListener("click", saveCanvasImage);

