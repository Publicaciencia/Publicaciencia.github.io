const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyrmv4Tu8yxm1yT_3u5wqNIT9uyWU_l6fiDgXKLNCij5_7d-7pVMgFCoOsLL8qVfWex/exec";

const MAX_BYTES = 10 * 1024 * 1024;

const publications = [
  {
    title: "Lo sustituible y lo irreemplazable",
    author: "José Luis Pavolink",
    area: "Sociología",
    url: "lo-sustituible-y-lo-irreemplazable.html",
    pdf: "lo-sustituible-y-lo-irreemplazable.pdf"
  },
  {
    title: "Menos hijos en la Provincia de Buenos Aires",
    author: "José Luis Pavolink",
    area: "Demografía social",
    url: "menos-hijos-provincia-buenos-aires.html"
  }
];

function renderPublications() {
  const box = document.getElementById("publication-list");
  if (!box) return;

  box.innerHTML = publications.map(p => `
    <article class="card">
      <div class="note">${p.area}</div>
      <h3><a href="${p.url}">${p.title}</a></h3>
      <p>${p.author}</p>
      <p>
        <a href="${p.url}">Ver publicación</a>
        ${p.pdf ? ` · <a href="${p.pdf}">PDF</a>` : ""}
      </p>
    </article>
  `).join("");
}

function submitToAppsScript(fields) {
  const f = document.createElement("form");
  f.method = "POST";
  f.action = WEB_APP_URL;
  f.acceptCharset = "UTF-8";
  f.style.display = "none";

  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value ?? "";
    f.appendChild(input);
  }

  document.body.appendChild(f);
  f.submit();
}

function setupSubmissionForm() {
  const form = document.getElementById("paper-form");
  if (!form) return;

  const status = document.getElementById("form-status");
  const button = document.getElementById("submit-btn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const file = document.getElementById("pdf")?.files?.[0];
    const author = document.getElementById("author")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const title = document.getElementById("title")?.value.trim();
    const abstract = document.getElementById("abstract")?.value.trim();
    const declaracion = document.getElementById("declaracion");

    if (!author || !email || !title || !file) {
      status.textContent = "Completá autor, correo, título y PDF.";
      return;
    }

    if (!declaracion?.checked) {
      status.textContent = "Debés aceptar la declaración de autoría y responsabilidad.";
      return;
    }

    if (file.type && file.type !== "application/pdf") {
      status.textContent = "El archivo debe ser PDF.";
      return;
    }

    if (file.size > MAX_BYTES) {
      status.textContent = "El PDF supera el límite de 10 MB.";
      return;
    }

    button.disabled = true;
    status.textContent = "Preparando el PDF...";

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const base64 = String(reader.result).split(",")[1];
        if (!base64) throw new Error("PDF vacío");

        status.textContent = "Enviando trabajo...";

        submitToAppsScript({
          nombre: author,
          email: email,
          titulo: title,
          area: "",
          paginas: "",
          palabras_clave: "",
          resumen: abstract || "Sin resumen informado.",
          declaracion: "si",
          acepta_declaracion: "si",
          declaracion_autoria: "si",
          responsabilidad: "si",
          file_base64: base64,
          file_name: file.name
        });
      } catch (err) {
        button.disabled = false;
        status.textContent = "No se pudo preparar el PDF.";
      }
    };

    reader.onerror = () => {
      button.disabled = false;
      status.textContent = "No se pudo leer el PDF.";
    };

    reader.readAsDataURL(file);
  });
}

renderPublications();
setupSubmissionForm();
