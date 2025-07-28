import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET!;

// Helper function to verify token and get user ID
async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, JWT_SECRET) as { id?: string; userId?: string; email: string };
  
  const userId = decoded.id || decoded.userId;
  if (!userId) {
    throw new Error('Invalid token format');
  }
  
  return userId;
}

// Helper function to ensure upload directory exists
function ensureUploadDir() {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
}

export async function POST(request: NextRequest) {
  try {
    const userId = await verifyToken(request);
    await connectDB();

    const formData = await request.formData();
    const avatarFile = formData.get('avatar') as File;
    
    if (!avatarFile) {
      return NextResponse.json({ error: 'No avatar file provided' }, { status: 400 });
    }

    // Validate file type
    if (!avatarFile.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validate file size (5MB limit)
    if (avatarFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Find user and remove old avatar if exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove old avatar file if it exists
    if (user.avatar) {
      const oldAvatarPath = path.join(process.cwd(), 'public', user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Save new avatar file
    const uploadDir = ensureUploadDir();
    const fileExtension = path.extname(avatarFile.name);
    const filename = `avatar_${userId}_${Date.now()}${fileExtension}`;
    const filepath = path.join(uploadDir, filename);
    
    const buffer = Buffer.from(await avatarFile.arrayBuffer());
    fs.writeFileSync(filepath, buffer);

    // Update user with new avatar path
    const avatarUrl = `/uploads/avatars/${filename}`;
    await User.findByIdAndUpdate(userId, { avatar: avatarUrl });

    return NextResponse.json({ 
      message: 'Avatar uploaded successfully',
      avatarUrl
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload avatar' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await verifyToken(request);
    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove avatar file if it exists
    if (user.avatar) {
      const avatarPath = path.join(process.cwd(), 'public', user.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    // Remove avatar from user profile
    await User.findByIdAndUpdate(userId, { $unset: { avatar: 1 } });

    return NextResponse.json({ 
      message: 'Avatar removed successfully'
    });

  } catch (error) {
    console.error('Avatar deletion error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to remove avatar' },
      { status: 500 }
    );
  }
}
