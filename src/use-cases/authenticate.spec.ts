import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate user", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to authenticate", async () => {
    await usersRepository.create({
      email: "user@example.com",
      password_hash: await hash("123123", 6),
      name: "Jon Doe",
    });

    const { user } = await sut.execute({
      email: "user@example.com",
      password: "123123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong e-mail", async () => {
    expect(async () => {
      await sut.execute({
        email: "user@example.com",
        password: "123123",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      email: "user@example.com",
      password_hash: await hash("123467", 6),
      name: "Jon Doe",
    });
    expect(async () => {
      await sut.execute({
        email: "user@example.com",
        password: "123123",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
