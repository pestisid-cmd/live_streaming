
// AWS configuration: Replace placeholder values with your actual AWS credentials and settings
var aws_access_key="your_access_key_here" // Edit: Replace with your actual AWS access key
var aws_secret_key="your_secret_key_here" // Edit: Replace with your actual AWS secret key
var aws_stream_name="your_stream_name_here"   // Edit: Replace with your Kinesis Video Stream name
var aws_region="your_aws_region_here"     // Edit: Replace with your AWS region

// To update the AWS configuration
AWS.config.update({
    accessKeyId: aws_access_key, 
    secretAccessKey: aws_secret_key, 
    region: aws_region
});
  
// Create Amazon Kinesis Video Streams client
const kinesisVideo = new AWS.KinesisVideo({
    region: aws_region
});
  
// Parameters to describe the stream
const params = {
StreamName: aws_stream_name, 
APIName: 'GET_HLS_STREAMING_SESSION_URL'
};


// Function to display an error message on the webpage
function displayErrorMessage(message) {
    var errorMessageDiv = document.getElementById('errorMessage');
    errorMessageDiv.innerText = message;
    errorMessageDiv.style.display = 'block'; // Show the error message
}

  
// Function to fetch and set the HLS Streaming URL
function fetchHLSStreamingSessionURL() {
    kinesisVideo.getDataEndpoint(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            displayErrorMessage("Network Error: Unable to fetch stream. Please check your connection and try again.");
        }
        else {
            const endpoint = data.DataEndpoint;
            // Use the endpoint to create a new KinesisVideoArchivedMedia client
            const kinesisVideoArchivedMedia = new AWS.KinesisVideoArchivedMedia({
                endpoint: endpoint,
                region: aws_region 
            });

            const hlsParams = {
                StreamName: aws_stream_name, 
                PlaybackMode: "LIVE"
                // other parameters as needed
            };

            // Get HLS Streaming Session URL
            kinesisVideoArchivedMedia.getHLSStreamingSessionURL(hlsParams, function(err, data) {
                if (err){
                    displayErrorMessage("Network Error: Unable to fetch stream. Please check your connection and try again.");
                    console.log(err, err.stack); // an error occurred
                }
                else {
                    // Now that we have the HLS URL, set it as the video source
                    initializeVideoPlayer(data.HLSStreamingSessionURL);
                }
            });
        }
    });
}

// Call the function to fetch the HLS URL
fetchHLSStreamingSessionURL();

// Function to initialize the video player
function initializeVideoPlayer(videoSrc) {
    var video = document.getElementById('videoPlayer');

    if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', function() {
            video.play();
        });
    }
}


