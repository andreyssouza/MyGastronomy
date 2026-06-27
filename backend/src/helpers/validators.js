import Joi from "joi";

const emailSchema = Joi.string().email().required().messages({
  "string.email": "Email deve ser válido",
  "any.required": "Email é obrigatório",
});

const passwordSchema = Joi.string().min(6).required().messages({
  "string.min": "Senha deve ter no mínimo 6 caracteres",
  "any.required": "Senha é obrigatória",
});

const fullnameSchema = Joi.string().min(3).max(100).required().messages({
  "string.min": "Nome deve ter no mínimo 3 caracteres",
  "string.max": "Nome não pode ter mais de 100 caracteres",
  "any.required": "Nome é obrigatório",
});

// Validação de Login
export const validateLogin = (data) => {
  const schema = Joi.object({
    email: emailSchema,
    password: passwordSchema,
  });

  return schema.validate(data);
};

// Validação de Signup
export const validateSignup = (data) => {
  const schema = Joi.object({
    fullname: fullnameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
      "any.only": "Senhas não conferem",
      "any.required": "Confirmação de senha é obrigatória",
    }),
  });

  return schema.validate(data);
};

// Validação de Prato
export const validatePlate = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      "string.min": "Nome do prato deve ter no mínimo 2 caracteres",
      "string.max": "Nome do prato não pode ter mais de 100 caracteres",
      "any.required": "Nome do prato é obrigatório",
    }),
    description: Joi.string().max(500),
    price: Joi.number().positive().required().messages({
      "number.positive": "Preço deve ser maior que 0",
      "any.required": "Preço é obrigatório",
    }),
    available: Joi.boolean().default(true),
    imgUrl: Joi.string().uri(),
  });

  return schema.validate(data);
};
