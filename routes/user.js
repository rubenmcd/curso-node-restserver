const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
} = require("../controllers/user");
const {
  esRolValido,
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validators");
const router = Router();

router.get("/", usuariosGet);

router.put(
  "/:id",
  [
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRolValido),
    validarCampos,
  ],
  usuariosPut
);

router.post(
  "/",
  [
    check("correo", "El correo no es valido.").isEmail(),
    check("correo").custom(emailExiste),
    check("nombre", "El nombre es oblogatorio").not().isEmpty(),
    check(
      "password",
      "El password es obligatorio y debe de ser de mas de 6 caracteres"
    ).isLength({ min: 6 }),
    //check("rol", "No es un rol permitido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("rol").custom(esRolValido),
    validarCampos,
  ],
  usuariosPost
);

router.delete(
  "/:id",
  [
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

module.exports = router;
