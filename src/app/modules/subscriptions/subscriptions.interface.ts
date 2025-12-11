export interface ISubscription {
  id?: string;
  name: string;
  price: number;
  durationInDays: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
