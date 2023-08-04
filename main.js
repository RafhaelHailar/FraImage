const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");

const image = document.getElementById("imageElement");
let frame_width = 20;

let init_dimension = {
    width : null,
    height : null
}

let frame_scale;

function putImage(event) {
    image.src = URL.createObjectURL(event.target.files[0]);
    image.onload = function() {
        scaleCanvas(.15);
        canvas.crossOrigin = "anonymous";
        frame_scale = frame_width / canvas.width;
        drawImage();
    }
}

function downloadImage() {
    let linkElement = document.getElementById("linkElement");
    linkElement.setAttribute("download","firaimage-image.jpg");
    
    scaleCanvas();
    frame_width = canvas.width * frame_scale;
    drawImage();

    let canvasData = canvas.toDataURL("image/jpg");
    canvasData.replace("image/jpg","image/octet-stream");

    linkElement.setAttribute("href",canvasData);
    linkElement.click();

    scaleCanvas(0.15);
    frame_width = canvas.width * frame_scale;
    drawImage();
}

function drawImage() {
    context.drawImage(image,frame_width,frame_width,canvas.width - frame_width * 2,canvas.height - frame_width * 2);
        context.fillStyle = "pink";
        //top border
        context.beginPath();
        context.moveTo(0,0);
        context.lineTo(frame_width,frame_width);
        context.lineTo(canvas.width - frame_width,frame_width);
        context.lineTo(canvas.width,0);
        context.lineTo(0,0);
        context.fill();
       
        //left border
        context.fillStyle = "yellow";
        context.beginPath();
        context.moveTo(0,0);
        context.lineTo(frame_width,frame_width);
        context.lineTo(frame_width,canvas.height - frame_width);
        context.lineTo(0,canvas.height);
        context.lineTo(0,0);
        context.fill();

        //right border
        context.fillStyle = "green";
        context.beginPath();
        context.moveTo(canvas.width,0);
        context.lineTo(canvas.width - frame_width,frame_width);
        context.lineTo(canvas.width - frame_width,canvas.height - frame_width);
        context.lineTo(canvas.width,canvas.height);
        context.lineTo(canvas.width,0);
        context.fill();

        //bottom border
        context.fillStyle = "blue";
        context.beginPath();
        context.moveTo(0,canvas.height);
        context.lineTo(frame_width,canvas.height - frame_width);
        context.lineTo(canvas.width - frame_width,canvas.height - frame_width);
        context.lineTo(canvas.width,canvas.height);
        context.lineTo(0,canvas.height);
        context.fill();
}

function scaleCanvas(scale = 1) {
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;
}