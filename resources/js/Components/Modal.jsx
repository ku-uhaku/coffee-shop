import React from 'react';

const Modal = ({ isOpen, onClose, title, children, footer, width = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex ">
      <div className={`relative p-4 bg-white w-full ${width} m-auto flex-col flex rounded-lg`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-black close-modal"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div className="mb-4">{children}</div>
        {footer && (
          <div className="px-2 py-2 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
