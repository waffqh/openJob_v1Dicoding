/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.addColumns("jobs", {
    job_type: {
      type: "VARCHAR(50)",
      notNull: false,
    },
    experience_level: {
      type: "VARCHAR(50)",
      notNull: false,
    },
    location_type: {
      type: "VARCHAR(50)",
      notNull: false,
    },
    status: {
      type: "VARCHAR(50)",
      notNull: false,
      default: "open",
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: false,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "TIMESTAMP",
      notNull: false,
      default: pgm.func("now()"),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropColumns("jobs", [
    "job_type",
    "experience_level",
    "location_type",
    "status",
    "created_at",
    "updated_at",
  ]);
};
