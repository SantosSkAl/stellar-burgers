import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { clearError, loginUserThunk } from '../../services/userSlice';
import { useForm } from '../../hooks/useForm';
import { TUser } from '@utils-types';
import { TLoginData } from '@api';

export const Login: FC = () => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // при подобной замене внимание на типы и контракты для всех причасных!!!
  // нужно иправить глобальные типы, и, помимо данного компонента login, еще
  // исправить компонентты register и forgot-password. Компонент
  // reset-password можно не обновлять, так как у него нет конфликтов
  // с глобальным полями, но можно и перевести на useForm для консистентности
  const [values, onValueChange] = useForm({ email: '', password: '' });
  const dispatch = useDispatch();
  const errorText = useSelector((store) => store.user.error as string);

  useEffect(() => {
    dispatch(clearError());
  }, []);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUserThunk(values));
  };

  return (
    <LoginUI
      errorText={errorText}
      email={values.email}
      setEmail={onValueChange}
      password={values.password}
      setPassword={onValueChange}
      handleSubmit={handleSubmit}
    />
  );
};
