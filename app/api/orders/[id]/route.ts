import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true }
        },
        keys: true,
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Ensure user can only see their own order (unless admin)
    const userRole = (session.user as any).role;
    const userId = (session.user as any).id;
    if (order.userId !== userId && userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Fetch order error:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
