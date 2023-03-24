import { Prisma, User } from "@prisma/client";
import { randomUUID } from "crypto";
import { UsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = [];
  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email);

    if (!user) {
      return null;
    }
    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      email: data.email,
      name: data.name,
      password_hash: data.password_hash,
      created_at: new Date(),
      id: randomUUID(),
    };

    this.users.push(user);

    return user;
  }
}
