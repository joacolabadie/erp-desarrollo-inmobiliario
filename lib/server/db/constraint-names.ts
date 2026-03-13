import { createHash } from "crypto";

type ConstraintNameArgs = {
  table: string;
  kind: "uq" | "uqx" | "fk";
  parts: string[];
};

export function generateConstraintName({
  table,
  kind,
  parts,
}: ConstraintNameArgs) {
  const hash = createHash("sha1")
    .update([table, kind, ...parts].join("__"))
    .digest("hex")
    .slice(0, 10);

  return `${table}__${kind}__${hash}`;
}
