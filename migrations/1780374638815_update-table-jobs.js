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
  pgm.renameColumn("jobs", "location", "location_city");
  pgm.addColumn("jobs", {
    created_by: {
      type: "varchar(50)",
      references: "users(id)",
      onDelete: "CASCADE",
      notNull: true,
    },
    salary_min: {
      type: "integer",
      default: 0,
    },
    salary_max: {
      type: "integer",
      default: 0,
    },
    is_salary_visible: {
      type: "boolean",
      default: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.renameColumn("jobs", "location_city", "location");
  pgm.dropColumn("jobs", [
    "created_by",
    "salary_min",
    "salary_max",
    "is_salary_visible",
  ]);
};
