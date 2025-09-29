import React, { useState } from "react";
import axios from "axios";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [doctor, setDoctor] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("doctor", doctor);

    await axios.post("http://127.0.0.1:8000/upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("File uploaded successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded-lg">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
      <input type="text" placeholder="Doctor Name" value={doctor} onChange={(e) => setDoctor(e.target.value)} required />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>
    </form>
  );
};

export default UploadForm;
