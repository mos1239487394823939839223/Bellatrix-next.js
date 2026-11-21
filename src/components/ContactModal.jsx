import React from "react";

import Modal from "./Modal";

import ContactForm from "./ContactForm";



const ContactModal = ({ isOpen, onClose, title = "Contact Bellatrix", subtitle = "Tell us about your ERP project. A consultant will reply within one business day.", icon = "" }) => {

  return (

    <Modal

      isOpen={isOpen}

      onClose={onClose}

      title={title}

      subtitle={subtitle}

      icon={icon}

    >

      <ContactForm onDone={onClose} />

    </Modal>

  );

};



export default ContactModal;

