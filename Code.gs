const CONFIG = {
  DESTINO_EMAIL: "pavolinkjose@gmail.com",
  MAX_BYTES: 10 * 1024 * 1024,
  EXTENSIONES: ["pdf","doc","docx","odt","rtf","txt"]
};

function doGet() {
  return HtmlService.createHtmlOutput("<h2>PUBLICA</h2><p>Receptor de envíos activo.</p>");
}

function doPost(e) {
  try {
    const p = (e && e.parameter) ? e.parameter : {};

    if (!p.nombre || !p.email || !p.titulo || !p.resumen || !p.file_base64 || !p.file_name || !p.receipt_base64 || !p.receipt_name) {
      return respuesta("Faltan datos obligatorios.", false);
    }

    if (String(p.declaracion) !== "SI") {
      return respuesta("Falta aceptar la declaración de autoría y responsabilidad.", false);
    }

    const extension = String(p.file_name).split(".").pop().toLowerCase();
    if (!CONFIG.EXTENSIONES.includes(extension)) {
      return respuesta("Formato de archivo no admitido.", false);
    }

    const bytes = Utilities.base64Decode(p.file_base64);
    if (bytes.length > CONFIG.MAX_BYTES) {
      return respuesta("El archivo supera el límite de 10 MB.", false);
    }

    const mime = p.file_type || mimePorExtension(extension);
    const nombreArchivo = limpiarNombre(p.file_name);
    const adjunto = Utilities.newBlob(bytes, mime, nombreArchivo);

    const receiptExt = String(p.receipt_name).split(".").pop().toLowerCase();
    const receiptAllowed = ["pdf","jpg","jpeg","png"];
    if (!receiptAllowed.includes(receiptExt)) {
      return respuesta("Formato de comprobante no admitido.", false);
    }

    const receiptBytes = Utilities.base64Decode(p.receipt_base64);
    if (receiptBytes.length > CONFIG.MAX_BYTES) {
      return respuesta("El comprobante supera el límite de 10 MB.", false);
    }

    const receiptMime = p.receipt_type || mimeComprobante(receiptExt);
    const receiptName = limpiarNombre(p.receipt_name);
    const comprobante = Utilities.newBlob(receiptBytes, receiptMime, receiptName);

    const cuerpo = [
      "Nuevo envío a PUBLICA",
      "",
      "Autor: " + p.nombre,
      "Correo del autor: " + p.email,
      "Título: " + p.titulo,
      "Área: " + (p.area || ""),
      "Páginas: " + (p.paginas || ""),
      "Palabras clave: " + (p.palabras_clave || ""),
      "",
      "Resumen:",
      p.resumen,
      "",
      "Trabajo adjunto: " + nombreArchivo,
      "Comprobante adjunto: " + receiptName
    ].join("\\n");

    MailApp.sendEmail({
      to: CONFIG.DESTINO_EMAIL,
      subject: "PUBLICA - Nuevo trabajo: " + p.titulo,
      body: cuerpo,
      replyTo: p.email,
      attachments: [adjunto, comprobante]
    });

    return respuesta("El trabajo fue enviado correctamente a PUBLICA.", true);

  } catch (err) {
    return respuesta("No se pudo completar el envío: " + err.message, false);
  }
}

function limpiarNombre(nombre) {
  return String(nombre || "trabajo")
    .replace(/[\\\\/:*?"<>|#%{}~&]/g, "-")
    .replace(/\\s+/g, " ")
    .trim()
    .slice(0, 150);
}

function mimePorExtension(ext) {
  const mapa = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    odt: "application/vnd.oasis.opendocument.text",
    rtf: "application/rtf",
    txt: "text/plain"
  };
  return mapa[ext] || "application/octet-stream";
}


function mimeComprobante(ext) {
  const mapa = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png"
  };
  return mapa[ext] || "application/octet-stream";
}

function respuesta(mensaje, ok) {
  const borde = ok ? "#157347" : "#b42318";
  return HtmlService.createHtmlOutput(`
    <!doctype html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>PUBLICA</title>
    </head>
    <body style="font-family:Arial,sans-serif;background:#f4f6f8;padding:40px">
      <div style="max-width:700px;margin:auto;background:#fff;padding:30px;border-radius:16px;border-left:4px solid ${borde}">
        <h1>PUBLICA</h1>
        <p>${mensaje}</p>
        <a href="https://pavolinkjose-code.github.io/">Volver a PUBLICA</a>
      </div>
    </body>
    </html>
  `);
}
