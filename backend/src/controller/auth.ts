import { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import bcrypt from 'bcrypt';
import { JWT_SECRET } from '../utils/secrets';

// Route handler for signup
export async function register(req: Request, res: Response) {
  const { firstName, lastName, email, password } = req.body;

  console.log({ firstName, password });

  console.log({ User: JSON.stringify(User) });

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log({ existingUser, hashedPassword });

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();

    // Send response with auth token
    res.status(201).json({
      message: 'User created successfully',
      // user,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: 'Error creating user' });
  }
}

// Route handler for login
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  console.log({ email, password });

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    console.log({ password, U: user.password });
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = `Bearer ${jwt.sign({ user }, JWT_SECRET)}`;

    // Send response with auth token
    res.status(200).json({
      message: 'User logged in successfully',
      token,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: 'Error logging in' });
  }
}
