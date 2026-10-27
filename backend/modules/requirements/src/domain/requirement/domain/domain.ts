import { randomUUID } from 'node:crypto';

export class Domain {
  id!: number;
  uuid: string;
  abbreviation: string;
  name: string;
  translations?: Record<string, unknown> | null;
  email?: string | null;

  constructor(
    name: string,
    abbreviation: string,
    email?: string | null,
    translations?: Record<string, unknown> | null,
    uuid?: string,
    id?: number,
  ) {
    this.name = name;
    this.abbreviation = abbreviation;
    this.email = email ?? null;
    this.translations = translations ?? null;
    this.uuid = uuid ?? randomUUID();
    if (id !== undefined) {
      this.id = id;
    }
  }

  static create(
    name: string,
    abbreviation: string,
    email?: string | null,
    translations?: Record<string, unknown> | null,
    uuid?: string,
  ): Domain {
    return new Domain(name, abbreviation, email, translations, uuid);
  }
}
