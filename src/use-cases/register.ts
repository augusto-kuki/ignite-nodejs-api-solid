import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private usersRepository: any) {}

  async execute({ name, email, password }: RegisterRequest) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new Error("E-mail already exists.");
    }

    const user = await this.usersRepository.create({
      email,
      name,
      password_hash,
    });

    return user;
  }
}
