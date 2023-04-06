import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { compare } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { UserEmailAlreadyExistsError } from "./errors/user-email-already-exists-error";
import { RegisterUseCase } from "./register";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      email: "user@example.com",
      name: "User name",
      password: "123123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to register an email twice", async () => {
    await sut.execute({
      email: "user@example.com",
      name: "User name",
      password: "123123",
    });

    expect(
      async () =>
        await sut.execute({
          email: "user@example.com",
          name: "User name",
          password: "123123",
        })
    ).rejects.toBeInstanceOf(UserEmailAlreadyExistsError);
  });

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      email: "user@example.com",
      name: "User name",
      password: "123123",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123123",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBeTruthy();
  });
});
