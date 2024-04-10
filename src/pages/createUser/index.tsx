import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, userModel } from "../../entities/user";
import { useForm, SubmitHandler } from "react-hook-form";
import Avatar from "../../shared/avatar";
import { TextField } from "@mui/material";

export default function CreateUser() {
  const params = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<User>({
    defaultValues: { _photo_link: "", favorite_food_ids: [] },
  });
  const [isCreateUserPage, setIsCreateUserPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<User> = async (data) => {
    setIsLoading(true);
    let result = false;
    if (isCreateUserPage) {
      result = await userModel.createUser(data);
    } else {
      result = await userModel.updateUser(data);
    }
    setIsLoading(false);
    if (result) navigate("/");
  };

  useEffect(() => {
    const getData = async () => {
      if (!params.id) return setIsCreateUserPage(true);
      const user = await userModel.getUser(params?.id);
      if (!user) return;
      Object.entries(user).forEach(([key, value]) => {
        setValue(
          key as keyof typeof user,
          Array.isArray(value) ? value[0] : value
        );
      });
    };
    getData();
  }, []);

  const _photoLink = watch("_photo_link");
  let photoLink =
    typeof _photoLink === "object"
      ? URL.createObjectURL(_photoLink)
      : _photoLink;

  return (
    <form className="user-create" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        fullWidth
        style={{ marginBottom: '10px' }}
        variant="outlined"
        placeholder="Имя"
        {...register("username", { required: true })}
      />
      {errors.username && (
        <span className="user-create__error">This field is required</span>
      )}
      <TextField
        fullWidth
        style={{ marginBottom: '10px' }}
        variant="outlined"
        placeholder="Email"
        {...register("email", { required: true })}
      />
      {errors.email && (
        <span className="user-create__error">This field is required</span>
      )}
      <TextField
        fullWidth
        style={{ marginBottom: '10px' }}
        variant="outlined"
        placeholder="Дата рождения"
        {...register("birthdate", { required: true })}
      />
      {errors.birthdate && (
        <span className="user-create__error">This field is required</span>
      )}
      <div className="user-create__file-input">
        <label htmlFor="photo">Загрузите фотографию</label>
        <input
          type="file"
          id="photo"
          {...register("_photo_link", {
            onChange: (event) => setValue("_photo_link", event.target.files[0]),
          })}
        />
        <Avatar src={photoLink} alt="photo" className="user-create__avatar" />
      </div>
      <TextField
        fullWidth
        style={{ marginBottom: '10px' }}
        variant="outlined"
        placeholder="Любимая еда (id через запятую)"
        {...register("favorite_food_ids", { setValueAs: (value) => [value] })}
      />
      <input
        className="user-create__submit"
        type="submit"
        disabled={isLoading}
        value={
          isCreateUserPage ? "Создать пользователя" : "Изменить пользователя"
        }
      />
    </form>
  );
}
