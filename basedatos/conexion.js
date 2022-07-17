const mongoose = require("mongoose");

const conexion = async() => {

	try {
		await mongoose.connect("mongodb://localhost:27017/mi_blog");

		console.log("Conectado a la base de datos mi_blog !!");

	} catch(error) {
		throw new Error("No se ha podido conectar a la base de datos !!");
	}
}

module.exports = {
	conexion
}