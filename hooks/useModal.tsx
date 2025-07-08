'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Modal, Box, Typography } from '@mui/material';
import Frame from '@/components/UI/Frame';

// Определяем типы для модального окна
interface ModalOptions {
  title?: string;
  content?: ReactNode;
  actions?: ReactNode;
}

interface ModalContextType {
  showModal: (options: ModalOptions) => void;
  closeModal: () => void;
}

// Создаем контекст
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Хук для использования модального контекста
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal должен быть использован внутри ModalProvider");
  }
  return context;
};

// Провайдер с поддержкой стека модальных окон
export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalStack, setModalStack] = useState<ModalOptions[]>([]);

  // Функция для отображения нового модального окна (добавляем в стек)
  const showModal = (options: ModalOptions) => {
    setModalStack((prev) => [...prev, options]);
  };

  // Функция для закрытия текущего модального окна (удаляем верхний элемент из стека)
  const closeModal = () => {
    setModalStack((prev) => prev.slice(0, -1));
  };

  const currentModal = modalStack.length > 0 ? modalStack[modalStack.length - 1] : null;

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}

      {/* Отображаем только верхнее модальное окно в стеке */}
      <Modal open={!!currentModal} onClose={closeModal}>
        <Frame
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
          }}
        >
          {currentModal?.title && <Typography variant="h6">{currentModal.title}</Typography>}
          {currentModal?.content}
          {currentModal?.actions && <Box>{currentModal.actions}</Box>}
        </Frame>
      </Modal>
    </ModalContext.Provider>
  );
};
