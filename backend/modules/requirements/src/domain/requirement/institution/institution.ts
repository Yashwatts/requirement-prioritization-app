import { randomUUID } from 'node:crypto';

export class Institution {
  id!: number;
  uuid: string;
  name: string;

  constructor(name: string, uuid?: string, id?: number) {
    this.name = name;
    this.uuid = uuid ?? randomUUID();
    if (id !== undefined) {
      this.id = id;
    }
  }

  static create(name: string, uuid?: string): Institution {
    return new Institution(name, uuid);
  }
}
