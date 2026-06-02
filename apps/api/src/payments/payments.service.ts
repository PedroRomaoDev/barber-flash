import { Injectable, HttpException } from '@nestjs/common';
const Stripe = require('stripe');

@Injectable()
export class PaymentsService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-05-27.dahlia' as any,
  });

  async createPaymentIntent(amount: number) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe espera o valor em centavos
        currency: 'brl',
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error: any) {
      console.error('Stripe API Error:', error);
      throw new HttpException(`Erro na Stripe: ${error.message}`, 400);
    }
  }
}
