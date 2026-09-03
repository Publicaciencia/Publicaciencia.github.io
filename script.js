const PUBLICA_CONFIG = {
  appsScriptWebAppUrl: "PEGAR_ACA_LA_URL_QUE_TERMINA_EN_EXEC"
};

function filterWorks(){
  const input=document.getElementById("workSearch");
  if(!input)return;
  const cards=[...document.querySelectorAll("[data-work]")];
  input.addEventListener("input",()=>{
    const q=input.value.toLowerCase().trim();
    cards.forEach(c=>c.style.display=c.innerText.toLowerCase().includes(q)?"":"none");
  });
}

function setupUploadForm(){
  const form=document.getElementById("uploadForm");
  if(!form)return;

  form.action=PUBLICA_CONFIG.appsScriptWebAppUrl;

  form.addEventListener("submit",e=>{
    if(PUBLICA_CONFIG.appsScriptWebAppUrl.includes("PEGAR_ACA")){
      e.preventDefault();
      alert("Falta configurar la URL del receptor.");
      return;
    }

    const f=document.getElementById("pdfFile").files[0];
    if(!f){e.preventDefault();return}

    if(f.size>10*1024*1024){
      e.preventDefault();
      alert("El PDF supera 10 MB.");
      return;
    }

    e.preventDefault();

    const btn=document.getElementById("sendBtn");
    btn.disabled=true;
    btn.textContent="Preparando envío...";

    const r=new FileReader();

    r.onload=()=>{
      document.getElementById("fileName").value=f.name;
      document.getElementById("fileType").value=f.type||"application/pdf";
      document.getElementById("fileBase64").value=String(r.result).split(",")[1];
      btn.textContent="Enviando...";
      form.submit();
    };

    r.readAsDataURL(f);
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  filterWorks();
  setupUploadForm();
});
