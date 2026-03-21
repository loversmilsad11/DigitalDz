import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * GET /api/slickpay/status?orderId=xxx
 * Check the payment status of an order
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    const order = await (prisma as any).order.findUnique({
      where: { id: orderId },
      include: {
        payment: true,
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Only allow the order owner to check status
    if (order.userId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      total: Number(order.total),
      paymentMethod: order.paymentMethod,
      payment: order.payment ? {
        status: order.payment.status,
        provider: order.payment.provider,
        createdAt: order.payment.createdAt,
      } : null,
      items: order.items?.map((item: any) => ({
        name: item.product?.nameFr || item.product?.nameAr,
        nameAr: item.product?.nameAr,
        price: Number(item.price),
        quantity: item.quantity || 1,
      })) || [],
      createdAt: order.createdAt,
    });

  } catch (error) {
    console.error('[SlickPay] Status check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
