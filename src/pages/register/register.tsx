import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { clearError, registerUserThunk } from '../../services/userSlice';
import { useForm } from '../../hooks/useForm';

export const Register: FC = () => {
  // const [userName, setUserName] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [values, onValueChange] = useForm({
    name: '',
    email: '',
    password: ''
  });
  const dispatch = useDispatch();
  const errorText = useSelector((store) => store.user.error as string);

  useEffect(() => {
    dispatch(clearError());
  }, []);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUserThunk(values));
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={values.email}
      userName={values.name}
      password={values.password}
      setEmail={onValueChange}
      setPassword={onValueChange}
      setUserName={onValueChange}
      handleSubmit={handleSubmit}
    />
  );
};
