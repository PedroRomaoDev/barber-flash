 
import { Injectable, HttpException } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');

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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('Stripe API Error:', error);
      throw new HttpException(`Erro na Stripe: ${message}`, 400);
    }
  }
}
