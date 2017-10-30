const fs = require('fs');
const path = require('path');

exports.uploadImg = (obj,folder) => {
	let nombre_nuevo = obj.filename + "files";
	let ruta_archivo = obj.path;
	let nueva_ruta = "."+ folder + nombre_nuevo + path.extname(ruta_archivo).toLowerCase();
	let nombre_imagen = nombre_nuevo + path.extname(ruta_archivo).toLowerCase();
	fs.createReadStream(ruta_archivo).pipe(fs.createWriteStream(nueva_ruta)); 
	return nombre_imagen;
}