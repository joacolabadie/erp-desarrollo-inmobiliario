import { z } from "zod";

const uuidSchema = z.uuid();

type IsValidUuidArgs = {
  value: string;
};

export function isValidUuid({ value }: IsValidUuidArgs): boolean {
  return uuidSchema.safeParse(value).success;
}
