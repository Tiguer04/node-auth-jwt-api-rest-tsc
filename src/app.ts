import dotenv from 'dotenv';
import express from 'express'
import authRoutes from './routes/authRoutes.js';
import usersRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

app.use(express.json()) // Para que pueda leer los JSON.

//ROUTES

app.use('/auth', authRoutes)
app.use('/users', usersRoutes)


// AUTENTICACION

//USERS

export default app;