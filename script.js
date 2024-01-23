function init() {
    console.log("Calling Init Color Selector!");
    init_color_selector();
    init_image_select();
    init_button_press();
}

function init_color_selector() {
    console.log("Called Init Color Selector!");

    // Fetching Color Input Elements
    let color_one_input = document.getElementById("color-one");
    let color_two_input = document.getElementById("color-two");

    // Setting Event Listeners
    color_one_input.addEventListener("change", set_blend);
    color_two_input.addEventListener("change", set_blend);
    set_blend();
}

function init_image_select() {
    let image_selector = document.getElementById("image-input");
    let image_container = document.getElementById("photo");
    image_selector.addEventListener("change", (event) => {
        // Get the selected image file
        let photo = event.target.files[0];
        if (photo) { // Read the image file as a data URL
            let reader = new FileReader();
            reader.onload = function(e) {
                image_container.src = e.target.result;
            };
            reader.readAsDataURL(photo);
        }
    });
}

function init_button_press() {
    let button = document.getElementById("process-button");
    button.addEventListener("click", process_image);
}

function process_image() {
    let image = document.getElementById('photo');
    let canvas = document.getElementById('canvas');
    
    canvas.width = image.width;
    canvas.height = image.height;

    let ctx = canvas.getContext('2d');

    // Map Image to Canvas
    ctx.drawImage(image, 0, 0, image.width, image.height);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    // Fetching Each Current Color
    let rgbOne = document.getElementById("color-one-text").textContent.slice(1);
    let rgbTwo = document.getElementById("color-two-text").textContent.slice(1);
    // Splitting on Each Red, Green, and Blue Hex Color Segement
    rgbOne = [rgbOne.substring(0, 2), rgbOne.substring(2, 4), rgbOne.substring(4, 6)];
    rgbTwo = [rgbTwo.substring(0, 2), rgbTwo.substring(2, 4), rgbTwo.substring(4, 6)];
    // Mapping Each Segement to Their Base 10 RGB Equivilant
    rgbOne = rgbOne.map(function(value) {return parseInt(value, 16);});
    rgbTwo = rgbTwo.map(function(value) {return parseInt(value, 16);});

    console.log(rgbOne, rgbTwo);

    let percent = 0.0;
    let i = 0;
    let ratio = 0.0;
    for (i; i < data.length; i += 4) {
        let R = data[i];
        let G = data[i + 1];
        let B = data[i + 2];
        // console.log(R, G, B);
        ratio = (R - rgbOne[0]) / (rgbTwo[0] - rgbOne[0]);
        if (1 > ratio && ratio > 0) {
            let gRatio = (G - rgbOne[1]) / (rgbTwo[1] - rgbOne[1]);
            let bRatio = (B - rgbOne[2]) / (rgbTwo[2] - rgbOne[2]);
            if (Math.max(ratio, gRatio, bRatio) - Math.min(ratio, gRatio, bRatio) <= 0.1) {
                console.log("Found: ", R, G, B,"#" + R.toString(16) + B.toString(16) + G.toString(16));
            }
        }
        

    }
    console.log("Done", i);
}

function set_blend() {
    // Fetch Colors from Element Inputs
    let current_color_one = document.getElementById("color-one").value;
    let current_color_two = document.getElementById("color-two").value;
    let blend = document.getElementById("color-blender");

    // Setting Correct Text Fields
    document.getElementById("color-one-text").textContent = current_color_one;
    document.getElementById("color-two-text").textContent = current_color_two;

    // Calculating Gradient
    let new_gradient = `linear-gradient(90deg, ${current_color_one}, ${current_color_two})`;
    blend.style.background = new_gradient;
}