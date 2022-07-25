const validator = require("validator");
const Articulo = require("../modelos/Articulo");

const prueba = (req, res) => {

	return res.status(200).json({
		mensaje: "Soy una accion de prueba en mi controlador de articulos"
	});
}

const curso = (req, res) => {

	console.log("Se ha ejecutado el endpoint probando");

	return res.status(200).json([{
		curso: "Master en React",
		autor: "Magiksen",
		url: "magiksen.com"
	},
	{
		curso: "Master en React",
		autor: "Magiksen",
		url: "magiksen.com"
	}
	]);

}

const crear = (req, res) => {

	// Recoger parametros por post a guardar
	let parametros = req.body;

	// Validar
	try{
		let validar_titulo = !validator.isEmpty(parametros.titulo) &&
								validator.isLength(parametros.titulo, {min: 5, max: undefined});
		let validar_contenido = !validator.isEmpty(parametros.contenido);

		if (!validar_titulo || !validar_contenido) {
			throw new Error("No se ha validado la informacion !!");
		}

	}catch(error){
		return res.status(400).json({
			status: "error",
			mensaje: "Faltan datos por enviar"
		});
	}

	// Crear el objeto a guardar
	const articulo = new Articulo(parametros);

	// Asignar valores a objeto basado en el modelo (manual o automatico)
	// articulo.titulo = parametros.titulo;

	// Guardar el articulo en la base de datos
	articulo.save((error, articuloGuardado) => {

		if(error || !articuloGuardado) {
			return res.status(400).json({
				status: "error",
				mensaje: "No se ha guardado el articulo"
			});
		}

		// Devolver resultado
		return res.status(200).json({
			status: "success",
			articulo: articuloGuardado,
			mensaje: "Articulo guardado con exito"
		});

	});

	
}

module.exports = {
	prueba,
	curso,
	crear
}