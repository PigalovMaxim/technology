export type User = {
  id: number;
  username: string;
  email: string;
  birthdate: string;
  favorite_food_ids: string[];
  photo_id: number | null;
  // Поля для отрисовки
  _photo_link?: string | File;
  _favorite_food_names?: string[];
};

export type UserFilter = {
  id: string;
  name: string;
  email: string;
  dateStart: string;
  dateEnd: string;
  food: string;
}

import userModel from "./model";
export { userModel };
