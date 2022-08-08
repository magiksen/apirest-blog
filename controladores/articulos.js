const fs = require("fs");
const path = require("path");
const { validarArticulo } = require("../helpers/validar")
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
		validarArticulo(parametros);

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

const listar = (req, res) => {

	let consulta = Articulo.find({});

		if (req.params.ultimos) {
			consulta.limit(3);
		}

		consulta.sort({fecha: -1})
				.exec((error, articulos) => {

		if (error || !articulos) {
			return res.status(404).json({
				status: "error",
				mensaje: "No se han encontrado articulos"
			});
		}

		return res.status(200).send({
			status: "success",
			contador: articulos.length,
			articulos
		});

	});
}

const uno = (req, res) => {
	// Recoger un id por la url
	let id = req.params.id;

	// Buscar el articulos
	Articulo.findById(id, (error, articulo) => {

		// Si no existe devolver error
		if (error || !articulo) {
			return res.status(404).json({
				status: "error",
				mensaje: "No se ha encontrado el articulo"
			});
		}

		// Devolver resultado
		return res.status(200).json({
			status: "success",
			articulo
		});
	});
}

const borrar = (req, res) => {
	let articulo_id = req.params.id;

	Articulo.findByIdAndDelete({_id: articulo_id}, (error, articuloBorrado) => {

		if (error || !articuloBorrado) {
			return res.status(500).json({
				status: "error",
				mensaje: "Error al borar el articulo"
			});
		}

		return res.status(200).json({
			status: "success",
			articulo: articuloBorrado,
			mensaje: "Metodo de borar"
		});
	});
}

const editar = (req, res) => {
	// Recoger id articulo a editar
	let articuloId = req.params.id;

	// Recoge datos del body
	let parametros = req.body;

	// validar datos
	try{
		validarArticulo(parametros);

	}catch(error){
		return res.status(400).json({
			status: "error",
			mensaje: "Faltan datos por enviar"
		});
	}

	// Buscar y actualizar articulo
	Articulo.findByIdAndUpdate({_id: articuloId}, parametros, {new: true},(error, articuloActualizado) => {

		if (error || !articuloActualizado) {
			return res.status(500).json({
				status: "error",
				mensaje: "Error al actualizar"
			});
		}

		// Devolver respuesta
		return res.status(200).json({
			status: "success",
			articulo: articuloActualizado
		});
	});

}

const subir = (req, res) => {

	// Configurar multer para subida de archivos

	// Recoger elfichero de imagen subido
	if(!req.file && !req.files) {
		return res.status(400).json({
			status: "error",
			mensaje: "Peticion invalida"
		});
	}

	// Nombre del archivo
	let archivo = req.file.originalname;

	// Extension del archivo
	let archivo_split = archivo.split("\.");
	let extension = archivo_split[1];

	// Comprobar extension correcta
	if (extension !== "png" && extension !== "jpg" && extension !== "jpeg" && extension !== "gif" && extension !== "webp") {
		// Borrar archivo y dar respuesta
		fs.unlink(req.file.path, (error) => {
			return res.status(400).json({
				status: "error",
				mensaje: "Imagen Invalida"
			});
		});
	}else{

		// Si va bien actualizar el articulo

		// Devolver respuesta
		// Recoger id articulo a editar
		let articuloId = req.params.id;

		// Buscar y actualizar articulo
		Articulo.findByIdAndUpdate({_id: articuloId}, {imagen: req.file.filename}, {new: true},(error, articuloActualizado) => {

			if (error || !articuloActualizado) {
				return res.status(500).json({
					status: "error",
					mensaje: "Error al actualizar"
				});
			}

			// Devolver respuesta
			return res.status(200).json({
				status: "success",
				articulo: articuloActualizado,
				fichero: req.file
			});
		});

	}

}

const imagen = (req, res) => {
	let fichero = req.params.fichero;
	let ruta_fisica = "./imagenes/articulos/"+fichero;

	fs.stat(ruta_fisica, (error, existe) => {
		if(existe) {
			return res.sendFile(path.resolve(ruta_fisica));
		} else {
			return res.status(404).json({
				status: "error",
				mensaje: "La imagen no existe",
				existe,
				fichero,
				ruta_fisica
			});
		}
	})
}

module.exports = {
	prueba,
	curso,
	crear,
	listar,
	uno,
	borrar,
	editar,
	subir,
	imagen
}