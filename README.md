<h1 align="center">
  Live Video Streaming Solution
  <br>
</h1>

<h4 align="center"> A software module that facilitates live video streaming from an IP camera or Webcam to Amazon Kinesis Video Streams, and is also viewable through a web player interface, which captures both live streaming and supports playback (upto 24hrs)</h4>

<p align="center">
  <a href="#introduction">Introduction</a> •
  <a href="#build">Build</a> •
  <a href="#run">Run</a> •
  <a href="#streaming-video-to-amazon-kinesis-video-streams">Video Player</a> •
  <a href="#related">Related</a> 
</p>

## Introduction

The project offers a straightforward solution for streaming live video from IP or web cameras to Amazon Kinesis Video Streams. Utilizing the AWS Kinesis Video Streams SDK for C/C++ and Gstreamer, it enables users to broadcast live footage. The project leverages the HLS (HTTP Live Streaming) protocol for video streaming, allowing for real-time viewing and playback in a web player created with basic HTML and JavaScript. This approach not only supports live streaming but also enables video playback with up to 24 hours of retention, making it ideal for a variety of applications, from surveillance to event broadcasting.

## Build

### Environment Requirements
This project is designed and tested in an Ubuntu environment. The setup instructions provided herein are tailored for users operating within Ubuntu. While the project may be adaptable to other UNIX-like environments, the commands and procedures have been optimized for Ubuntu and might require adjustments for compatibility with other systems.

### Pre-Setup Requirements
Before proceeding with the setup instructions, please ensure you have completed the following steps on AWS:
#### AWS Kinesis Video Stream

* Create a Kinesis Video Stream: Ensure you have created an Amazon Kinesis Video Stream in your AWS account. This stream will be used for broadcasting live video from your IP or web camera.

* Stream Name: Note down the name of your Kinesis Video Stream. You will need this name to configure your environment or application correctly.

#### AWS Credentials

* Generate AWS Access Key and Secret Key: If you haven't already, generate an AWS access key and secret key pair in your AWS IAM console. These credentials are required for authenticating your application with AWS services.
  * Navigate to the AWS IAM console.
  * Create a new user or select an existing user.
  * Under the "Security credentials" tab, create a new access key.
  * Save the access key ID and secret access key in a secure location.

#### Reminder
Please ensure you have:
* Created your Amazon Kinesis Video Stream and noted its name.
* Generated your AWS access key and secret key, and have them ready for use.

### Setting up the environment
- Before installing any package, it's a good practice to update your package lists. Open a terminal and execute the following command:  
  ```
  sudo apt-get update
  ```

- #### Install Required Packages 
  Install all the necessary packages listed in apt-requirements.txt by running the following command:  
  ```
  sudo xargs -a apt-requirements.txt apt-get install -y
  ```

- #### Clone the Amazon Kinesis Video Streams Producer SDK C++ Repository
  The project utilizes the Amazon Kinesis Video Streams Producer SDK C++ for video streaming. Clone the SDK repository from GitHub to your local machine:  
  ```
  git clone https://github.com/awslabs/amazon-kinesis-video-streams-producer-sdk-cpp.git
  ```


### Configuration and Building the SDK
#### Prepare the Build Directory

Once you have cloned the Amazon Kinesis Video Streams Producer SDK C++, the next step is to navigate into the SDK's root directory. Inside this directory, you will create a `build` directory that will house the compiled SDK and any temporary files generated during the build process.

Follow these steps to prepare your build environment:

1. Navigate to the SDK Directory:  
  First, change into the directory of the cloned SDK repository.
    ```
    cd amazon-kinesis-video-streams-producer-sdk-cpp
    ```
2. Create and Enter the Build Directory:  
  Inside the SDK directory, create a new directory named build and then change into this new directory.
    ```
    mkdir -p build
    cd build
    ```

#### Building the SDK
With the build directory now ready, proceed with compiling the SDK by running the following cmake command within the build directory. This command configures the SDK to include GStreamer plugin support and enables JNI (Java Native Interface), essential for the project's functionality.
```
cmake .. -DBUILD_GSTREAMER_PLUGIN=ON -DBUILD_JNI=TRUE
```

### Compiling 

After running cmake, in the same build directory run `make`:

```
make
```


In your build directory you will now have shared objects for all the targets you have selected.


## Run

### Setting Environment Variables

After the SDK has been built, the next critical step involves setting up the environment variables necessary for your project's operation. To accurately set these variables, it's essential to be in the root directory of the cloned SDK, not inside the **build** directory.
#### Navigate to the SDK Root Directory

If you are currently in the build directory from the previous building steps, you need to step back to the root directory of the SDK. You can do this by executing:
```
cd ..
```
This command will take you one level up, placing you in the root directory of the cloned SDK repository.

#### Editing the Script

1. Locate the Shell Script: Find the **set-env-variables.sh** script in the project directory.

2. Edit Placeholder Values: Open this script in a text editor of your choice. Carefully replace the placeholder values with your actual AWS Access Key, Secret Key, Stream Name, and AWS Region.   
    * Pay attention to comments marked with "# Edit:" for guidance on which values need to be updated. Remember to save your changes before closing the editor.

### Running the Script

With the script edited to include your AWS details:

