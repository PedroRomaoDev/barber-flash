import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BarbershopsService } from './barbershops/barbershops.service';

async function bootstrap() {
  console.log('Iniciando o seeder do banco de dados...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const barbershopsService = app.get(BarbershopsService);
  
  try {
    const result = await barbershopsService.seed();
    console.log(result);
  } catch (error) {
    console.error('Erro durante o seed:', error);
  } finally {
    await app.close();
    console.log('Seed concluído e contexto fechado.');
  }
}

void bootstrap();
