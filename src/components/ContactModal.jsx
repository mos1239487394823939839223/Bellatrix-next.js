import React from "react";

import Modal from "./Modal";

import ContactForm from "./ContactForm";



const ContactModal = ({ isOpen, onClose, title = "Contact Us", subtitle = "Let's discuss your project requirements", icon = "" }) => {

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

