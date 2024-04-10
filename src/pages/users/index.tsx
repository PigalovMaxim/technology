import { useEffect, useState } from "react";
import { User, UserFilter, userModel } from "../../entities/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setUsers } from "../../store/slices/user";
import Avatar from "../../shared/avatar";
import { Link } from "react-router-dom";
import EyeIcon from "./assets/eye.png";
import EditIcon from "./assets/edit.png";
import NewIcon from "./assets/new.png";
import RemoveIcon from "./assets/remove.png";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useForm } from "react-hook-form";
import _ from "lodash";

function Users() {
  const userStore = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();
  const { register, watch, setValue } = useForm<UserFilter>();
  const [isLoading, setIsLoading] = useState(false);

  const onUserRemove = async (user: User) => {
    setIsLoading(true);
    await userModel.removeUser(user.id);
    const _users = userStore.users.filter((_user) => _user.id !== user.id);
    dispatch(setUsers(_users));
    setIsLoading(false);
  };

  const getData = _.debounce(async (filters?: UserFilter) => {
    const users = await userModel.getUserList(filters);
    dispatch(setUsers(users));
  }, 500);

  useEffect(() => {
    const subscription = watch((value) => {
      // @ts-ignore
      getData(value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="users">
      <table className="user-list">
        <thead>
          <tr className="user-list__user user-list__user_header">
            <td>#</td>
            <td>
              <span>ID</span>
              <TextField
                {...register("id")}
                fullWidth
                label="ID"
                variant="outlined"
              />
            </td>
            <td>Фото</td>
            <td>
              <span>Имя</span>
              <TextField
                {...register("name")}
                fullWidth
                label="Имя"
                variant="outlined"
              />
            </td>
            <td>
              <span>Email</span>
              <TextField
                {...register("email")}
                fullWidth
                label="Email"
                variant="outlined"
              />
            </td>
            <td>
              <span>Дата рождения</span>
              <div className="user-list__filters">
                <DatePicker
                  {...register("dateStart")}
                  onChange={(value) => {
                    setValue("dateStart", value?.format("DD.MM.YYYY") || "");
                  }}
                />
                <DatePicker
                  {...register("dateEnd")}
                  onChange={(value) => {
                    setValue("dateEnd", value?.format("DD.MM.YYYY") || "");
                  }}
                />
              </div>
            </td>
            <td>
              <span>Любимая еда</span>
              <TextField
                {...register("food")}
                fullWidth
                label="Любимая еда"
                variant="outlined"
              />
            </td>
            <td>
              <Link className="user-list__link" to={`/create`}>
                <img src={NewIcon} alt="create" />
              </Link>
            </td>
          </tr>
        </thead>
        <tbody>
          {userStore.users.map((user, i) => (
            <tr key={user.id} className="user-list__user">
              <td>{i + 1}</td>
              <td>{user.id}</td>
              <td>
                <Avatar src={user._photo_link as string} alt="user" />
              </td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.birthdate}</td>
              <td>{user._favorite_food_names?.join(", ")}</td>
              <td>
                <Link className="user-list__link" to={`/${user.id}`}>
                  <img src={EyeIcon} alt="view" />
                </Link>
                <Link className="user-list__link" to={`/edit/${user.id}`}>
                  <img src={EditIcon} alt="edit" />
                </Link>
                <button
                  disabled={isLoading}
                  onClick={() => onUserRemove(user)}
                  className="user-list__link"
                >
                  <img src={RemoveIcon} alt="remove" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
