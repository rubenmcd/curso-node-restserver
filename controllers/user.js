const { response, request } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");

const usuariosGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({ total, usuarios });
};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params; //const id = req.params.id;
  const { _id, password, google, correo, ...resto } = req.body;

  //TODO validar contra base de datos
  if (password) {
    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findOneAndUpdate(id, resto);

  res.json({
    usuario,
  });
};

const usuariosPost = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  //Guardar en BD
  await usuario.save();

  //regresamos el usuario
  res.status(201).json({
    usuario,
  });
};

const usuariosDelete = async (req, res) => {
  //Obtenemos el ID
  const { id } = req.params;

  //Cambiamos el estado del usuario
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  //Regresamos el usuario que se deshabilitó
  res.json(usuario);
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
};
