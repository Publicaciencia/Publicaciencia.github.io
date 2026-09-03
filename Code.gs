const CONFIG={
  DRIVE_FOLDER_ID:"TU_ID_CARPETA_DRIVE",
  NOTIFY_EMAIL:"TU_CORREO",
  MAX_BYTES:15*1024*1024
};

function doGet(){
  return HtmlService.createHtmlOutput("<h2>PUBLICA</h2><p>Receptor activo.</p>");
}

function doPost(e){
  try{
    const p=e.parameter;
    if(!p.nombre||!p.email||!p.titulo||!p.resumen||!p.file_base64)
      return respuesta("Faltan datos obligatorios.",false);
    if(String(p.declaracion)!=="SI")
      return respuesta("Falta aceptar la declaración.",false);

    const bytes=Utilities.base64Decode(p.file_base64);
    if(bytes.length>CONFIG.MAX_BYTES)
      return respuesta("El archivo supera el límite.",false);

    const folder=DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    const name=Utilities.formatDate(new Date(),Session.getScriptTimeZone(),"yyyyMMdd-HHmmss")+" - "+limpiar(p.nombre)+" - "+limpiar(p.titulo)+".pdf";
    const file=folder.createFile(Utilities.newBlob(bytes,"application/pdf",name));

    MailApp.sendEmail({
      to:CONFIG.NOTIFY_EMAIL,
      subject:"PUBLICA - Nuevo envío: "+p.titulo,
      body:"Autor: "+p.nombre+"\nCorreo: "+p.email+"\nTítulo: "+p.titulo+"\nÁrea: "+(p.area||"")+"\nPáginas: "+(p.paginas||"")+"\nPalabras clave: "+(p.palabras_clave||"")+"\n\nResumen:\n"+p.resumen+"\n\nArchivo:\n"+file.getUrl(),
      replyTo:p.email
    });

    return respuesta("El trabajo fue enviado correctamente.",true);
  }catch(err){
    return respuesta("No se pudo completar el envío: "+err.message,false);
  }
}

function limpiar(s){
  return String(s||"").replace(/[\\/:*?"<>|#%{}~&]/g,"-").replace(/\s+/g," ").trim().slice(0,100);
}

function respuesta(m,ok){
  return HtmlService.createHtmlOutput('<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="font-family:Arial;background:#f4f6f8;padding:40px"><div style="max-width:700px;margin:auto;background:white;padding:30px;border-radius:16px"><h1>PUBLICA</h1><p>'+m+'</p><a href="https://pavolinkjose-code.github.io/">Volver a PUBLICA</a></div></body></html>');
}
