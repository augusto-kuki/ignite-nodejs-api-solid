import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";

interface CreateGymRequest {
  description: string | null;
  phone: string | null;
  title: string;
  latitude: number;
  longitude: number;
}

interface CreateGymResponse {
  gym: Gym;
}

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    description,
    latitude,
    longitude,
    title,
    phone,
  }: CreateGymRequest): Promise<CreateGymResponse> {
    const gym = await this.gymsRepository.create({
      latitude,
      longitude,
      title,
      description,
      phone,
    });

    return { gym };
  }
}
