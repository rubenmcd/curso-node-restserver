const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = "/api/usuarios";

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
  }

  routes() {
    this.app.use(this.usuariosPath, require("../routes/user"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en puerto ${this.port}`);
    });
  }
}

module.exports = Server;
