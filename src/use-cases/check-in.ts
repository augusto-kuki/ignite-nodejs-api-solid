import { CheckInsRepository } from "@/repositories/check-ins.repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { getDistanceBetweenCoodinates } from "@/utils/get-distance-between-differentes-coordinates";
import { CheckIn } from "@prisma/client";
import { ResourceNotFound } from "./errors/resource-not-found-error";

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFound();
    }

    const distanceBetweenUserAndGym = getDistanceBetweenCoodinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      }
    );

    console.log(distanceBetweenUserAndGym);
    const MAX_DISTANCE_IN_KILOMETERS = 0.1;
    if (distanceBetweenUserAndGym > MAX_DISTANCE_IN_KILOMETERS) {
      throw new Error();
    }

    const userHasCheckinOnSameDay =
      await this.checkInsRepository.findByUserIdOnDate(userId, new Date());

    if (userHasCheckinOnSameDay) {
      throw new Error();
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return {
      checkIn,
    };
  }
}
