const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    //Verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        //estos mensajes deben de ser menos explicitos y probablemente juntarlos en un solo if
        msg: "usuario/password no son correctos - email",
      });
    }

    //verificar si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        //estos mensajes deben de ser menos explicitos y probablemente juntarlos en un solo if
        msg: "Usuario /Password no son correctos - estado: false",
      });
    }

    //verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        //estos mensajes deben de ser menos explicitos y probablemente juntarlos en un solo if
        msg: "Usuario /Password no son correctos - password",
      });
    }

    //generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Algo salio mal, hable con el administrador",
    });
  }
};

module.exports = {
  login,
};
