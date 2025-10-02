const API_URL = "https://woundkiller-ai.onrender.com";

export async function uploadWoundImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/upload/`, {
    method: "POST",
    body: formData,
  });

  return response.json();
}

export async function getWoundRecords() {
  const response = await fetch(`${API_URL}/records/`);
  return response.json();
}
