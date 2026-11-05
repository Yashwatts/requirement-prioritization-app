export class Institution {
  id!: number;
  uuid!: string;
  name: string;

  constructor(name: string, uuid?: string) {
    this.name = name;
    if (uuid) {
      this.uuid = uuid;
    }
  }

  static create(name: string, uuid?: string): Institution {
    return new Institution(name, uuid);
  }
}
