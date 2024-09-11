import { Injectable } from '@nestjs/common';

/**
 * Warning: this is just for testing!
 */
@Injectable()
export class AuthRepository {
  private readonly users = [
    {
      userId: '36ae7f22-a608-4964-b813-44e050d5cc6e',
      username: 'bob',
      password: 'changeme',
      roles: ['admin'],
    },
    {
      userId: '7b8334a9-f687-4a51-84c1-01bbad7e993c',
      username: 'alice',
      password: 'guess',
      roles: ['user'],
    },
  ];

  async findOne(username: string) {
    return this.users.find((user) => user.username === username);
  }
}
