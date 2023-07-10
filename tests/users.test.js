const request = require("supertest");
const app = require("../index.js");
const { User } = require("../models/index.js");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/config.json")["development"];

describe("testing/users", () => {
  const user = {
    name: "Username",
    email: "test@example.com",
    password: "123456", //contraseña sin encriptar
    role: "user",
    confirmed: false,
  };
  afterAll(() => {
    //método de jest
    //código
    return User.destroy({ where: {}, truncate: true }); //borra todo lo que hay en la tabla usuarios
  });

  test("Create a user", async () => {
    let usersCount = await User.count();
    expect(usersCount).toBe(0);
    const res = await request(app).post("/users").send(user).expect(201);
    usersCount = await User.count();
    expect(usersCount).toBe(1);
    expect(res.body.user.id).toBeDefined();
    expect(res.body.user.createdAt).toBeDefined();
    expect(res.body.user.updatedAt).toBeDefined();
    const sendUser = {
      ...user,
      id: res.body.user.id,
      password: res.body.user.password, //contraseña encriptada
      createdAt: res.body.user.createdAt,
      updatedAt: res.body.user.updatedAt,
    };
    const newUser = res.body.user;
    expect(newUser).toEqual(sendUser);
  });
  //   describe("testing/users", () => {
  //     test("Create a user", async () => {
  //       const res = await request(app).post("/users").send(user).expect(201);
  //       console.warn(res)
  //       expect(res.body.user.id).toBeDefined();
  //       expect(res.body.user.createdAt).toBeDefined();
  //       expect(res.body.user.updatedAt).toBeDefined();
  //     });
  //   });
  //   test("Create a user", async () => {
  //     let usersCount = await User.count();
  //     expect(usersCount).toBe(0);
  //     await request(app).post("/users").send(user).expect(201);
  //     usersCount = await User.count();
  //     expect(usersCount).toBe(1);
  //   });

  test("Confirm a user", async () => {
    const emailToken = jwt.sign({ email: user.email }, jwt_secret, {
      expiresIn: "48h",
    });
    const res = await request(app)
      .get("/users/confirmed/" + emailToken)
      .expect(201);
    expect(res.text).toBe("Usuario confirmado con éxito");
  });
  let token;
  test("Login a user", async () => {
    const res = await request(app)
      .post("/users/login")
      .send({ email: "test@example.com", password: "123456" })
      .expect(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });
  test("Get users", async () => {
    const res = await request(app)
      .get("/users")
      .expect(200)
      .set({ Authorization: token });
    expect(res.body).toBeInstanceOf(Array);
  });
  test("Update a user record", async () => {
    const updateUser = { name: "Updated name" };
    const res = await request(app)
      .put("/users/id/1")
      .send(updateUser)
      .set({ Authorization: token })
      .expect(200);
    expect(res.body.message).toBe("Usuario actualizado con éxito");
  });
  test("Logout a user record", async () => {
    const res = await request(app)
      .delete("/users/logout")
      .set({ Authorization: token })
      .expect(200);
    expect(res.body.message).toBe("Desconectado con éxito");
  });
});
