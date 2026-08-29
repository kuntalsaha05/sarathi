export default function VoiceInput({ onTranscript }) {
  const [listening, setListening] = React.useState(false);

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
    <button
      onClick={toggle}
      className={`px-4 py-2 rounded-full text-white ${listening ? 'bg-red-500' : 'bg-blue-600'}`}
    >
      {listening ? 'Listening...' : '🎤 Speak'}
    </button>
  );
}
