export interface WithId {
  id: number;
}

export interface CRUD {
  getAll<T extends WithId>(collection: any): Promise<T[]>;
  getById<T extends WithId>(collection: any, id: number): Promise<T | null>;
  create<T>(collection: any, data: T): Promise<T & WithId>;
  createMany<T>(collection: any, data: T[]): Promise<(T & WithId)[]>;
  update<T extends WithId>(
    collection: any,
    data: Partial<T>,
    id?: number,
  ): Promise<T | null>;
  delete(collection: any, id: string): Promise<boolean>;
}

export interface IRepository {
  getAll<T extends WithId>(collection: any): Promise<T[]>;
  getById<T extends WithId>(collection: any, id: number): Promise<T | null>;
  create<T>(collection: any, data: T): Promise<T & WithId>;
  createMany<T>(collection: any, data: T[]): Promise<(T & WithId)[]>;
  update<T extends WithId>(
    collection: any,
    data: Partial<T>,
    id?: number,
  ): Promise<T | null>;
  delete(collection: any, id: string): Promise<boolean>;
}

export interface IService {
  getAll<T extends WithId>(collection: any): Promise<T[]>;
  getById<T extends WithId>(collection: any, id: number): Promise<T | null>;
  create<T extends WithId>(collection: any, data: T): Promise<T>;
  update<T extends WithId>(
    collection: any,
    data: Partial<T>,
    id?: number,
  ): Promise<T | null>;
  delete(collection: any, id: string): Promise<boolean>;
}
