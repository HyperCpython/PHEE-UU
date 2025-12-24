const form = document.getElementById("uploadForm");
const message = document.getElementById("message");
const loader = document.getElementById("loader");

form.addEventListener("submit", async e => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const filesInput = document.getElementById("file");
  const files = filesInput.files;

  if (!name || files.length === 0) {
    message.textContent = "❌ Please fill all fields";
    return;
  }

  loader.style.display = "block";
  message.textContent = "";

  const filesArray = [];

  for (let file of files) {
    const base64 = await toBase64(file);
    filesArray.push({
      name: file.name,
      type: file.type,
      data: base64
    });
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("files", JSON.stringify(filesArray));

  const response = await fetch("https://script.google.com/macros/s/AKfycbymPemlFxxxdUSAhJzr3QSmt9WdoICmMH9_DQ5h1p040n90KHVo0NLQ8FFFCTFkfIld/exec", {
    method: "POST",
    body: formData
  });

  const result = await response.json();

  loader.style.display = "none";
  message.textContent = result.message;
});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
