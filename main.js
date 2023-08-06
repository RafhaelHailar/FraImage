const image_container = document.getElementById("image-preview");
const image_container_CSS = getComputedStyle(image_container);
const image_container_width  = parseInt(image_container_CSS.getPropertyValue("width"));
const image_container_height  = parseInt(image_container_CSS.getPropertyValue("height"));

const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");

const image = document.getElementById("imageElement");

let frame_image_source = "images/leave-frame.webp";
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
    context.clearRect(0,0,canvas.width,canvas.height);
    context.fillRect(0,0,canvas.width,canvas.height);
    context.drawImage(image,frame_width,frame_width,canvas.width - (frame_width * 2),canvas.height - (frame_width * 2));

    let image_frame = new Image();
    image_frame.src = frame_image_source;
    image_frame.onload = function() {
        drawFrame(canvas,context,null,image_frame,"left");
        drawFrame(canvas,context,null,image_frame,"top");
        drawFrame(canvas,context,null,image_frame,"right");
        drawFrame(canvas,context,null,image_frame,"bottom");
    }
}

function scaleCanvas(scale = 1) {
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;
}

function updateFrameWidth(element) {
    frame_width = element.value;
    drawImage(canvas,context);
}

function getFramePosition(position,width,height) {
    let POSITIONS = {

        left :  [
            [0,0],
            [frame_width,frame_width],
            [frame_width,height - frame_width],
            [0,height]
        ],
        
        top : [
            [0,0],
            [frame_width,frame_width],
            [width - frame_width,frame_width],
            [width,0]
        ],

        right : [
            [width,0],
            [width - frame_width,frame_width],
            [width - frame_width,height - frame_width],
            [width,height]
        ],

        bottom : [
            [0,height],
            [frame_width,height - frame_width],
            [width - frame_width,height - frame_width],
            [width,height]
        ]

    }

    return POSITIONS[position];
}

function getImagePosition(position,image,width,height) {
    let POSITIONS = {
        left : {
            image_source : {
                x : 0,
                y : 0,
                width : frame_width,
                height : image.height
            },
            image_canvas : {
                x : 0,
                y : 0,
                width : frame_width,
                height : height
            }
        },

        top : {
            image_source : {
                x : 0,
                y : 0,
                width : image.width,
                height : frame_width
            },
            image_canvas : {
                x : 0,
                y : 0,
                width : width,
                height : frame_width
            }
        },

        right : {
            image_source : {
                x : image.width - frame_width,
                y : 0,
                width : frame_width,
                height : image.height
            },
            image_canvas : {
                x : canvas.width - frame_width,
                y : 0,
                width : frame_width,
                height : height
            }
        },

        bottom : {
            image_source : {
                x : 0,
                y : image.height - frame_width,
                width : image.width,
                height : frame_width
            },
            image_canvas : {
                x : 0,
                y : canvas.height - frame_width,
                width : width,
                height : frame_width
            }
        },
    }

    return POSITIONS[position];
}

function drawFrame(canvas,context,color,image,position) {
    let coordinates = getFramePosition(position,canvas.width,canvas.height);

    context.save();
    context.beginPath();

    //starting position
    context.moveTo(coordinates[0][0],coordinates[0][1]);

    for (let i = 1;i < coordinates.length;i++) {
        let [x,y] = coordinates[i];
        context.lineTo(x,y);
    }

    //ending position
    context.lineTo(coordinates[0][0],coordinates[0][1]);

    context.clip();  

    let {image_source,image_canvas} = getImagePosition(position,image,canvas.width,canvas.height);
    context.drawImage(
        image,
        image_source.x,
        image_source.y,
        image_source.width,
        image_source.height,
        image_canvas.x,
        image_canvas.y,
        image_canvas.width,
        image_canvas.height
    ); 

    context.restore();
}

window.onload = function() {
    let frame_images = document.querySelectorAll("#image-edits .frames-container .frame img");
    for (let i = 0;i < frame_images.length;i++) {
        frame_images[i].onclick = function() {
            frame_image_source = this.src;
            drawImage(canvas,context);
        }
    }
}