import { useState } from "react";

const useCalendarPage = (resetForm: () => void) => {
  const [openModal, setOpenModal] = useState(false);
  const [confirmDelModal, setConfirmDelModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleResetAndClose = () => {
    setOpenModal(false);
    resetForm();
  };

  const handleCloseModalAfterDeleteEvent = () => {
    setOpenModal(false);
    setConfirmDelModal(false);
    setEditingId(null);
    resetForm();
  };

  return {
    handleResetAndClose,
    handleCloseModalAfterDeleteEvent,
    openModal,
    setOpenModal,
    confirmDelModal,
    setConfirmDelModal,
    editingId,
    setEditingId,
  };
};

export default useCalendarPage;
