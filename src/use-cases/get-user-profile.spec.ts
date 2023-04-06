import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { ResourceNotFound } from "./errors/resource-not-found-error";
import { GetUserProfileUseCase } from "./get-user-profile";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get user profile", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able to get user profile", async () => {
    const userCreated = await usersRepository.create({
      email: "user@example.com",
      password_hash: await hash("123123", 6),
      name: "Jon Doe",
    });

    const { user } = await sut.execute({
      userId: userCreated.id,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual("Jon Doe");
  });

  it("should not be able to get user profile with wrong id", async () => {
    expect(async () => {
      await sut.execute({
        userId: "non-existing-id",
      });
    }).rejects.toBeInstanceOf(ResourceNotFound);
  });
});
