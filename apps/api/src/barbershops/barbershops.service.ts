import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere, DeepPartial } from 'typeorm';
import { Barbershop } from './barbershop.entity';
import { Service } from '../services/service.entity';
import { BarberProfile } from '../barbers/barber-profile.entity';
import { User } from '../users/user.entity';

@Injectable()
export class BarbershopsService {
  constructor(
    @InjectRepository(Barbershop)
    private readonly barbershopRepository: Repository<Barbershop>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(BarberProfile)
    private readonly barberRepository: Repository<BarberProfile>,
  ) {}

  findAll(search?: string, ownerId?: string): Promise<Barbershop[]> {
    const whereClause: FindOptionsWhere<Barbershop> = {};
    if (search) {
      whereClause.name = ILike(`%${search}%`);
    }
    if (ownerId) {
      whereClause.owner = { id: ownerId };
    }
    
    return this.barbershopRepository.find({
      where: Object.keys(whereClause).length > 0 ? whereClause : {},
      relations: ['services', 'barbers', 'barbers.user', 'owner'],
      order: {
        createdAt: 'DESC',
      }
    });
  }

  async findOne(id: string): Promise<Barbershop> {
    const barbershop = await this.barbershopRepository.findOne({
      where: { id },
      relations: ['services', 'barbers', 'barbers.user'],
    });
    if (!barbershop) {
      throw new NotFoundException(`Barbearia com ID ${id} não encontrada.`);
    }
    return barbershop;
  }

  async create(data: DeepPartial<Barbershop>): Promise<Barbershop> {
    const barbershop = this.barbershopRepository.create(data);
    return this.barbershopRepository.save(barbershop);
  }

  async addService(barbershopId: string, data: Partial<Service>): Promise<Service> {
    const barbershop = await this.findOne(barbershopId);
    const service = this.serviceRepository.create({
      ...data,
      barbershop,
    });
    return this.serviceRepository.save(service);
  }

  async addBarber(barbershopId: string, userId: string, description: string): Promise<BarberProfile> {
    const barbershop = await this.findOne(barbershopId);
    const barber = this.barberRepository.create({
      user: { id: userId } as User,
      barbershops: [barbershop],
      bio: description,
    });
    return this.barberRepository.save(barber);
  }

  async seed(): Promise<string> {
    await this.serviceRepository.createQueryBuilder().delete().execute();
    await this.barbershopRepository.createQueryBuilder().delete().execute();
    // continue with seed

    // Create a mock user for the barber
    // We can just use the repository to save a barber directly with a mock bio.
    // However, BarberProfile requires a User. 
    // Wait, let's just make a user through a quick hack or assume one exists, 
    // actually, we can just use the entity manager to create a generic BarberProfile 
    // but the foreign key to User must exist.
    // Let's create a User first!
    const userRepo = this.barbershopRepository.manager.getRepository(User);
    let mockUser = await userRepo.findOne({ where: { email: 'barbeiro@teste.com' } });
    if (!mockUser) {
      mockUser = userRepo.create({
        name: 'Carlos Barbeiro',
        email: 'barbeiro@teste.com',
        password: '123'
      });
      mockUser = await userRepo.save(mockUser);
    }
    
    let mockBarber = await this.barberRepository.findOne({ where: { user: { id: mockUser.id } } });
    if (!mockBarber) {
      mockBarber = this.barberRepository.create({
        user: mockUser,
        bio: 'Barbeiro profissional',
        ratingAverage: 5.0,
        ratingCount: 120
      });
      mockBarber = await this.barberRepository.save(mockBarber);
    }

    const mockShops = [
      {
        name: 'Vintage Barber',
        address: 'Avenida São Sebastião, 357, São Paulo',
        imageUrl: 'barber1.svg',
        barbers: [mockBarber],
      },
      {
        name: 'Clássica Cortez',
        address: 'Rua Castro Alves, 331, Sao Paulo',
        imageUrl: 'barber2.svg',
        barbers: [mockBarber],
      },
      {
        name: 'Los Barberos',
        address: 'Rua Sete de Setembro, 428, São Paulo',
        imageUrl: 'barber3.svg',
        barbers: [mockBarber],
      },
      {
        name: 'Homem Elegante',
        address: 'Rua Projetada, 529, São Paulo',
        imageUrl: 'barber1.svg',
        barbers: [mockBarber],
      },
    ];

    for (const shop of mockShops) {
      const created = this.barbershopRepository.create(shop);
      const saved = await this.barbershopRepository.save(created);
      
      // Add mock services
      await this.serviceRepository.save(
        this.serviceRepository.create({
          name: 'Corte de Cabelo',
          description: 'Corte clássico ou moderno',
          price: 45.0,
          durationMinutes: 45,
          barbershop: saved,
        })
      );
      await this.serviceRepository.save(
        this.serviceRepository.create({
          name: 'Barba',
          description: 'Modelagem de barba com toalha quente',
          price: 35.0,
          durationMinutes: 30,
          barbershop: saved,
        })
      );
    }
    return 'Seed concluído com sucesso';
  }
}
