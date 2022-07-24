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

module.exports = {
	prueba,
	curso
}