import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { compare } from "bcryptjs";
import { describe, expect, it } from "vitest";
import { UserEmailAlreadyExistsError } from "./errors/user-email-already-exists-error";
import { RegisterUseCase } from "./register";

describe("Register use case", () => {
  it("should be able to register", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      email: "user@example.com",
      name: "User name",
      password: "123123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to register an email twice", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    await registerUseCase.execute({
      email: "user@example.com",
      name: "User name",
      password: "123123",
    });

    expect(
      async () =>
        await registerUseCase.execute({
          email: "user@example.com",
          name: "User name",
          password: "123123",
        })
    ).rejects.toBeInstanceOf(UserEmailAlreadyExistsError);
  });

  it("should hash user password upon registration", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
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
