import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'test', 'prod').default('dev'),
  MONGODB: Joi.string().required(),
  PORT: Joi.number().default(3001),
  DEFAULT_LIMIT: Joi.number().default(7),
});
