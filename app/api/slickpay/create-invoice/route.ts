import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { createInvoice, isSlickPayConfigured, SlickPayError } from '@/lib/slickpay';

export async function POST(req: NextRequest) {
  try {
    // 1) Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً / Vous devez vous connecter' },
        { status: 401 }
      );
    }

    // 2) Check SlickPay configuration
    if (!isSlickPayConfigured()) {
      return NextResponse.json(
        { error: 'بوابة الدفع غير مفعّلة / Passerelle de paiement non configurée' },
        { status: 503 }
      );
    }

    // 3) Parse request body
    const body = await req.json();
    const { items, customerName, customerPhone, customerEmail } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'السلة فارغة / Le panier est vide' },
        { status: 400 }
      );
    }

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'يرجى ملء جميع البيانات المطلوبة / Veuillez remplir tous les champs requis' },
        { status: 400 }
      );
    }

    // 4) Calculate total amount
    const totalAmount = items.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    );

    // 5) Create order in database
    const userId = (session.user as any).id;
    
    const order = await (prisma as any).order.create({
      data: {
        userId,
        total: totalAmount,
        status: 'PENDING',
        paymentMethod: 'slickpay',
        customerName,
        customerPhone,
        customerEmail: customerEmail || (session.user as any).email,
        items: {
          create: items.map((item: { productId: string; price: number; quantity: number }) => ({
            productId: item.productId,
            price: item.price,
            quantity: item.quantity || 1,
          })),
        },
      },
    });

    // 6) Create SlickPay invoice
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const callbackUrl = `${appUrl}/api/slickpay/callback?orderId=${order.id}`;
    const cancelUrl = `${appUrl}/checkout`;

    console.log('[SlickPay] Preparing to call SlickPay for order:', order.id);

    const invoiceItems = items.map((item: { name: string; price: number; quantity: number }) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
    }));

    const invoiceResponse = await createInvoice({
      amount: totalAmount,
      url: callbackUrl,
      cancel_url: cancelUrl,
      items: invoiceItems,
    });

    console.log('[SlickPay] Invoice created successfully:', invoiceResponse.id);

    // 7) Update order with SlickPay data
    await (prisma as any).order.update({
      where: { id: order.id },
      data: {
        slickpayInvoiceId: String(invoiceResponse.id),
        slickpayInvoiceUrl: invoiceResponse.url,
        paymentId: String(invoiceResponse.id),
      },
    });

    // 8) Create payment record
    await (prisma as any).payment.create({
      data: {
        orderId: order.id,
        provider: 'slickpay',
        invoiceId: String(invoiceResponse.id),
        amount: totalAmount,
        status: 'PENDING',
        paymentUrl: invoiceResponse.url,
      },
    });

    // 9) Return payment URL to frontend
    return NextResponse.json({
      success: true,
      orderId: order.id,
      invoiceId: invoiceResponse.id,
      paymentUrl: invoiceResponse.url,
      message: 'تم إنشاء الفاتورة بنجاح / Facture créée avec succès',
    });

  } catch (error: any) {
    console.error('[SlickPay] Fatal Route Error:', error);

    if (error instanceof SlickPayError) {
      console.error('[SlickPay] API Details:', {
        status: error.statusCode,
        errors: error.errors,
        raw: error.rawResponse
      });

      return NextResponse.json(
        { 
          error: `خطأ في بوابة الدفع: ${error.message}`,
          details: error.errors,
          code: error.statusCode
        },
        { status: 500 } // Keep 500 for internal tracking but provide details
      );
    }

    // Prisma error handling
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'خطأ في قاعدة البيانات: المستخدم غير موجود. يرجى تسجيل الخروج ثم الدخول مرة أخرى. / Erreur BD: Utilisateur inexistant. Veuillez vous reconnecter.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'حدث خطأ غير متوقع / Une erreur inattendue s\'est produite' },
      { status: 500 }
    );
  }
}
