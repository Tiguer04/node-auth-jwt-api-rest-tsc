import {
  comparePasswords,
  hashPassword,
} from "../services/password.service.js";
import prisma from "../models/user.js";
import { generateToken } from "../services/auth.service.js";
import type { Request, Response } from "express";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!password) {
    res.status(400).json({ message: "El password es obligatorio." });
    return;
  }

  if (!email) {
    res.status(400).json({ message: "El email es obligatorio." });
    return;
  }

  try {
    const hashedPassword = await hashPassword(password);

    const user = await prisma.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.modelName?.includes("user")) {
      res.status(400).json({ message: "El email ingresado ya existe." });
    }

    console.log(error);
    res.status(500).json({ error: "Hubo un error en el registro" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!password) {
    res.status(400).json({ message: "El password es obligatorio." });
    return;
  }

  if (!email) {
    res.status(400).json({ message: "El email es obligatorio." });
    return;
  }

  try {
    const user = await prisma.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado." });
      return;
    }

    const passwordMatch = await comparePasswords(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: "Usuario y contraseñas no coinciden." });
    }

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (error) {
    console.log("Error: ", error);
  }
};
