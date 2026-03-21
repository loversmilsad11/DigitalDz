import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

/**
 * SlickPay Callback Handler
 * This route is called when the user returns from the SlickPay payment page.
 * The URL format: /api/slickpay/callback?orderId=xxx
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Find the order with cast to any to avoid Prisma sync issues in IDE
    const order = await (prisma as any).order.findUnique({
      where: { id: orderId },
      include: { payment: true, items: true },
    });

    if (!order) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Update order status to PAID
    await (prisma as any).order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
      },
    });

    // Update payment record
    if (order.payment) {
      await (prisma as any).payment.update({
        where: { id: order.payment.id },
        data: {
          status: 'PAID',
          callbackData: JSON.stringify({
            timestamp: new Date().toISOString(),
            source: 'slickpay_callback',
            queryParams: Object.fromEntries(searchParams.entries()),
          }),
        },
      });
    }

    // Mark digital keys as sold
    if (order.items && Array.isArray(order.items)) {
      for (const item of order.items) {
        const availableKeys = await (prisma as any).digitalKey.findMany({
          where: {
            productId: item.productId,
            status: 'AVAILABLE',
          },
          take: item.quantity || 1,
        });

        for (const key of availableKeys) {
          await (prisma as any).digitalKey.update({
            where: { id: key.id },
            data: {
              status: 'SOLD',
              orderId: order.id,
            },
          });
        }
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    // Success redirect
    return NextResponse.redirect(
      `${appUrl}/fr/checkout/success?orderId=${orderId}`
    );

  } catch (error) {
    console.error('[SlickPay] Callback error:', error);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(
      `${appUrl}/fr/checkout/success?orderId=error`
    );
  }
}
