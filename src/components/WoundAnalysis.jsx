import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle,
  Calendar,
  Camera,
  ArrowLeft,
  TrendingUp,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const WoundAnalysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const capturedPhoto = location.state?.photo;

  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  let called = false; // <-- guard flag

  if (capturedPhoto && !called) {
    called = true;
    const sendToBackend = async () => {
      try {
        const formData = new FormData();
        const blob = await fetch(capturedPhoto).then((r) => r.blob());
        formData.append("file", blob, "wound.jpg");

        const res = await axios.post("http://127.0.0.1:8000/analyze/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Backend response:", res.data);
        setAnalysisData(res.data);
      } catch (err) {
        console.error("Error analyzing photo:", err);
      } finally {
        setLoading(false);
      }
    };

    sendToBackend();
  }
}, [capturedPhoto]);


  if (loading) {
    return <p>Analyzing photo... ⏳</p>;
  }

  if (!analysisData) {
    return <p>Error analyzing photo. Please try again.</p>;
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 mb-4"
      >
        <ArrowLeft className="mr-2" size={18} /> Back
      </button>

      <h2 className="text-xl font-bold mb-4">Analyzed Photo</h2>
      <img
        src={capturedPhoto}
        alt="Captured wound"
        className="w-64 h-64 object-cover rounded-lg mb-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Healing Progress */}
        <div className="p-4 border rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Healing Progress</h3>
          <p><strong>Healing %:</strong> {analysisData.healing_percent}%</p>
          <p><strong>Wound Size:</strong> {analysisData.wound_size}</p>
          <p><strong>Stage:</strong> {analysisData.stage}</p>
          <p><strong>Risk:</strong> {analysisData.risk}</p>
        </div>

        {/* Recommendations */}
        <div className="p-4 border rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
          <ul className="list-disc pl-5">
            {analysisData.recommendations?.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
          <p className="mt-2 flex items-center text-blue-600">
            <Calendar className="mr-2" size={16} /> Next Check:{" "}
            {analysisData.next_check}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WoundAnalysis;
