'use server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import prisma from './db';
import { revalidatePath } from 'next/cache';

// =================== Reviews ===================

export async function addReview(productId: string, rating: number, comment: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: 'يجب تسجيل الدخول أولاً' };

  const userId = (session.user as any).id;

  // Check user bought this product
  const hasBought = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: { userId, status: { in: ['COMPLETED', 'PAID'] } }
    }
  });
  if (!hasBought) return { error: 'يمكنك تقييم المنتج فقط بعد شرائه' };

  try {
    const review = await prisma.review.upsert({
      where: { userId_productId: { userId, productId } },
      update: { rating, comment },
      create: { userId, productId, rating, comment },
    });
    revalidatePath(`/products`);
    return { success: true, review };
  } catch (e: any) {
    return { error: 'تعذر حفظ التقييم' };
  }
}

export async function getProductReviews(productId: string) {
  return prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

// =================== Coupons ===================

export async function validateCoupon(code: string, cartTotal: number) {
  if (!code.trim()) return { error: 'أدخل كود الخصم' };

  const coupon = await prisma.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });
  if (!coupon || !coupon.isActive) return { error: 'كود الخصم غير صالح' };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return { error: 'انتهت صلاحية الكود' };
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return { error: 'تم استنفاد هذا الكود' };

  const discount = coupon.type === 'PERCENT'
    ? (cartTotal * Number(coupon.discount)) / 100
    : Number(coupon.discount);

  return {
    success: true,
    coupon: { code: coupon.code, type: coupon.type, discount: Number(coupon.discount) },
    discountAmount: Math.min(discount, cartTotal),
    finalTotal: Math.max(0, cartTotal - discount),
  };
}

// =================== Admin: Coupons ===================

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'ADMIN') throw new Error('Unauthorized');
}

export async function getCoupons() {
  await checkAdmin();
  return prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createCoupon(formData: FormData) {
  await checkAdmin();
  const code = (formData.get('code') as string).trim().toUpperCase();
  const discount = parseFloat(formData.get('discount') as string);
  const type = formData.get('type') as string || 'PERCENT';
  const maxUses = formData.get('maxUses') ? parseInt(formData.get('maxUses') as string) : null;
  const expiresAt = formData.get('expiresAt') ? new Date(formData.get('expiresAt') as string) : null;

  if (!code || !discount) return { error: 'حقول مطلوبة' };
  try {
    const coupon = await prisma.coupon.create({ data: { code, discount, type, maxUses, expiresAt } });
    revalidatePath('/admin/coupons');
    return { success: true, coupon };
  } catch (e: any) {
    if (e.code === 'P2002') return { error: 'الكود موجود مسبقاً' };
    return { error: 'فشل الإنشاء' };
  }
}

export async function toggleCoupon(id: string, isActive: boolean) {
  await checkAdmin();
  await prisma.coupon.update({ where: { id }, data: { isActive } });
  revalidatePath('/admin/coupons');
  return { success: true };
}

export async function deleteCoupon(id: string) {
  await checkAdmin();
  await prisma.coupon.delete({ where: { id } });
  revalidatePath('/admin/coupons');
  return { success: true };
}

// =================== Admin: Users ===================

export async function getUsers() {
  await checkAdmin();
  return prisma.user.findMany({
    orderBy: { id: 'asc' },
    select: {
      id: true, name: true, email: true, role: true, image: true,
      _count: { select: { orders: true } }
    }
  });
}

export async function updateUserRole(userId: string, role: string) {
  await checkAdmin();
  const session = await getServerSession(authOptions);
  if ((session!.user as any).id === userId) return { error: 'لا يمكنك تغيير دورك الخاص' };
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath('/admin/users');
  return { success: true };
}

// =================== Admin: Enhanced Stats ===================

export async function getEnhancedStats() {
  await checkAdmin();

  const [totalRevenue, topProducts, recentUsersCount] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { in: ['COMPLETED', 'PAID'] } },
      _sum: { total: true },
    }),
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
    prisma.user.count({
      where: { orders: { some: {} } }
    }),
  ]);

  const topProductIds = topProducts.map(p => p.productId);
  const topProductDetails = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, nameAr: true, image: true, price: true }
  });

  const topProductsWithDetails = topProducts.map(tp => ({
    ...tp,
    product: topProductDetails.find(p => p.id === tp.productId),
  }));

  return {
    totalRevenue: Number(totalRevenue._sum.total || 0),
    topProducts: topProductsWithDetails,
    recentUsersCount,
  };
}
