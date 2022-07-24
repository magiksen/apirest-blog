const { conexion } = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors");

// Inicializar app
console.log('App node arrancada');

// Conectar a la base de datos
conexion();

// Crear servidor Node
const app = express();
const puerto = 3900;

// Configurar cors
app.use(cors());

// Convertir body a objeto js
app.use(express.json()); // recibir los datos con content-type app/json
app.use(express.urlencoded({extended:true}));

// RUTAS
const rutas_articulos = require("./rutas/articulos");

// Carga las rutas
app.use("/api", rutas_articulos);


// Rutas pruebas hardcodeadas
app.get("/probando", (req, res) => {

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

});

app.get("/", (req, res) => {

	return res.status(200).send(
			"<h1>Empezando a crear api rest con node</h1>"
		);

});

// Crear el servidor y esuchar peticiones http
app.listen(puerto, ()=> {
	console.log("Servidor corriendo en el puerto "+puerto);
})