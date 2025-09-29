// src/pages/LiveCamera.jsx
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { Camera, XCircle, AlertTriangle } from "lucide-react";

const LiveCamera = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        // Check if the browser supports getUserMedia
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("NO_MEDIA_DEVICES");
        }

        // Check if any video input devices are available
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        if (videoDevices.length === 0) {
          throw new Error("NO_CAMERA_FOUND");
        }

        console.log("Available video devices:", videoDevices.map(d => ({
          deviceId: d.deviceId,
          label: d.label
        })));

        // Test camera access
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });

        // Log stream information
        const videoTrack = stream.getVideoTracks()[0];
        console.log("Camera initialized:", {
          label: videoTrack.label,
          settings: videoTrack.getSettings()
        });

        stream.getTracks().forEach(track => track.stop());
        setIsLoading(false);
        setCameraReady(true);
      } catch (err) {
        console.error("Camera initialization error:", {
          name: err.name,
          message: err.message,
          stack: err.stack
        });

        let errorMessage = "Could not access the camera. ";
        
        switch(err.name) {
          case "NotAllowedError":
            errorMessage = "Camera access denied. Please allow camera access in your browser settings.";
            break;
          case "NotFoundError":
          case "NO_CAMERA_FOUND":
            errorMessage = "No camera found on your device. Please make sure your camera is properly connected.";
            break;
          case "NotReadableError":
            errorMessage = "Camera is already in use by another application. Please close other apps that might be using the camera.";
            break;
          case "NO_MEDIA_DEVICES":
            errorMessage = "Your browser doesn't support camera access. Please try using a modern browser.";
            break;
          case "OverconstrainedError":
            errorMessage = "Camera doesn't support the required resolution. Trying with default settings...";
            // Retry with default constraints
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ video: true });
              stream.getTracks().forEach(track => track.stop());
              setIsLoading(false);
              setCameraReady(true);
              return;
            } catch (retryErr) {
              errorMessage = "Could not initialize camera with default settings.";
            }
            break;
          default:
            errorMessage += "Error details: " + (err.message || "Unknown error");
        }

        setError(errorMessage);
        setIsLoading(false);
      }
    };

    initializeCamera();

    return () => {
      // Cleanup: ensure camera is stopped when component unmounts
      if (webcamRef.current) {
        const stream = webcamRef.current.video?.srcObject;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, []);

  const capturePhoto = async () => {
    try {
      setIsLoading(true);
      
      if (!webcamRef.current) {
        throw new Error("Camera not initialized");
      }

      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error("Failed to capture photo");
      }

      // Wait a bit to show the loading state
      await new Promise(resolve => setTimeout(resolve, 500));

      // Stop the camera stream before navigating
      const stream = webcamRef.current.video?.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      navigate("/wound-analysis", { 
        state: { 
          photo: imageSrc,
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error("Capture error:", err);
      setError("Failed to capture photo. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Take a Live Photo</h1>
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <XCircle className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {error ? (
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Camera Error</h2>
            <div className="bg-red-50 p-4 rounded-lg mb-6">
              <p className="text-red-800 font-medium mb-2">Error Details:</p>
              <p className="text-red-700">{error}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
              <p className="text-yellow-800 font-medium mb-2">Troubleshooting Steps:</p>
              <ul className="text-yellow-700 text-left list-disc list-inside space-y-2">
                <li>Check if your camera is properly connected</li>
                <li>Allow camera access in your browser settings</li>
                <li>Close other applications that might be using the camera</li>
                <li>Try refreshing the page</li>
                <li>Try using a different browser</li>
              </ul>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  setCameraReady(false);
                  // Force a clean reload of the camera
                  if (webcamRef.current) {
                    const stream = webcamRef.current.video?.srcObject;
                    if (stream) {
                      stream.getTracks().forEach(track => track.stop());
                    }
                  }
                  window.location.reload();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Go Back
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-black rounded-lg overflow-hidden mb-6 relative">
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
                    <p>Initializing camera...</p>
                  </div>
                </div>
              )}

              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-auto"
                videoConstraints={{
                  facingMode: "environment",
                  width: { ideal: 1920 },
                  height: { ideal: 1080 },
                }}
                onUserMedia={() => {
                  setIsLoading(false);
                  setCameraReady(true);
                }}
                onUserMediaError={(err) => {
                  console.error("Webcam error:", err);
                  setError("Failed to start camera. Please try again.");
                  setIsLoading(false);
                }}
              />
            </div>

            <button
              onClick={capturePhoto}
              disabled={!isCameraReady || isLoading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Camera className="w-5 h-5" />
              <span>Capture & Analyze</span>
            </button>

            <p className="text-sm text-gray-500 text-center mt-4">
              Position your wound clearly in the frame and ensure good lighting
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveCamera;