export default function Footer() {
    return (
      <footer className="w-full py-4 text-center text-gray-500 text-sm border-t border-gray-200 mt-auto">
        Made with <span className="text-blue-500">💙</span> by {import.meta.env.VITE_FOOTER_TEXT}
      </footer>
    );
  }
  