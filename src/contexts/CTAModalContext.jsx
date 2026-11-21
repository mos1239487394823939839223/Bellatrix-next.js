import React, { createContext, useContext, useState } from 'react';
import ContactModal from '../components/ContactModal';
import GlobalCTAInterceptor from '../components/GlobalCTAInterceptor';

const CTAModalContext = createContext();

export const useCTAModal = () => {
  const context = useContext(CTAModalContext);
  if (!context) {
    throw new Error('useCTAModal must be used within a CTAModalProvider');
  }
  return context;
};

export const CTAModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "Contact Bellatrix",
    subtitle: "Tell us about your ERP project. A consultant will reply within one business day.",
    icon: ""
  });

  const openCTAModal = (config = {}) => {
    setModalConfig({
      title: config.title || "Contact Bellatrix",
      subtitle: config.subtitle || "Tell us about your ERP project. A consultant will reply within one business day.",
      icon: config.icon || ""
    });
    setIsModalOpen(true);
  };

  const closeCTAModal = () => {
    setIsModalOpen(false);
  };

  const value = {
    isModalOpen,
    modalConfig,
    openCTAModal,
    closeCTAModal
  };

  return (
    <CTAModalContext.Provider value={value}>
      <GlobalCTAInterceptor>
        {children}
      </GlobalCTAInterceptor>
      <ContactModal
        isOpen={isModalOpen}
        onClose={closeCTAModal}
        title={modalConfig.title}
        subtitle={modalConfig.subtitle}
        icon={modalConfig.icon}
      />
    </CTAModalContext.Provider>
  );
};
