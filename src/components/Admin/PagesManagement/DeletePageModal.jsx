import { ConfirmDialog } from "../ui";

const DeletePageModal = ({ isOpen, onClose, page, onConfirm, loading }) => (
  <ConfirmDialog
    open={isOpen}
    onClose={() => !loading && onClose()}
    onConfirm={onConfirm}
    loading={loading}
    title="Delete this page?"
    description={`"${page?.title || page?.slug || "This page"}" and all of its sections will be permanently removed. This can't be undone.`}
    confirmLabel="Delete page"
  />
);

export default DeletePageModal;
