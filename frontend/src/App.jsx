import { useState } from "react";
import PersonaSelect from "./screens/PersonaSelect";
import Roleplay from "./screens/Roleplay";
import Debrief from "./screens/Debrief";

export default function App() {
  const [screen, setScreen] = useState("select");
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [debriefData, setDebriefData] = useState(null);

  function handleSelectPersona(persona) {
    setSelectedPersona(persona);
    setTranscript([]);
    setDebriefData(null);
    setScreen("roleplay");
  }

  function handleEndCall(messages, debrief) {
    setTranscript(messages);
    setDebriefData(debrief);
    setScreen("debrief");
  }

  function handleRestart() {
    setSelectedPersona(null);
    setTranscript([]);
    setDebriefData(null);
    setScreen("select");
  }

  function handleTryAgain() {
    setTranscript([]);
    setDebriefData(null);
    setScreen("roleplay");
  }

  return (
    <>
      {screen === "select" && (
        <PersonaSelect onSelect={handleSelectPersona} />
      )}
      {screen === "roleplay" && selectedPersona && (
        <Roleplay
          persona={selectedPersona}
          onEndCall={handleEndCall}
          onBack={() => setScreen("select")}
        />
      )}
      {screen === "debrief" && debriefData && (
        <Debrief
          persona={selectedPersona}
          debrief={debriefData}
          transcript={transcript}
          onTryAgain={handleTryAgain}
          onRestart={handleRestart}
        />
      )}
    </>
  );
}
