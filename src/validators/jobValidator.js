import Joi from 'joi';

export const jobSchema = Joi.object({
  company_id: Joi.string().required(),
  category_id: Joi.string().required(),

  title: Joi.string().required(),
  description: Joi.string().required(),

  job_type: Joi.string(),
  experience_level: Joi.string(),
  location_type: Joi.string(),
  status: Joi.string(),
});