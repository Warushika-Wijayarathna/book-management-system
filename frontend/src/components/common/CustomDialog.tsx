import React from "react";

interface CustomDialogProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
                                                       title,
                                                       message,
                                                       onConfirm,
                                                       onCancel,
                                                       confirmText = "Yes",
                                                       cancelText = "No",
                                                   }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
                <h2 className="text-lg font-bold mb-2">{title}</h2>
                <p className="mb-4 text-sm text-gray-600">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomDialog;
