import React, { useState } from "react";

interface AddReaderFormProps {
  onAdd: (reader: { name: string; email?: string; contactNumber: string; address: string }) => void;
  onClose: () => void;
}

const AddReaderForm: React.FC<AddReaderFormProps> = ({ onAdd, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
  };

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
          <h2 className="text-lg font-bold mb-4">Add New Reader</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded-lg"
            />
            <input
                name="email"
                placeholder="Email"
                value={form.email}
                type="email"
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg"
            />
            <input
                name="contactNumber"
                placeholder="Contact Number"
                value={form.contactNumber}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded-lg"
            />
            <input
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded-lg"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default AddReaderForm;
