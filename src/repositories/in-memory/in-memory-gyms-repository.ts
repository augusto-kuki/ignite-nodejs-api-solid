import { Gym, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { GymsRepository } from "../gyms-repository";

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async findById(id: string): Promise<Gym | null> {
    const gym = this.gyms.find((g) => g.id === id);

    if (!gym) {
      return null;
    }
    return gym;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: randomUUID(),
      description: data.description ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      phone: data.phone ?? null,
      title: data.title,
    };

    this.gyms.push(gym);

    return gym;
  }
}
