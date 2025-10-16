import { Prisma } from "@prisma/client";
import { z } from "zod";

import { NotFoundError } from "@/lib/errors";

type CrudRepository<TEntity, CreateInput, UpdateInput> = {
  create(data: CreateInput): Promise<TEntity>;
  list(): Promise<TEntity[]>;
  getById(id: number): Promise<TEntity | null>;
  update(id: number, data: UpdateInput): Promise<TEntity>;
  delete(id: number): Promise<void>;
};

type PrismaDelegate<TEntity, CreateInput, UpdateInput> = {
  create(args: { data: CreateInput }): Promise<TEntity>;
  findMany(args?: { orderBy?: Record<string, unknown> }): Promise<TEntity[]>;
  findUnique(args: { where: { id: number } }): Promise<TEntity | null>;
  update(args: { where: { id: number }; data: UpdateInput }): Promise<TEntity>;
  delete(args: { where: { id: number } }): Promise<TEntity>;
};

type RepositoryOptions = {
  orderBy?: Record<string, unknown>;
};

export function createPrismaCrudRepository<TEntity, CreateInput, UpdateInput>(
  delegate: PrismaDelegate<TEntity, CreateInput, UpdateInput>,
  options: RepositoryOptions = {}
): CrudRepository<TEntity, CreateInput, UpdateInput> {
  const orderBy = options.orderBy ?? { createdAt: "desc" };

  return {
    create: (data) => delegate.create({ data }),
    list: () => delegate.findMany({ orderBy }),
    getById: (id) => delegate.findUnique({ where: { id } }),
    update: async (id, data) => {
      try {
        return await delegate.update({ where: { id }, data });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          throw new NotFoundError();
        }

        throw error;
      }
    },
    delete: async (id) => {
      try {
        await delegate.delete({ where: { id } });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          throw new NotFoundError();
        }

        throw error;
      }
    },
  };
}

type SerializeFn<TEntity> = (entity: TEntity) => unknown;

type CrudService<TEntity, CreateSchema extends z.ZodTypeAny, UpdateSchema extends z.ZodTypeAny> = {
  create(payload: unknown): Promise<ReturnType<SerializeFn<TEntity>>>;
  list(): Promise<ReturnType<SerializeFn<TEntity>>[]>;
  getById(id: number): Promise<ReturnType<SerializeFn<TEntity>>>;
  update(id: number, payload: unknown): Promise<ReturnType<SerializeFn<TEntity>>>;
  delete(id: number): Promise<void>;
};

export function createCrudService<TEntity, CreateSchema extends z.ZodTypeAny, UpdateSchema extends z.ZodTypeAny>(
  repository: CrudRepository<TEntity, z.infer<CreateSchema>, z.infer<UpdateSchema>>,
  schemas: {
    create: CreateSchema;
    update: UpdateSchema;
  },
  options: {
    serialize?: SerializeFn<TEntity>;
  } = {}
): CrudService<TEntity, CreateSchema, UpdateSchema> {
  const serialize = options.serialize ?? ((entity: TEntity) => entity);

  return {
    async create(payload: unknown) {
      const data = schemas.create.parse(payload);
      const entity = await repository.create(data);

      return serialize(entity);
    },
    async list() {
      const entities = await repository.list();

      return entities.map((entity) => serialize(entity));
    },
    async getById(id: number) {
      const entity = await repository.getById(id);

      if (!entity) {
        throw new NotFoundError();
      }

      return serialize(entity);
    },
    async update(id: number, payload: unknown) {
      const data = schemas.update.parse(payload);
      const entity = await repository.update(id, data);

      return serialize(entity);
    },
    async delete(id: number) {
      await repository.delete(id);
    },
  };
}
