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

    const workFile = document.getElementById("docFile").files[0];
    const receiptFile = document.getElementById("receiptFile").files[0];

    if(!workFile || !receiptFile){
      e.preventDefault();
      alert("Tenés que adjuntar el trabajo y el comprobante de pago.");
      return;
    }

    const workAllowed = ["pdf","doc","docx","odt","rtf","txt"];
    const receiptAllowed = ["pdf","jpg","jpeg","png"];

    const workExt = (workFile.name.split(".").pop() || "").toLowerCase();
    const receiptExt = (receiptFile.name.split(".").pop() || "").toLowerCase();

    if(!workAllowed.includes(workExt)){
      e.preventDefault();
      alert("Formato del trabajo no admitido. Usá PDF, DOC, DOCX, ODT, RTF o TXT.");
      return;
    }

    if(!receiptAllowed.includes(receiptExt)){
      e.preventDefault();
      alert("Formato del comprobante no admitido. Usá PDF, JPG, JPEG o PNG.");
      return;
    }

    if(workFile.size > 10 * 1024 * 1024 || receiptFile.size > 10 * 1024 * 1024){
      e.preventDefault();
      alert("Cada archivo debe pesar como máximo 10 MB.");
      return;
    }

    e.preventDefault();

    const btn = document.getElementById("sendBtn");
    const status = document.getElementById("uploadStatus");
    btn.disabled = true;
    btn.textContent = "Preparando envío...";
    status.textContent = "Procesando archivos. No cierres esta página.";

    const readAsBase64 = file => new Promise((resolve,reject)=>{
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    Promise.all([readAsBase64(workFile), readAsBase64(receiptFile)])
      .then(([work64, receipt64]) => {
        document.getElementById("fileName").value = workFile.name;
        document.getElementById("fileType").value = workFile.type || "application/octet-stream";
        document.getElementById("fileBase64").value = work64;

        document.getElementById("receiptName").value = receiptFile.name;
        document.getElementById("receiptType").value = receiptFile.type || "application/octet-stream";
        document.getElementById("receiptBase64").value = receipt64;

        form.action = endpoint;
        btn.textContent = "Enviando...";
        form.submit();
      })
      .catch(() => {
        btn.disabled = false;
        btn.textContent = "Enviar trabajo y comprobante";
        status.textContent = "No se pudieron leer los archivos.";
      });
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  filterWorks();
  setupUploadForm();
});
