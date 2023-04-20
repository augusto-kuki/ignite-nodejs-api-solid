import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("Get user metrics", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it("should be able to get user metrics", async () => {
    await checkInsRepository.create({
      gym_id: "gym-id",
      user_id: "user-id",
    });
    await checkInsRepository.create({
      gym_id: "gym-id-02",
      user_id: "user-id",
    });

    const { checkInsCount } = await sut.execute({
      userId: "user-id",
    });

    expect(checkInsCount).toEqual(2);
  });
});
