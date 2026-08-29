import { useState } from 'react';

export default function VoiceAssistantModal({ onTranscript }) {
  const [listening, setListening] = useState(false);

  const toggle = () => {
    if (!listening) {
      setListening(true);
      setTimeout(() => {
        onTranscript && onTranscript('I want to visit Lonavala and Mahabaleshwar starting tomorrow morning');
        setListening(false);
      }, 1500);
    } else {
      setListening(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Voice Assistant</h3>
        <p className="text-gray-600 mb-4">Speak in Hindi, Marathi, or English</p>
        <button
          onClick={toggle}
          className={`w-full py-3 rounded-full text-white font-semibold ${listening ? 'bg-red-500' : 'bg-blue-600'}`}
        >
          {listening ? 'Listening...' : '🎤 Tap to Speak'}
        </button>
        <button
          onClick={() => onTranscript(null)}
          className="mt-3 w-full py-2 text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
