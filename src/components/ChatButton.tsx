import { useState } from 'react';

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#E91E63] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#E91E63]/90 transition-colors flex items-center gap-2 z-50"
      >
        <span className="text-2xl">💬</span>
        <span className="font-medium">Fale com Paulinha</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg w-full max-w-4xl h-[600px] relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
              <i className="bx bx-x text-2xl"></i>
            </button>
            <iframe
              src="https://cdn.botpress.cloud/webchat/v2.4/shareable.html?configUrl=https://files.bpcontent.cloud/2025/05/08/06/20250508062617-LYJMXFXC.json"
              className="w-full h-full rounded-lg"
              title="Chat da Paulinha"
            />
          </div>
        </div>
      )}
    </>
  );
}
