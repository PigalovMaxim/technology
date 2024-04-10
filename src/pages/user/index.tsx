import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { User, userModel } from "../../entities/user";
import Avatar from "../../shared/avatar";

export default function UserPage() {
  const params = useParams();
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const getData = async () => {
      if (!params.id) return;
      const user = await userModel.getUser(params?.id);
      setUser(user);
    };
    getData();
  }, []);

  return (
    <div className="user">
      <div className="user__avatar">
        <Avatar src={user?._photo_link} alt="user"/>
      </div>
      <h2 className="user__name">Имя: {user?.username}</h2>
      <h2 className="user__email">Email: {user?.email}</h2>
      <h2 className="user__birthdate">Дата рождения: {user?.birthdate}</h2>
      <h2 className="user__foods">Любимая еда: {user?._favorite_food_names?.join(', ')}</h2>
    </div>
  )
}