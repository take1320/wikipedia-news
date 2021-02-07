export type IReferencedUser = {
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export class ReferencedUser {
  private value: ReferencedUser;

  constructor(value: ReferencedUser) {
    this.value = value;
  }
}
