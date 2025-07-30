export default function Footer() {
  return (
    <footer className="text-gray-500 text-sm py-8 px-5 shadow-xl shadow-white">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
        <p>
          &copy; {new Date().getFullYear()}{' '}
          <span className="font-semibold text-gray-800">FlowMetrics</span>. All rights reserved.
        </p>
        <p>
          Built by{' '}
          <span className="text-gray-700 font-medium">Alif Haikal</span> from{' '}
          <span className="text-emerald-600 font-semibold">Flowdev Teams</span>
        </p>
      </div>
    </footer>
  );
}
