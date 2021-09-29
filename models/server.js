const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      auth: "/api/auth",
      buscar: "/api/buscar",
      categorias: "/api/categorias",
      productos: "/api/productos",
      usuarios: "/api/usuarios",
      uploads: "/api/uploads",
    };

    //Conectar a base de datos
    this.conectarDb();

    //Middlewares
    this.middlewares();

    //Rutas de mi aplicacion
    this.routes();
  }

  async conectarDb() {
    await dbConnection();
  }

  middlewares() {
    //los middlewares son funciones que se ejecutan antes de llamar al controlador o seguir con la ejecucion de la app
    //CORS
    this.app.use(cors());

    //Lectura y parseo del body (cualquier parametro que venga la serializa a formato json)
    this.app.use(express.json());

    //setear directorio publico
    this.app.use(express.static("public"));

    //Fileupload - carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.buscar, require("../routes/buscar"));
    this.app.use(this.paths.categorias, require("../routes/categorias"));
    this.app.use(this.paths.productos, require("../routes/productos"));
    this.app.use(this.paths.usuarios, require("../routes/user"));
    this.app.use(this.paths.uploads, require("../routes/uploads"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en puerto ${this.port}`);
    });
  }
}

module.exports = Server;
