import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { TModalProps } from './type';
import { ModalUI } from '@ui';

const modalRoot = document.getElementById('modals');

export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      e.key === 'Escape' && onClose();
      console.log('Нажата кнопка эскейп');
    };

    document.addEventListener('keydown', handleEsc);
    console.log('Установлен слушатель эскейпа');
    return () => {
      document.removeEventListener('keydown', handleEsc);
      console.log('Удалён слушатель эскейпа');
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <ModalUI title={title} onClose={onClose}>
      {children}
    </ModalUI>,
    modalRoot as HTMLDivElement
  );
});
