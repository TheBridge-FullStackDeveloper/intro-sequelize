const { User, Post, Token, Sequelize } = require("../models/index.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/config.json")["development"];
const { Op } = Sequelize;
const UserController = {
  //   create(req, res) {
  //     req.body.role = "user";
  //     const password = bcrypt.hashSync(req.body.password,10)
  //     User.create({...req.body, password})
  //       .then((user) =>
  //         res.status(201).send({ message: "Usuario creado con éxito", user })
  //       )
  //       .catch((err) => console.error(err));
  //   },
  async create(req, res) {
    try {
      req.body.role = "user"; //añadimos role user por defecto
      const password = await bcrypt.hash(req.body.password, 10); //encriptamos contraseña
      const user = await User.create({ ...req.body, password });
      res.status(201).send({ message: "Usuario creado con éxito", user });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
  getAll(req, res) {
    User.findAll({
      include: [Post],
    })
      .then((users) => res.send(users))
      .catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
  },
  async delete(req, res) {
    try {
      //elimino el usuario
      await User.destroy({
        where: {
          id: req.params.id,
        },
      });
      //elimino los posts del usuario
      await Post.destroy({
        where: {
          UserId: req.params.id,
        },
      });
      res.send("El usuario ha sido eliminado con éxito");
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
  async update(req, res) {
    try {
      await User.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
      const user = await User.findByPk(req.params.id);
      res.send({ message: "Usuario actualizado con éxito", user });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
  login(req, res) {
    User.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((user) => {
        if (!user) {
          return res
            .status(400)
            .send({ message: "Usuario o contraseña incorrectos" });
        }
        const isMatch = bcrypt.compareSync(req.body.password, user.password);
        if (!isMatch) {
          return res
            .status(400)
            .send({ message: "Usuario o contraseña incorrectos" });
        }
        const token = jwt.sign({ id: user.id }, jwt_secret); //creo el token
        Token.create({ token, UserId: user.id })
          .then(res.send({ token, user }))
          .catch((err) => {
            console.error(err);
            res.status(500).send(err);
          });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(error);
      });
  },
  //   async login(req, res) {
  //     try {
  //       const user = await User.findOne({
  //         where: {
  //           email: req.body.email,
  //         },
  //       });
  //       if (!user) {
  //         return res
  //           .status(400)
  //           .send({ message: "Usuario o contraseña incorrectos" });
  //       }
  //       const isMatch = bcrypt.compareSync(req.body.password, user.password);
  //       if (!isMatch) {
  //         return res
  //           .status(400)
  //           .send({ message: "Usuario o contraseña incorrectos" });
  //       }
  //       const token = jwt.sign({ id: user.id }, jwt_secret); //creo el token
  //       await Token.create({ token, UserId: user.id });//guardo el token en BD previamente importado el modelo Token!!!
  //       res.send({ token, message: "Te has conectado con éxito", user });
  //     } catch (error) {
  //       console.error(error);
  //       res.status(500).send(error);
  //     }
  //   },

  //   async logout(req, res) {
  //     try {
  //       await Token.destroy({
  //         where: {
  //           [Op.and]: [
  //             { UserId: req.user.id },
  //             { token: req.headers.authorization },
  //           ],
  //         },
  //       });
  //       res.send({ message: "Desconectado con éxito" });
  //     } catch (error) {
  //       console.log(error);
  //       res
  //         .status(500)
  //         .send({ message: "hubo un problema al tratar de desconectarte" });
  //     }
  //   },
  logout(req, res) {
    Token.destroy({
      where: {
        [Op.and]: [
          { UserId: req.user.id },
          { token: req.headers.authorization },
        ],
      },
    })
      .then(() => res.send({ message: "Desconectado con éxito" }))
      .catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
  },
};

module.exports = UserController;
