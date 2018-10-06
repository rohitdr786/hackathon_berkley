import React, { Component } from 'react';
import $ from 'jquery';

export default class App extends Component {

  componentDidMount(){
    // SDK Needs to create video and canvas nodes in the DOM in order to function
    // Here we are adding those nodes a predefined div.
    this.divRoot = $("#affdex_elements")[0];
    this.width = 640;
    this.height = 480;
    this.faceMode = affdex.FaceDetectorMode.LARGE_FACES;
    //Construct a CameraDetector and specify the image width / height and face detector mode.
    this.detector = new affdex.CameraDetector(this.divRoot, this.width, this.height, this.faceMode);
    //Enable detection of all Expressions, Emotions and Emojis classifiers.
    this.detector.detectAllEmotions();
    this.detector.detectAllExpressions();
    this.detector.detectAllEmojis();
    this.detector.detectAllAppearance();

    //Add a callback to notify when the detector is initialized and ready for runing.
    this.detector.addEventListener("onInitializeSuccess", function() {
      this.log('#logs', "The detector reports initialized");
      //Display canvas instead of video feed because we want to draw the feature points on it
      $("#face_video_canvas").css("display", "block");
      $("#face_video").css("display", "none");
    });

    this.log= this.log();

    //function executes when Start button is pushed.
    this.onStart=this.onStart();

    //function executes when the Stop button is pushed.
    this.onStop=this.onStop();

    //function executes when the Reset button is pushed.
    this.onReset=this.onReset();

    //Add a callback to notify when camera access is allowed
    this.detector.addEventListener("onWebcamConnectSuccess", function() {
      this.log('#logs', "Webcam access allowed");
    });

    //Add a callback to notify when camera access is denied
    this.detector.addEventListener("onWebcamConnectFailure", function() {
      this.log('#logs', "webcam denied");
      console.log("Webcam access denied");
    });

    //Add a callback to notify when detector is stopped
    this.detector.addEventListener("onStopSuccess", function() {
      this.log('#logs', "The detector reports stopped");
      $("#results").html("");
    });

    //Add a callback to receive the results from processing an image.
    //The faces object contains the list of the faces detected in an image.
    //Faces object contains probabilities for all the different expressions, emotions and appearance metrics
    this.detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
      $('#results').html("");
      this.log('#results', "Timestamp: " + timestamp.toFixed(2));
      this.log('#results', "Number of faces found: " + faces.length);
      if (faces.length > 0) {
        this.log('#results', "Appearance: " + JSON.stringify(faces[0].appearance));
        this.log('#results', "Emotions: " + JSON.stringify(faces[0].emotions, function(key, val) {
          return val.toFixed ? Number(val.toFixed(0)) : val;
        }));
        this.log('#results', "Expressions: " + JSON.stringify(faces[0].expressions, function(key, val) {
          return val.toFixed ? Number(val.toFixed(0)) : val;
        }));
        this.log('#results', "Emoji: " + faces[0].emojis.dominantEmoji);
        if($('#face_video_canvas')[0] != null)
          this.drawFeaturePoints(image, faces[0].featurePoints);
      }
    });

    //Draw the detected facial feature points on the image
    this.drawFeaturePoints=this.drawFeaturePoints();
  }

  drawFeaturePoints(img, featurePoints) {
    var contxt = $('#face_video_canvas')[0].getContext('2d');

    var hRatio = contxt.canvas.width / img.width;
    var vRatio = contxt.canvas.height / img.height;
    var ratio = Math.min(hRatio, vRatio);

    contxt.strokeStyle = "#FFFFFF";
    for (var id in featurePoints) {
      contxt.beginPath();
      contxt.arc(featurePoints[id].x,
        featurePoints[id].y, 2, 0, 2 * Math.PI);
      contxt.stroke();

    }
  }

  log (node_name, msg) {
    $(node_name).append("<span>" + msg + "</span><br />")
  };

  onStart() {
    if (this.detector && !this.detector.isRunning) {
      $("#logs").html("");
      this.detector.start();
    }
   // this.log('#logs', "Clicked the start button");
  }

  onStop() {
   // this.log('#logs', "Clicked the stop button");
    if (this.detector && this.detector.isRunning) {
      this.detector.removeEventListener();
      this.detector.stop();
    }
  };

  onReset() {
    // this.log('#logs', "Clicked the reset button");
    if (this.detector && this.detector.isRunning) {
      this.detector.reset();

      $('#results').html("");
    }
  };

  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
        <h1>ELIVIBES</h1>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8" id="affdex_elements" style={{width:'680px',height:'480px'}}>Hello</div>
            <div className="col-md-4">
              <div style={{height:'25em'}}>
                <strong>EMOTION TRACKING RESULTS</strong>
                <div id="results" style={{wordWrap:'break-word'}}></div>
              </div>
              <div>
                <strong>DETECTOR LOG MSGS</strong>
              </div>
              <div id="logs"></div>
            </div>
          </div>
          <div>
            <button id="start" onClick="onStart()">Start</button>
            <button id="stop" onClick="onStop()">Stop</button>
            <button id="reset" onClick="onReset()">Reset</button>
            <h3>Affectiva JS SDK CameraDetector to track different emotions.</h3>
            <p>
              <strong>Instructions</strong>

              Press the start button to start the detector.
              <br/> When a face is detected, the probabilities of the different emotions are written to the DOM.
              <br/> Press the stop button to end the detector.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
