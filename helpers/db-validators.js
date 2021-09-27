const Role = require("../models/role");
const Usuario = require("../models/usuario");

const esRolValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no existe`);
  }
};

//Verificar si el correo existe
const emailExiste = async (correo = "") => {
  const correoExiste = await Usuario.findOne({ correo });
  if (correoExiste) {
    throw new Error("Este correo ya esta registrado.");
  }
};

const existeUsuarioPorId = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id: ${id}, no existe`);
  }
};

module.exports = {
  esRolValido,
  emailExiste,
  existeUsuarioPorId,
};
