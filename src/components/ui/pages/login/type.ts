import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { PageUIProps } from '../common-type';

export type LoginUIProps = PageUIProps & {
  password: string;
  // если будет один общий onChange, тут, и в других
  // аналогичных местах, setPassword (или аналоги) вообще убрать
  // setPassword: Dispatch<SetStateAction<string>>;
  setPassword: (e: ChangeEvent<HTMLInputElement>) => void
};
