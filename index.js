      // SDK Needs to create video and canvas nodes in the DOM in order to function
      // Here we are adding those nodes a predefined div.
      var divRoot = $("#affdex_elements")[0];
      var width = 656;
      var height = 480;
      var songPlaying='1';
      var song=0;
      var faceMode = affdex.FaceDetectorMode.LARGE_FACES;
      //Construct a CameraDetector and specify the image width / height and face detector mode.
      var detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

      //Enable detection of all Expressions, Emotions and Emojis classifiers.
      detector.detectAllEmotions();
      detector.detectAllExpressions();
      detector.detectAllEmojis();
      detector.detectAllAppearance();

      //Add a callback to notify when the detector is initialized and ready for runing.
      detector.addEventListener("onInitializeSuccess", function() {
        log('#logs', "The detector reports initialized");
        //Display canvas instead of video feed because we want to draw the feature points on it
        $("#face_video_canvas").css("display", "block");
        $("#face_video").css("display", "none");
      });

      function log(node_name, msg) {
        $(node_name).append("<span>" + msg + "</span><br />")
      }

      //function executes when Start button is pushed.
      function onStart() {
        if (detector && !detector.isRunning) {
          $("#logs").html("");
          detector.start();
        }
        log('#logs', "Clicked the start button");
      }

      //function executes when the Stop button is pushed.
      function onStop() {
        log('#logs', "Clicked the stop button");
        if (detector && detector.isRunning) {
          detector.removeEventListener();
          detector.stop();
        }
      };

      //function executes when the Reset button is pushed.
      function onReset() {
        log('#logs', "Clicked the reset button");
        if (detector && detector.isRunning) {
          detector.reset();

          $('#results').html("");
        }
      };

      //Add a callback to notify when camera access is allowed
      detector.addEventListener("onWebcamConnectSuccess", function() {
        log('#logs', "Webcam access allowed");
      });

      //Add a callback to notify when camera access is denied
      detector.addEventListener("onWebcamConnectFailure", function() {
        log('#logs', "webcam denied");
        console.log("Webcam access denied");
      });

      //Add a callback to notify when detector is stopped
      detector.addEventListener("onStopSuccess", function() {
        log('#logs', "The detector reports stopped");
        $("#results").html("");
      });

      //Add a callback to receive the results from processing an image.
      //The faces object contains the list of the faces detected in an image.
      //Faces object contains probabilities for all the different expressions, emotions and appearance metrics
      detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
        $('#results').html("");
        $('#emoticon').html("");
        // log('#results', "Timestamp: " + timestamp.toFixed(2));
        // log('#results', "Number of faces found: " + faces.length);
        if (faces.length > 0) {


          // console.log(faces[0].emotions);
          var musicControl=document.getElementById('musicControl');
          var musicControlSource=document.getElementById('musicControlSource');

// musicControl.play();
//         setTimeout(
//               function(){
//
//             }, 5000);
//
//
//               musicControlSource.src='music/sad2.mp3';
//               musicControl.load();
//               musicControl.play();
//         setTimeout(
//             function(){
//
//           }, 10000);
//           musicControlSource.src='music/angry1.mp3';
//           musicControl.load();
//             musicControl.play();
//         setTimeout(
//             function(){
//
//         }, 20000);

          if(musicControl.currentTime>10){
            song=0;
          }

          if((musicControl.currentTime>10 || musicControl.currentTime==0)&&song==0){
            $.each(faces[0].emotions, function(key, value) {
                // console.log("key="+key+", value="+ value);console.log(
                if(key=='joy' && value>80){

                /*  if(value>80 && musicControl.duration > 0 && musicControl.paused){
                    // console.log(value);
                    console.log("In joy section");
                    setTimeout(
                        function(){
                          musicControl.play();
                      }, 1000);
                  }*/
                } else{
                if(key=='sadness'){
                  if(value>0.60 && musicControl.duration > 0 && (musicControl.currentTime>10 || musicControl.currentTime==0)  ){
                    // console.log(value);
                    console.log(songPlaying+" this");
                    song=1;
                    console.log("In sadness section");
                    if(songPlaying=='1'){
                      document.getElementById(songPlaying).classList.remove("active");
                      songPlaying='2';
                      document.getElementById(songPlaying).classList.add("active");
                      musicControlSource.src="music/sad2.mp3";
                    }
                    else if(songPlaying=='2'){
                      document.getElementById(songPlaying).classList.remove("active");
                      songPlaying='3';
                      document.getElementById(songPlaying).classList.add("active");
                      musicControlSource.src="music/sad3.mp3";
                    }
                    else{
                      document.getElementById(songPlaying).classList.remove("active");
                      songPlaying='1';
                      document.getElementById(songPlaying).classList.add("active");
                      musicControlSource.src=="music/sad.mp3"
                    }
                    musicControl.load();
                    setTimeout(
                        function(){
                            musicControl.play();
                      }, 1000);
                  }
                }
                if(key=='contempt' || key=='surprise' || key=='engagement'||key=='valence' || key=='fear' || key=='disgust'){
                  if(value>2 && musicControl.duration > 0 && (musicControl.currentTime>10 || musicControl.currentTime==0)){
                    // console.log(value);
                    console.log("In angry section");
                    song=1;
                    if(songPlaying=='4'){
                      document.getElementById(songPlaying).classList.remove("active");
                      songPlaying='5';
                      document.getElementById(songPlaying).classList.add("active");
                      musicControlSource.src="music/angry2.mp3";
                    }else if(songPlaying=='5'){
                      document.getElementById(songPlaying).classList.remove("active");
                      songPlaying='6';
                      document.getElementById(songPlaying).classList.add("active");
                      musicControlSource.src="music/angry3.mp3";
                    }else{
                      document.getElementById(songPlaying).classList.remove("active");
                      songPlaying='4';
                      document.getElementById(songPlaying).classList.add("active");
                      musicControlSource.src="music/angry.mp3";
                    }
                    musicControl.load();
                    setTimeout(
                        function(){
                          musicControl.play();
                      }, 1000);
                  }
                }
              }
            });
            // song=1;
          }
        // faces[0].emotions.fo(function(key,val){
        //   if(key=='sad'){
        //     console.log('sad='+key+' val='+val);
        //     if(val>50){
        //       console.log("Play ");
        //     }
        //   }
        // });
          // log('#results', "Appearance: " + JSON.stringify(faces[0].appearance));
          // log('#results', "Emotions: " + JSON.stringify(faces[0].emotions, function(key, val) {
            // console.log(val);
            // return val.toFixed ? Number(val.toFixed(0)) : val;
          // }));
          // log('#results', "Expressions: " + JSON.stringify(faces[0].expressions, function(key, val) {
            // return val.toFixed ? Number(val.toFixed(0)) : val;
          // }));
          // log('#results', "Emoji: " + faces[0].emojis.dominantEmoji);
          log('#emoticon',""+faces[0].emojis.dominantEmoji);

          drawFeaturePoints(image, faces[0].featurePoints);
        }
      });

      //Draw the detected facial feature points on the image
      function drawFeaturePoints(img, featurePoints) {
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
