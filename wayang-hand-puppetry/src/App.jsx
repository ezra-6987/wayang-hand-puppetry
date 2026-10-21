
import { useState } from "react";

import useHandTracking from "./hooks/useHandTracking";
import Theatre from "./components/Theatre";
import CameraPreview from "./components/CameraPreview";
import { storyScenes } from "./data/storyScene";

import "./App.css";

export default function App() {
  const {
    videoRef,
    hands,
    cameraReady,
    error,
  } = useHandTracking();

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  const currentScene = storyScenes[currentSceneIndex];

  function previousScene() {
    setCurrentSceneIndex((index) => Math.max(0, index - 1));
  }

  function nextScene() {
    setCurrentSceneIndex((index) =>
      Math.min(storyScenes.length - 1, index + 1)
    );
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>Cerita Rakyat</h1>
        <p>Wayang Kulit Interaktif</p>
      </header>

      <section className="theatre-section">
        <Theatre
          hands={hands}
          scene={currentScene}
        />

        <div className="theatre-caption">
          <h2>
            Kisah {currentScene.id}: {currentScene.title}
          </h2>

          <p>
            Karakter:{" "}
            {currentScene.puppets.map((puppet) => puppet.name).join(" & ")}
          </p>
        </div>

        <nav className="scene-controls" aria-label="Scene navigation">
          <button
            type="button"
            onClick={previousScene}
            disabled={currentSceneIndex === 0}
          >
            ← Kisah Lalu
          </button>

          <span>
            {currentSceneIndex + 1} / {storyScenes.length}
          </span>

          <button
            type="button"
            onClick={nextScene}
            disabled={currentSceneIndex === storyScenes.length - 1}
          >
            Kisah Seterusnya →
          </button>
        </nav>
      </section>

      <section className="control-section">
        <CameraPreview
          videoRef={videoRef}
          cameraReady={cameraReady}
          error={error}
        />

        <div className="tracking-info">
          <h2>Tracking Status</h2>
          <p>Detected hands: {hands.length}</p>
          <p>Camera: {cameraReady ? "Ready" : "Starting..."}</p>
        </div>
      </section>
    </main>
  );
}
