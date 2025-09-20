import { useState, useEffect } from "react";
import CodeForm from "./components/CodeForm";
import TellThemButton from "./components/TellThemButton";
import Footer from "./components/Footer";
import MissesGraph from "./components/MissesGraph";

function App() {
  const [hasCode, setHasCode] = useState(false);

  useEffect(() => {
    const code = localStorage.getItem("code");
    if (code) setHasCode(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        {hasCode ? <TellThemButton /> : <CodeForm onSave={() => setHasCode(true)} />}
      </div>

      <Footer />
    </div>
  );
}

export default App;
