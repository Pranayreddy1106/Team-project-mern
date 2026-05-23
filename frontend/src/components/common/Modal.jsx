export default function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4'>
      <div className='bg-card rounded-3xl p-8 border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-3xl font-bold'>{title}</h2>
          <button
            onClick={onClose}
            className='text-2xl text-gray-400 hover:text-white transition'
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}