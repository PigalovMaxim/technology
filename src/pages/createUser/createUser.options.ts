import { object, string, number, array } from "yup";

export const changeUserSchema = object({
  id: number().positive().required(),
  username: string().required("Имя является обязательным полем."),
  email: string()
    .email("Поле Email должно содержать корректный email адрес.")
    .required("Email является обязательным полем."),
  birthdate: string()
    .required("Дата рождения является обязательным полем.")
    .matches(
      /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/g,
      "Неверный формат даты рождения. Используйте формат ДД.ММ.ГГГГ"
    ),
  favorite_food_ids: array().of(string()),
  photo_id: number().positive().nullable(),
  _photo_link: string().nullable(),
  _favorite_food_names: array().nullable(),
});

export const createUserSchema = object({
  username: string().required("Имя является обязательным полем."),
  email: string()
    .email("Поле Email должно содержать корректный email адрес.")
    .required("Email является обязательным полем."),
  birthdate: string()
    .required("Дата рождения является обязательным полем.")
    .matches(
      /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/g,
      "Неверный формат даты рождения. Используйте формат ДД.ММ.ГГГГ"
    ),
  favorite_food_ids: array().of(string()).nullable(),
  photo_id: number().positive().nullable(),
});
