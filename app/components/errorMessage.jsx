
export default function ErrorMessage({ message }) {
  return (
    <div className="shadow-md shadow-emerald-500   text-white px-4 py-3 rounded relative animate-fadeIn text-center text-2xl">
      <strong className="font-bold">Error:</strong>
      <span className="block sm:inline ml-2">{message}</span>
    </div>
  );
}
