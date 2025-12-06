import { ChangeEvent, useState } from 'react';

// export function useForm<T extends Record<string, string>>(
export function useForm<T extends { [key: string]: string }>(
  baseForm: T
): [T, (e: ChangeEvent<HTMLInputElement>) => void] {
  const [form, setForm] = useState<T>(baseForm);

  function handleChange({ target }: ChangeEvent<HTMLInputElement>) {
    setForm((pastForm) => ({ ...pastForm, [target.name]: target.value }));
  }

  function reset() {
    setForm(baseForm);
  }

  // в form обьект со всеми полями, а хендлер обрабатывает только одно,
  // то, которое приходит из event.target. Если понадобится устанавливать
  // всю форму целиком (и не дефолтными значениями), будем отдавать setForm
  return [form, handleChange]; // если возвращаем кортеж - надо типизировать
  // return { form, setForm, handleChange, reset } // обьект не нуждается в типах
}
