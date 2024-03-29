const express = require("express");
const multer = require("multer");
const router = express.Router();

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './imagenes/articulos/');
    },

    filename: (req, file, cb) => {
        cb(null, "aticulo" + Date.now() + file.originalname);
    }
});

const subidas = multer({storage: almacenamiento});

const ArticuloControlador = require("../controladores/articulos");

// Rutas de prueba
router.get("/ruta-de-prueba", ArticuloControlador.prueba);
router.get("/curso", ArticuloControlador.curso);

// Ruta util
router.post("/crear", ArticuloControlador.crear);
router.get("/articulos/:ultimos?", ArticuloControlador.listar);
router.get("/articulo/:id", ArticuloControlador.uno);
router.delete("/articulo/:id", ArticuloControlador.borrar);
router.put("/articulo/:id", ArticuloControlador.editar);
router.post("/subir-imagen/:id", [subidas.single("file0")], ArticuloControlador.subir);
router.get("/imagen/:fichero", ArticuloControlador.imagen);
router.get("/buscar/:busqueda", ArticuloControlador.buscar);

module.exports = router;