
# Define the path where GStreamer plugins are located
export GST_PLUGIN_PATH=$(pwd)/build

# Define the library path for locally installed libraries
export LD_LIBRARY_PATH=$(pwd)/open-source/local/lib

# AWS configuration: Replace placeholder values with your actual AWS credentials and settings
export aws_access_key="your_access_key_here" # Edit: Replace with your actual AWS access key
export aws_secret_key="your_secret_key_here" # Edit: Replace with your actual AWS secret key
export aws_stream_name="your_stream_name_here"   # Edit: Replace with your Kinesis Video Stream name
export aws_region="your_aws_region_here"     # Edit: Replace with your AWS region

# Informing the user that the environment variables have been set
echo "Environment variables have been configured."

# Indicating that the system is ready to stream to Kinesis Video Stream
echo "Your webcam or RTSP stream is now set to be streamed to Kinesis Video Stream."



