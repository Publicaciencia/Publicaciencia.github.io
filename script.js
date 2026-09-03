const PUBLICA_CONFIG = {
  appsScriptWebAppUrl: "https://script.google.com/macros/s/AKfycbyrmv4Tu8yxm1yT_3u5wqNIT9uyWU_l6fiDgXKLNCij5_7d-7pVMgFCoOsLL8qVfWex/exec"
};

function filterWorks(){
  const input = document.getElementById("workSearch");
  if(!input) return;
  const cards = [...document.querySelectorAll("[data-work]")];
  input.addEventListener("input",()=>{
    const q = input.value.toLowerCase().trim();
    cards.forEach(card=>{
      card.style.display = card.innerText.toLowerCase().includes(q) ? "" : "none";
    });
  });
}

function setupUploadForm(){
  const form = document.getElementById("uploadForm");
  if(!form) return;

  form.addEventListener("submit", e => {
    const endpoint = PUBLICA_CONFIG.appsScriptWebAppUrl;

    const file = document.getElementById("docFile").files[0];
    if(!file){
      e.preventDefault();
      return;
    }

    const allowed = ["pdf","doc","docx","odt","rtf","txt"];
    const ext = (file.name.split(".").pop() || "").toLowerCase();

    if(!allowed.includes(ext)){
      e.preventDefault();
      alert("Formato no admitido. Usá PDF, DOC, DOCX, ODT, RTF o TXT.");
      return;
    }

    if(file.size > 10 * 1024 * 1024){
      e.preventDefault();
      alert("El archivo supera el límite de 10 MB.");
      return;
    }

    e.preventDefault();

    const btn = document.getElementById("sendBtn");
    const status = document.getElementById("uploadStatus");
    btn.disabled = true;
    btn.textContent = "Preparando envío...";
    status.textContent = "Procesando el archivo. No cierres esta página.";

    const reader = new FileReader();

    reader.onload = () => {
      document.getElementById("fileName").value = file.name;
      document.getElementById("fileType").value = file.type || "application/octet-stream";
      document.getElementById("fileBase64").value = String(reader.result).split(",")[1];

      form.action = endpoint;
      btn.textContent = "Enviando...";
      form.submit();
    };

    reader.onerror = () => {
      btn.disabled = false;
      btn.textContent = "Enviar trabajo";
      status.textContent = "No se pudo leer el archivo.";
    };

    reader.readAsDataURL(file);
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  filterWorks();
  setupUploadForm();
});
