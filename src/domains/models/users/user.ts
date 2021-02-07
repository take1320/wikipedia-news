export type TUser = {
  id: string;
  name: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export class User implements TUser {
  id: string;
  name: string;
  createdAt: Date | null;
  updatedAt: Date | null;

  constructor(value: TUser) {
    this.id = value.id;
    this.name = value.name;
    this.createdAt = value.createdAt;
    this.updatedAt = value.updatedAt;
  }
}
