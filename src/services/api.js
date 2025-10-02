const API_URL = "https://woundkiller-ai.onrender.com";

// Upload wound image and analyze
export async function analyzeWound(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/analyze/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to analyze wound");
  }

  return response.json();
}

// Get healing progress history
export async function getProgress() {
  const response = await fetch(`${API_URL}/progress/`);
  if (!response.ok) {
    throw new Error("Failed to fetch progress");
  }
  return response.json();
}

// Add a doctor review
export async function addReview(doctor_name, feedback, rating) {
  const response = await fetch(`${API_URL}/reviews/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ doctor_name, feedback, rating }),
  });

  if (!response.ok) {
    throw new Error("Failed to add review");
  }

  return response.json();
}

// Get doctor reviews
export async function getReviews() {
  const response = await fetch(`${API_URL}/reviews/`);
  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }
  return response.json();
}
