'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import prisma from './db';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

// ================= Categories =================

export async function getCategories() {
  await checkAdmin();
  return prisma.category.findMany({
    orderBy: { nameAr: 'asc' }
  });
}

export async function createCategory(formData: FormData) {
  await checkAdmin();
  
  const nameAr = formData.get('nameAr') as string;
  const nameFr = formData.get('nameFr') as string;
  const slug = formData.get('slug') as string;

  if (!nameAr || !nameFr || !slug) return { error: 'Missing fields' };

  try {
    const category = await prisma.category.create({
      data: { nameAr, nameFr, slug }
    });
    revalidatePath('/[locale]/admin/categories', 'page');
    return { success: true, category };
  } catch (error: any) {
    if (error.code === 'P2002') return { error: 'Slug already exists' };
    return { error: 'Failed to create category' };
  }
}

export async function deleteCategory(id: string) {
  await checkAdmin();
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath('/[locale]/admin/categories', 'page');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete category' };
  }
}

// ================= Products =================

export async function getProducts() {
  await checkAdmin();
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { nameAr: 'asc' }
  });
}

export async function createProduct(formData: FormData) {
  await checkAdmin();
  
  const nameAr = formData.get('nameAr') as string;
  const nameFr = formData.get('nameFr') as string;
  const descriptionAr = formData.get('descriptionAr') as string;
  const descriptionFr = formData.get('descriptionFr') as string;
  const price = parseFloat(formData.get('price') as string);
  const slug = formData.get('slug') as string;
  const categoryId = formData.get('categoryId') as string;
  const image = formData.get('image') as string || null;

  if (!nameAr || !descriptionAr || !price || !slug || !categoryId) {
    return { error: 'Missing required fields' };
  }

  try {
    const product = await prisma.product.create({
      data: {
        nameAr,
        nameFr: nameFr || nameAr,
        descriptionAr,
        descriptionFr: descriptionFr || descriptionAr,
        price,
        slug,
        categoryId,
        image
      }
    });
    revalidatePath('/[locale]/admin/products', 'page');
    return { success: true, product };
  } catch (error: any) {
    if (error.code === 'P2002') return { error: 'Slug already exists' };
    return { error: 'Failed to create product' };
  }
}

export async function deleteProduct(id: string) {
  await checkAdmin();
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath('/[locale]/admin/products', 'page');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete product' };
  }
}
