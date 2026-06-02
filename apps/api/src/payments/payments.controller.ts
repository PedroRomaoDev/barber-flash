import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('payments')
@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-intent')
  @ApiOperation({ summary: 'Criar Payment Intent no Stripe' })
  @ApiResponse({ status: 201, description: 'Retorna o clientSecret do pagamento.' })
  async createIntent(@Body() body: { amount: number }) {
    return this.paymentsService.createPaymentIntent(body.amount);
  }
}
