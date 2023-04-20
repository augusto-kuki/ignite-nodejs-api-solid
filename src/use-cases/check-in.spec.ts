import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./check-in";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in use case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.gyms.push({
      description: "Gym",
      id: "gym-id",
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      phone: "123123",
      title: "Gym",
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in ", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-id",
      userId: "user-id",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice on the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 1, 8, 0, 0));

    await sut.execute({
      gymId: "gym-id",
      userId: "user-id",
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-id",
        userId: "user-id",
        userLatitude: 0,
        userLongitude: 0,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 1, 8, 0, 0));

    await sut.execute({
      gymId: "gym-id",
      userId: "user-id",
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2022, 0, 3, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-id",
      userId: "user-id",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check on distant gym", async () => {
    gymsRepository.gyms.push({
      description: "Gym",
      id: "gym-id",
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-49.2092052),
      phone: "123123",
      title: "Gym",
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-id",
        userId: "user-id",
        userLatitude: -28.2538114,
        userLongitude: -52.4075443,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
