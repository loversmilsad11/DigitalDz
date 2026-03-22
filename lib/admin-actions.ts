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

export async function updateCategory(id: string, formData: FormData) {
  await checkAdmin();
  
  const nameAr = formData.get('nameAr') as string;
  const nameFr = formData.get('nameFr') as string;
  const slug = formData.get('slug') as string;

  if (!nameAr || !nameFr || !slug) return { error: 'Missing fields' };

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { nameAr, nameFr, slug }
    });
    revalidatePath('/[locale]/admin/categories', 'page');
    return { success: true, category };
  } catch (error: any) {
    if (error.code === 'P2002') return { error: 'Slug already exists' };
    return { error: 'Failed to update category' };
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

export async function getProductById(id: string) {
  await checkAdmin();
  return prisma.product.findUnique({
    where: { id }
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
    // 1. Delete all DigitalKeys for this product
    await prisma.digitalKey.deleteMany({ where: { productId: id } });
    
    // 2. Delete all OrderItems for this product (warning: may affect order history, but necessary for hard delete)
    await prisma.orderItem.deleteMany({ where: { productId: id } });

    // 3. Finally delete the product
    await prisma.product.delete({ where: { id } });
    
    revalidatePath('/[locale]/admin/products', 'page');
    revalidatePath('/[locale]/admin/orders', 'page');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'تعذر الحذف لارتباط هذا المنتج ببيانات أخرى.' };
  }
}

// ================= Dashboard Stats =================

export async function getDashboardStats() {
  await checkAdmin();
  const [totalOrders, totalUsers, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
      }
    }),
  ]);

  // Aggregate orders by day for chart
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true, total: true }
  });

  const chartData: Record<string, number> = {};
  orders.forEach((order) => {
    const date = order.createdAt.toISOString().split('T')[0];
    chartData[date] = (chartData[date] || 0) + Number(order.total);
  });

  const formattedChartData = Object.entries(chartData)
    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
    .map(([date, revenue]) => ({ date, revenue }));

  return { totalOrders, totalUsers, recentOrders, chartData: formattedChartData };
}

// ================= Orders =================

export async function getOrders() {
  await checkAdmin();
  return prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function confirmOrder(orderId: string) {
  await checkAdmin();
  
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) return { error: 'Order not found' };
    if (order.status === 'COMPLETED') return { error: 'Order is already completed' };

    // Find available keys for each product
    for (const item of order.items) {
      const availableKeys = await prisma.digitalKey.findMany({
        where: { productId: item.productId, status: 'AVAILABLE' },
        take: item.quantity
      });

      if (availableKeys.length < item.quantity) {
        return { error: `Not enough keys available for product ID: ${item.productId}` };
      }

      // Assign keys to order
      for (const key of availableKeys) {
        await prisma.digitalKey.update({
          where: { id: key.id },
          data: { status: 'SOLD', orderId: order.id }
        });
      }
    }

    // Mark order as complete
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'COMPLETED' }
    });

    revalidatePath('/[locale]/admin/orders', 'page');
    revalidatePath('/[locale]/admin', 'page');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to confirm order' };
  }
}

export async function cancelOrder(orderId: string) {
  await checkAdmin();
  
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { keys: true }
    });

    if (!order) return { error: 'Order not found' };

    // If order is completed or already has keys assigned, we must release them back to stock
    if (order.keys.length > 0) {
      await prisma.digitalKey.updateMany({
        where: { orderId: order.id },
        data: {
          status: 'AVAILABLE',
          orderId: null
        }
      });
    }

    // Cancel order
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' }
    });

    revalidatePath('/[locale]/admin/orders', 'page');
    revalidatePath('/[locale]/admin', 'page');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to cancel order' };
  }
}

export async function deleteOrder(orderId: string) {
  await checkAdmin();
  
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) return { error: 'Order not found' };

    // To prevent database foreign key constraint errors, delete order items first
    await prisma.orderItem.deleteMany({
      where: { orderId: order.id }
    });

    // Delete the order itself completely
    await prisma.order.delete({
      where: { id: orderId }
    });

    revalidatePath('/[locale]/admin/orders', 'page');
    revalidatePath('/[locale]/admin', 'page');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to delete order permanently' };
  }
}

// ================= Product Update & Keys =================

export async function updateProduct(id: string, formData: FormData) {
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
    const product = await prisma.product.update({
      where: { id },
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
    return { error: 'Failed to update product' };
  }
}

export async function getProductKeys(productId: string) {
  await checkAdmin();
  return prisma.digitalKey.findMany({
    where: { productId },
    orderBy: { status: 'asc' } // AVAILABLE first
  });
}

export async function addKeysToProduct(productId: string, keysContent: string) {
  await checkAdmin();
  if (!keysContent.trim()) return { error: 'لا توجد مفاتيح مدخلة' };

  const codes = keysContent.split('\n')
    .map(c => c.trim())
    .filter(c => c.length > 0);

  if (codes.length === 0) return { error: 'تعذر استخراج المفاتيح. تأكد أن كل مفتاح في سطر.' };

  try {
    const inserts = codes.map(code => ({
      productId,
      code,
      status: 'AVAILABLE'
    }));

    await prisma.digitalKey.createMany({
      data: inserts
    });

    revalidatePath('/[locale]/admin/products', 'page');
    return { success: true, count: codes.length };
  } catch (error) {
    console.error(error);
    return { error: 'فشل إضافة المفاتيح. قد يكون هناك تكرار.' };
  }
}

export async function deleteKey(keyId: string) {
  await checkAdmin();
  try {
    await prisma.digitalKey.delete({
      where: { id: keyId }
    });
    revalidatePath('/[locale]/admin/products', 'page');
    return { success: true };
  } catch (error) {
    return { error: 'فشل حذف المفتاح' };
  }
}



