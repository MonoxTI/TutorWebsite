import { Request, Response } from 'express';
import { UserModel } from '../Models/DB';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Define request body interface
interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// POST /register
export const Register = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response
): Promise<Response> => {
  // 1. Validate request body
  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: 'No request body received',
    });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username, email, and password are required',
    });
  }

  // Optional: Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format',
    });
  }

  try {
    // 2. Check if user already exists
    const existingUser = await UserModel.findOne({
      $or: [
        { email: { $regex: new RegExp(`^${email}$`, 'i') } },
        { username: { $regex: new RegExp(`^${username}$`, 'i') } }
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists',
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create new user
    const newUser = new UserModel({
      username,
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    await newUser.save();

    // 5. Generate JWT token (auto-login after register)
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 6. Send response (exclude password)
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: userWithoutPassword,
    });

  } catch (error: unknown) {
    console.error('Registration error:', error);

    // Handle MongoDB duplicate key errors (just in case)
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Username or email already taken',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};