import { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent } from 'react';

export type PageUIProps = {
  errorText: string | undefined;
  email: string;
  // можно установить тут универсальный onChange и юзать для всех полей
  // setEmail: Dispatch<SetStateAction<string>>;
  setEmail: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: SyntheticEvent) => void;
};
