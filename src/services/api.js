const API_URL = "http://127.0.0.1:8000";

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
