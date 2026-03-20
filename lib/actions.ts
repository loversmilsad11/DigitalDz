'use server';
import bcrypt from 'bcrypt';
import prisma from './db';

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  if (!email || !password) {
    return { error: 'Please provide email and password' };
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: 'User already exists' };
  }

  // Set the first user as ADMIN, others as USER
  const userCount = await prisma.user.count();
  const role = userCount === 0 ? 'ADMIN' : 'USER';

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });
    return { success: true, user: { id: user.id, email: user.email, role: user.role } };
  } catch (e: any) {
    console.error('Registration failed:', e);
    return { error: 'Something went wrong during registration' };
  }
}
