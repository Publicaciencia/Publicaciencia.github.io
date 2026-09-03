const CONFIG = {
  DESTINO_EMAIL: "TU_CORREO",
  MAX_BYTES: 10 * 1024 * 1024
};

function doGet() {
  return HtmlService.createHtmlOutput("<h2>PUBLICA</h2><p>Receptor activo.</p>");
}

function doPost(e) {
  try {
    const p = e.parameter || {};

    if (!p.nombre || !p.email || !p.titulo || !p.resumen || !p.file_base64) {
      return HtmlService.createHtmlOutput("Faltan datos obligatorios.");
    }

    const bytes = Utilities.base64Decode(p.file_base64);

    if (bytes.length > CONFIG.MAX_BYTES) {
      return HtmlService.createHtmlOutput("El PDF supera el límite de 10 MB.");
    }

    const nombre = (p.file_name || "trabajo.pdf")
      .replace(/[\\/:*?"<>|#%{}~&]/g, "-");

    const pdf = Utilities.newBlob(bytes, "application/pdf", nombre);

    MailApp.sendEmail({
      to: CONFIG.DESTINO_EMAIL,
      subject: "PUBLICA - Nuevo trabajo: " + p.titulo,
      body:
        "Autor: " + p.nombre +
        "\nCorreo: " + p.email +
        "\nTítulo: " + p.titulo +
        "\nÁrea: " + (p.area || "") +
        "\nPáginas: " + (p.paginas || "") +
        "\nPalabras clave: " + (p.palabras_clave || "") +
        "\n\nResumen:\n" + p.resumen,
      replyTo: p.email,
      attachments: [pdf]
    });

    return HtmlService.createHtmlOutput(
      '<h2>PUBLICA</h2><p>El trabajo fue enviado correctamente.</p><p><a href="https://pavolinkjose-code.github.io/">Volver</a></p>'
    );

  } catch (err) {
    return HtmlService.createHtmlOutput("Error: " + err.message);
  }
}
