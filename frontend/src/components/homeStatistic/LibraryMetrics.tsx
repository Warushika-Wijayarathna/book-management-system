import {  UserIcon } from "../../icons";

export default function LibraryMetrics() {
  return (
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border p-5 bg-white">
          <div className="flex items-center">
            <h4 className="ml-3 text-lg font-semibold">Total Books</h4>
          </div>
          <p className="mt-2 text-2xl font-bold">12,345</p>
        </div>
        <div className="rounded-2xl border p-5 bg-white">
          <div className="flex items-center">
            <UserIcon className="text-green-500" />
            <h4 className="ml-3 text-lg font-semibold">Total Borrowers</h4>
          </div>
          <p className="mt-2 text-2xl font-bold">1,234</p>
        </div>
      </div>
  );
}
