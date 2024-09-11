export class Principal {
  readonly id: string;
  readonly name: string;
  readonly roles: string[];

  constructor(id: string, name: string, roles: string[]) {
    this.id = id;
    this.name = name;
    this.roles = roles;
  }
}
