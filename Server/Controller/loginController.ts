import { UserModel } from "../Models/DB"; // ✅ This is your model
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Optional: Define a type for the request body (good practice)
interface LoginRequestBody {
  Email: string;
  Password: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'; // Avoid undefined

// POST /login
export const Login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
): Promise<Response> => {
  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: 'No request body received',
    });
  }

  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  try {
    // ✅ Use UserModel (not "User")
    const user = await UserModel.findOne({
      email: { $regex: new RegExp(`^${Email}$`, 'i') }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(Password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password, ...userWithoutPassword } = user.toObject();

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    });

  } catch (error: unknown) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};