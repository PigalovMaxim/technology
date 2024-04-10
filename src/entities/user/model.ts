import { User, UserFilter } from ".";
import { createUserSchema } from "../../pages/createUser/createUser.options";

class UserModel {
  private userUrl: string = "http://tasks.tizh.ru/v1/user/";
  private fileUrl: string = "http://tasks.tizh.ru/file/get?id=";
  private foodList: Record<string, string> = {};

  async getUserList(filters?: UserFilter): Promise<User[]> {
    try {
      const queryFilters = {
        "UserSearch[id]": filters?.id || '',
        "UserSearch[username]": filters?.name || '',
        "UserSearch[email]": filters?.email || '',
        "UserSearch[birthdateStart]": filters?.dateStart || '',
        "UserSearch[birthdateEnd]": filters?.dateEnd || '',
        "UserSearch[foodIds]": filters?.food || '',
      };
      const queryParams = this.getQueryParams(queryFilters);
      const answer = await fetch(this.userUrl + "index" + queryParams);
      const result: User[] = await answer.json();
      await this.getFoodList();
      const filesPromises: Promise<string>[] = [];
      const userList = result.map((user) => {
        return this.fillCustomFields(user);
      });
      await Promise.all(filesPromises);
      return userList;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async createUser(user: User): Promise<boolean> {
    try {
      createUserSchema.validateSync(user);
      const answer = await fetch(this.userUrl + "create", {
        method: "POST",
        body: this.getFormDataFromUser(user),
      });
      if (!answer.ok) {
        const result = await answer.json();
        alert(this.getAnswerResultError(result));
        return false;
      }
      return true;
    } catch (e: any) {
      alert(e.message);
      return false;
    }
  }

  async updateUser(user: User): Promise<boolean> {
    try {
      createUserSchema.validateSync(user);
      const answer = await fetch(this.userUrl + "update?id=" + user.id, {
        method: "PUT",
        body: this.getFormDataFromUser(user),
      });
      if (!answer.ok) {
        const result = await answer.json();
        alert(this.getAnswerResultError(result));
        return false;
      }
      return true;
    } catch (e: any) {
      alert(e.message);
      return false;
    }
  }

  async removeUser(id: string | number): Promise<void> {
    try {
      await fetch(this.userUrl + "delete?id=" + id, { method: "DELETE" });
    } catch (e) {
      console.error(e);
    }
  }

  async getUser(id: string | number): Promise<User | undefined> {
    try {
      const answer = await fetch(this.userUrl + "view?id=" + id);
      const result = await answer.json();
      return this.fillCustomFields(result);
    } catch (e) {
      console.error(e);
    }
  }

  private getQueryParams(queryObject: Record<string, string>): string {
    let isEmpty = true;
    for (const key of Object.keys(queryObject)) {
      if (!queryObject[key]) continue;
      isEmpty = false;
      break;
    }
    if (isEmpty) return "";
    let queryString = "?";
    Object.entries(queryObject).forEach(([key, value]) => {
      if (!value) return;
      queryString += key + "=" + value + "&";
    });
    return queryString;
  }

  private getAnswerResultError(result: any) {
    const error: Record<string, string[]> = JSON.parse(result.message);
    let errorMessage = "";
    Object.values(error).forEach((errMessage) => {
      errorMessage += errMessage.reduce((acc, value) => acc + value, "");
      errorMessage += "\n";
    });
    return errorMessage;
  }

  private getFormDataFromUser(user: User) {
    const body = new FormData();
    body.append("username", user.username);
    body.append("email", user.email);
    body.append("birthdate", user.birthdate);
    if (user.favorite_food_ids[0])
      body.append("favorite_food_ids", user.favorite_food_ids[0]);
    if (user._photo_link && typeof user._photo_link === "object")
      body.append("upload_photo", user._photo_link);
    return body;
  }

  private fillCustomFields(user: User) {
    user._photo_link = user.photo_id ? this.fileUrl + user.photo_id : "";
    user._favorite_food_names = this.makeFoodListFromIds(
      user.favorite_food_ids[0]
    );
    return user;
  }

  private makeFoodListFromIds(ids: string) {
    const foodList = ids
      ? ids.split(",").map((id) => this.foodList[id])
      : ["Некорректный ID еды"];
    if (!foodList[0]) return ["Некорректный ID еды"];
    return foodList;
  }

  private async getFoodList(): Promise<Record<string, string>> {
    try {
      const answer = await fetch(this.userUrl + "get-food-list");
      const result = await answer.json();
      this.foodList = result;
      return result;
    } catch (e) {
      console.error(e);
      return {};
    }
  }
}

export default new UserModel();
