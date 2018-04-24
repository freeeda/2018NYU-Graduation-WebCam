// our video capture object
var capture;
//video capture object used for tinting
var tintVideo;

// an object that describes all of the possible points in a detected face
// this object is just being used for debugging purposes - it will be used to
// draw the outline of a face on top of a detected region of your video
// for more information about these points visit the CLM Tracker distribution
// https://github.com/auduno/clmtrackr

var facePoints = {
	'faceOutline'  : {'closed':false, points: [0,1,2,3,4,5,6,7,8,9,10,11,12,13]},
	'leftEye'      : {'closed':true,  points: [23,63,24,64,25,65,26,66]},
	'rightEye'     : {'closed':true,  points: [30,68,29,67,28,70,31,69]},
	'leftEyebrow'  : {'closed':false, points: [19,20,21,22]},
	'rightEyebrow' : {'closed':false, points: [18,17,16,15]},
	'noseBridge'   : {'closed':false, points: [33,41,62]},
	'nose'         : {'closed':false, points: [34,35,36,42,37,43,38,39,40]},
	'upperLip'     : {'closed':true,  points: [44,45,46,47,48,49,50,59,60,61]},
	'lowerLip'     : {'closed':true,  points: [44,55,54,53,52,51,50,58,57,56]}
};
//loading pictures for filters
var heart, hat, marker;
//variables for user input
var input, button, ask, student, greeting;
var hasName;
var myFont;


function preload(){
  heart = loadImage("images/violetheart.png");
	hat = loadImage("images/hat.png");
	marker = loadImage("images/nyumarker.png");
	myFont = loadFont('images/MeriendaOne-Regular.ttf');

}

function setup() {
	// size our canvas
	createCanvas(800, 650);

	//text box for user to enter their name
	ask = createElement('h4', 'Please enter your name (optional): ');
	ask.position(10, 630);
	input = createInput();
	input.position(250, 650);

	// create a video capture object with other ratio 4:3
	capture = createCapture(VIDEO);
	capture.size(800, 600);
	//create tint video object
	tintVideo = createCapture(VIDEO);
	tintVideo.size(400, 300);

	// prevent the capture from being displayed
	// display the capture objects using the image() function in the draw loop
	capture.hide();
	tintVideo.hide();

	// start tracking face at our capture object
	startTrackerFromProcessing(capture);
}

function draw() {
  background(255);
	imageMode(CORNER);
	image(capture, 0, 0, 800, 600);

	// get face array
	var faceArray = getFaceArray();

	// check if we see a face
	if (faceArray != false){
		//there's a face
		//now get refs of our checkboxes for filters
    var heartV = document.getElementById('heart');
		var cap = document.getElementById('cap');
		var tintBox = document.getElementById('tint');
		var markerBox = document.getElementById('marker');


		//if user has entered their name and pressed ENTER
		if (hasName){
			textSize(35);
			fill(102, 0, 141);

		}
		else {
			greeting = '';
		}
		textFont(myFont);
		textAlign(CENTER);
		text(greeting, 400, 550);


		//if user clicks the heart filter - display the heart
    if (heartV.checked === true){
      // compute the distance between the edges of an eye
      var eyeSize = dist(faceArray[23][0], faceArray[23][1], faceArray[25][0], faceArray[25][1]);

      // draw pupils using our newly computed eye size
      imageMode(CENTER);
      image(heart, faceArray[27][0], faceArray[27][1], eyeSize, eyeSize);
      image(heart, faceArray[32][0], faceArray[32][1], eyeSize, eyeSize);
    }

		//if user clicks the hat filter - display the hat
		if (cap.checked === true){
			//compute the distance between eyebrows as head/hat width
			var hatSize = dist(faceArray[19][0], faceArray[19][1], faceArray[15][0], faceArray[15][1]);
			//also compute the length of nose ad the distance between nose and head to locate head position
			var noseLength = dist(faceArray[33][0], faceArray[33][1], faceArray[37][0], faceArray[37][1]);
			imageMode(CENTER);
			image(hat, faceArray[33][0], faceArray[33][1] - noseLength * 2, hatSize * 2.5, hatSize * 1.5);
		}

		if (markerBox.checked === true){
			// compute the distance between lips
	    var lipLength = dist(faceArray[47][0], faceArray[47][1], faceArray[53][0], faceArray[53][1]);

	    // compute the distance between the lips when mouth is opened
	    var lipOpen = dist(faceArray[60][0], faceArray[60][1], faceArray[57][0], faceArray[57][1]);

	    // compute the width of mouth
	    var mouthWidth = dist(faceArray[44][0], faceArray[44][1], faceArray[50][0], faceArray[50][1]);

			//if mouth is detected to be opened
	    if (lipOpen / lipLength > 0.35) {
				imageMode(CENTER);
	      image(marker, faceArray[57][0], faceArray[57][1], mouthWidth, lipOpen);
	    }
		}

		//if user clicks the tint filter
		if (tintBox.checked === true){
			tint(65, 0, 111);
			image(tintVideo, 0, 0, 400, 300);

			tint(134, 0, 174);
			image(tintVideo, 400, 0, 400, 300);

			tint(166, 93, 199);
			image(tintVideo, 0, 300, 400, 300);

			tint(164, 139, 199);
			image(tintVideo, 400, 300, 400, 300);

			noTint();//remove tint for the sake of other filtes
		}


	} //closing the if statement for detecting face
} //closing the draw function

function keyPressed(){
	//if user presses ENTER, store their name input
	if (keyCode === ENTER){
		hasName = true;
		student = input.value();
		greeting = 'Congrats on graduating, ' + student + '!';
		console.log(student, greeting);
	}

	//press delete to clear the name and greeting
	else if (keyCode === 8){
		hasName = false;
	}

	//press space to save canvas
	else if (keyCode === 32){
		save('me.png');
	}

}
