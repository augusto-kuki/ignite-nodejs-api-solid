import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsHistoryUseCase;

describe("Fetch user check-ins history", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository);
  });

  it("should be able to fetch check in history ", async () => {
    await checkInsRepository.create({
      gym_id: "gym-id",
      user_id: "user-id",
    });
    await checkInsRepository.create({
      gym_id: "gym-id-02",
      user_id: "user-id",
    });

    const { checkIns } = await sut.execute({
      userId: "user-id",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-id" }),
      expect.objectContaining({ gym_id: "gym-id-02" }),
    ]);
  });

  it("should be able to fetch paginated check-in history ", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-id-${i}`,
        user_id: "user-id",
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-id",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-id-21" }),
      expect.objectContaining({ gym_id: "gym-id-22" }),
    ]);
  });
});
