import { MdChevronLeft } from "react-icons/md";

const PageHeader = ({ onSave, onCancel }) => (
  <header className="mb-10 md:mb-12">

    {/* Title + actions */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
      <h2 className="text-3xl md:text-4xl font-black text-neutral-900">
        إعدادات نظام الترويج
      </h2>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="px-5 py-2 bg-white text-neutral-900 font-bold border border-neutral-200 hover:bg-neutral-100 transition-colors text-sm"
        >
          إلغاء
        </button>
        <button
          onClick={onSave}
          className="px-7 py-2 bg-[#ff5c00] text-white font-bold hover:bg-[#e65200] transition-all active:scale-95 text-sm"
        >
          حفظ التغييرات
        </button>
      </div>
    </div>
  </header>
);

export default PageHeader;
