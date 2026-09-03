const CONFIG = {
  email: "TU_CORREO@ejemplo.com",
  paymentUrl: "TU_LINK_DE_MERCADO_PAGO",
  siteUrl: "https://pavolinkjose-code.github.io/"
};

function setConfigLinks(){
  document.querySelectorAll("[data-email]").forEach(el=>{
    el.textContent = CONFIG.email;
    el.href = `mailto:${CONFIG.email}`;
  });
  document.querySelectorAll("[data-payment]").forEach(el=>{
    el.href = CONFIG.paymentUrl;
  });
}

function filterWorks(){
  const input = document.getElementById("workSearch");
  if(!input) return;
  const cards = [...document.querySelectorAll("[data-work]")];
  input.addEventListener("input",()=>{
    const q = input.value.toLowerCase().trim();
    cards.forEach(card=>{
      const text = card.innerText.toLowerCase();
      card.style.display = text.includes(q) ? "" : "none";
    });
  });
}

function submissionMail(){
  const f = document.getElementById("submissionForm");
  if(!f) return;
  f.addEventListener("submit",(e)=>{
    e.preventDefault();
    const data = new FormData(f);
    const subject = encodeURIComponent(`Envío para PUBLICA: ${data.get("titulo") || "Nuevo trabajo"}`);
    const body = encodeURIComponent(
`Nombre: ${data.get("nombre") || ""}
Título: ${data.get("titulo") || ""}
Área: ${data.get("area") || ""}
Extensión: ${data.get("paginas") || ""} páginas

Adjuntar al correo:
- Archivo final en PDF
- Comprobante de pago, si corresponde
- Declaración de autoría y responsabilidad

Mensaje:
${data.get("mensaje") || ""}`
    );
    window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  setConfigLinks();
  filterWorks();
  submissionMail();
});