#### Make the Script Executable (if not already done so):
1. #### Make the Script Executable:
    First, ensure that the script is executable. If you haven't already done so, you can make it executable using a relative path to reference the script from the SDK directory. Assuming the SDK is cloned directly inside your project directory, you would run:
    ```
    chmod +x ../set-env-variables.sh
    ```
2. #### Execute the Script: 
    Now, execute the script by referencing it with the appropriate path. Still inside the SDK directory, run:
    ```
    source ../set-env-variables.sh
    ```
This command runs the set-env-variables.sh script from the SDK directory, setting up your environment variables as defined. It configures paths for GStreamer plugins, library paths for locally installed libraries, and AWS credentials necessary for the project.

Keep in mind that the environment variables set by this script are valid for the current terminal session only. If you open a new terminal or session, you'll need to rerun the script to set these variables again.

Now if you execute `gst-inspect-1.0 kvssink` you should get information on the plugin like

```text
Factory Details:
  Rank                     primary + 10 (266)
  Long-name                KVS Sink
  Klass                    Sink/Video/Network
  Description              GStreamer AWS KVS plugin
  Author                   AWS KVS <kinesis-video-support@amazon.com>

Plugin Details:
  Name                     kvssink
  Description              GStreamer AWS KVS plugin
  Filename                 /Users/seaduboi/workspaces/amazon-kinesis-video-streams-producer-sdk-cpp/build/libgstkvssink.so
  Version                  1.0
  License                  Proprietary
  Source module            kvssinkpackage
  Binary package           GStreamer
  Origin URL               http://gstreamer.net
```

If the build failed, or `GST_PLUGIN_PATH` is not properly set you will get output like

```text
No such element or plugin 'kvssink'
```

### Streaming Video to Amazon Kinesis Video Streams
This project supports streaming video from two sources: an RTSP camera and a USB web camera. Depending on your setup, you can choose the appropriate command to stream your video feed to Amazon Kinesis Video Streams.

    Before running the command, please make sure you are inside the 'build' directory.

#### Option 1: Streaming from a USB Web Camera
To stream video from a USB web camera connected to your computer, utilize the following GStreamer command. This setup is typically recognized by your system as /dev/video0 (adjust if your device differs).

Verify that your USB camera is recognized by your system (typically as /dev/video0). You can list connected video devices using `ls /dev/video*`
```
gst-launch-1.0 v4l2src do-timestamp=TRUE device=/dev/video0 ! videoconvert ! video/x-raw,format=I420,width=640,height=480,framerate=30/1 ! x264enc bframes=0 key-int-max=45 bitrate=500 ! video/x-h264,stream-format=avc,alignment=au,profile=baseline ! kvssink stream-name=$aws_stream_name storage-size=512 access-key=$aws_access_key secret-key=$aws_secret_key aws-region=$aws_region
```

#### Option 2: Streaming from an RTSP Camera

If you have an RTSP camera, use the following GStreamer pipeline to stream its video feed. Replace "rtsp://YourCameraRtspUrl" with your camera's actual RTSP URL.
```
gst-launch-1.0 rtspsrc location="rtsp://YourCameraRtspUrl" short-header=TRUE ! rtph264depay ! video/x-h264, format=avc,alignment=au ! kvssink stream-name=$aws_stream_name storage-size=512 access-key=$aws_access_key secret-key=$aws_secret_key aws-region=$aws_region
```

### Streaming the video from the Web Player
#### Configuring subscriber.js
Before proceeding to the next steps of running the application, it's crucial to configure the subscriber.js file with your actual AWS credentials and streaming details. Look for the "**#Edit:**" comments in the file as your guide to replace placeholders with real values. Follow these instructions to ensure your application connects to AWS services correctly:

1. Open **subscriber.js**: Locate the subscriber.js file within your project directory and open it in a text editor of your choice.

2. Identify and Replace Placeholders:  
Look for "**#Edit:**" Comments: Each placeholder that needs to be replaced is clearly marked with a comment that begins with #Edit:. This is your cue to replace the subsequent placeholder with your actual data.

3. Save Your Changes: After you've replaced all placeholders with your actual information, don't forget to save the subscriber.js file.

    #### Security Reminder
    Keep your AWS credentials confidential to prevent unauthorized access. Do not commit the subscriber.js file with real credentials to public repositories or share it without proper security measures in place.

#### Accessing the Web Player
After setting up the environment and ensuring that all necessary configurations are in place, you can access the web player through the **index.html** file provided in the project directory. There are two straightforward methods to open this file and start streaming video content.

**Method 1**: Direct Opening
You can directly open the **index.html** file using any web browser. Navigate to the file location in your file explorer, and open it with your preferred web browser. This method does not require using the shell or terminal.

**Method 2**: Using the Shell
For users on an Ubuntu server or those who prefer using the shell, the **index.html** file can also be opened in the default web browser through a shell command. Navigate to the directory containing **index.html** file and use the following command:



## Related
* [What Is Amazon Kinesis Video Streams](https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/what-is-kinesis-video.html)
* [C SDK](https://github.com/awslabs/amazon-kinesis-video-streams-producer-c)
* [Example: Kinesis Video Streams Producer SDK GStreamer Plugin](https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/examples-gstreamer-plugin.html)
* [HTTP Live Streaming (HLS)](https://developer.apple.com/streaming/)


