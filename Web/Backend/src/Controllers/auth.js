const bcrypt = require("bcrypt");
const prisma = require("../prisma/client");

//registrar usuario
async function register(req, res) {
  try {
    const { nombre, contrasena } = req.body;

    if (!nombre || !contrasena) {
      return res.status(400).json({error: "Ingresar nombre y contraseña!" });
    }

    const hash = await bcrypt.hash(contrasena, 10);

    const usuario = await prisma.usuario.create({
      data: { nombre, contrasena: hash },
      select: { id: true, nombre: true },
    });

    return res.status(201).json({ user: usuario });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

//iniciar sesión
async function login(req, res) {
  try {
    const { nombre, contrasena } = req.body;

    if (!nombre || !contrasena) {
      return res.status(400).json({ error: "Ingresar nombre y contraseña!" });
    }

    const usuario = await prisma.usuario.findUnique({ where: { nombre } });
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales incorrectas!" });
    }

    const verificar_contra = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!verificar_contra) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    return res.json({user: { id: usuario.id, nombre: usuario.nombre } });
  } catch {
    return res.status(500).json({ error: "Error del servidor" });
  }
}

module.exports = { register, login };