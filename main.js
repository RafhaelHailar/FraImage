const image_container = document.getElementById("image-preview");
const image_container_CSS = getComputedStyle(image_container);
const image_container_width  = parseInt(image_container_CSS.getPropertyValue("width"));
const image_container_height  = parseInt(image_container_CSS.getPropertyValue("height"));

const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");

const image = document.getElementById("imageElement");

let frame_width = 20;
let frame_scale;

function putImage(event) {
    image.src = URL.createObjectURL(event.target.files[0]);
    image.onload = function() {
        canvas.crossOrigin = "anonymous";
        
        //scale the canvas relative to image
        if (image.height > image_container_height|| image.width > image_container_width) 
            (image.width > image.height) ? scaleCanvas(image_container_width / image.width) : scaleCanvas(image_container_height / image.height);
        else scaleCanvas();

        //the scale of the frame width relative to canvas width
        frame_scale = frame_width / canvas.width;

        //draw the image on the canvas
        drawImage(canvas,context);
    }
}

function downloadImage() {
    //get the link element
    let linkElement = document.getElementById("linkElement");
    linkElement.setAttribute("download","firaimage-image.jpg");

    //create a temporary canvas for downloading the image with its original size
    let temp_canvas = document.createElement("canvas");
    temp_canvas.width = image.width;
    temp_canvas.height = image.height;

    let temp_context = temp_canvas.getContext("2d");

    //scale the width
    frame_width = image.width * frame_scale;

    drawImage(temp_canvas,temp_context);

    //convert to a url
    let canvasData = temp_canvas.toDataURL("image/jpg");
    canvasData.replace("image/jpg","image/octet-stream");

    linkElement.setAttribute("href",canvasData);
    linkElement.click();
}

function drawImage(canvas,context) {
    context.drawImage(image,frame_width,frame_width,canvas.width - (frame_width * 2),canvas.height - (frame_width * 2));
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