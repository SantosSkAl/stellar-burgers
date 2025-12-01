import { FC, useEffect, useRef, useState } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';

// добавим джаги
const LOGO_SOUND_URL =
  'https://raw.githubusercontent.com/SantosSkAl/stellar-burgers-assets/refs/heads/main/stellarburgers.mp3';

export const AppHeader: FC = () => {
  const user = useSelector((store) => store.user.user);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLogoPlaying, setIsLogoPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(LOGO_SOUND_URL);
    audio.loop = true;
    audioRef.current = audio;

    return () => {
      // при размонтировании хедера останавливаем звук
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const handleLogoClick = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isLogoPlaying) {
      audio.pause();
      setIsLogoPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsLogoPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <AppHeaderUI
      userName={user?.name}
      onLogoClick={handleLogoClick}
      isLogoPlaying={isLogoPlaying}
    />
  );
};
