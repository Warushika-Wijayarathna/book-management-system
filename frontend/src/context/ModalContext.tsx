import React, { createContext, useContext, useState } from "react";

interface ModalContextType {
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <ModalContext.Provider value={{ isModalOpen, setModalOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModalContext must be used within a ModalProvider");
  return context;
};

