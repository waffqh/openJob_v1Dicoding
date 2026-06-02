import Joi from "joi";

export const jobSchema = Joi.object({
  company_id: Joi.string().required(),
  category_id: Joi.string().required(),
  salary_min: Joi.number(),
  salary_max: Joi.number(),
  is_salary_visible: Joi.boolean(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  job_type: Joi.string(),
  experience_level: Joi.string(),
  location_city: Joi.string(),
  location_type: Joi.string(),
  status: Joi.string(),
});

export const updateJobSchema = Joi.object({
  company_id: Joi.string(),
  category_id: Joi.string(),
  salary_min: Joi.number(),
  salary_max: Joi.number(),
  is_salary_visible: Joi.boolean(),
  title: Joi.string(),
  description: Joi.string(),
  job_type: Joi.string(),
  experience_level: Joi.string(),
  location_city: Joi.string(),
  location_type: Joi.string(),
  status: Joi.string(),
});
