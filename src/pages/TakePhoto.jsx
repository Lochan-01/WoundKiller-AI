// src/pages/TakePhoto.jsx
import React, { useState } from "react";
import { Camera, Upload, Info, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TakePhoto = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError(null);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size too large. Please select an image under 5MB');
      }

      const photoUrl = URL.createObjectURL(file);
      
      // Wait a bit to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      navigate("/wound-analysis", {
        state: { 
          photo: photoUrl,
          timestamp: new Date().toISOString()
        },
      });
    } catch (err) {
      setError(err.message);
      console.error('File selection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const photoGuidelines = [
    "Ensure good lighting - natural light works best",
    "Keep the camera steady and focused",
    "Include a ruler or coin for size reference",
    "Take photos from the same angle each time",
    "Clean the wound area before photographing",
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto relative">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-700">Processing your photo...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Wound Photo Analysis
        </h1>
        <p className="text-gray-600">
          Upload a photo or take one live for AI-powered wound assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Choose Method
            </h2>

            <div className="flex flex-col gap-4">
              {/* Live Camera */}
              <button
                onClick={() => navigate("/live-camera")}
                className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Camera className="w-5 h-5 mr-2" />
                Take Live Photo
              </button>

              {/* Upload */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload File
              </label>
            </div>
          </div>
        </div>

        {/* Right side - Guidelines */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Photo Guidelines
            </h2>
            <div className="space-y-3">
              {photoGuidelines.map((guideline, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <p className="text-gray-700">{guideline}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">
                  Important Notice
                </h3>
                <p className="text-yellow-700 text-sm">
                  This AI analysis provides guidance but doesn’t replace medical
                  advice. Contact your doctor for urgent concerns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakePhoto;