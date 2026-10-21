
import { useEffect, useRef, useState } from "react";

export default function Theatre({ hands, scene }) {
  const canvasRef = useRef(null);
  const [loadedImages, setLoadedImages] = useState({});

  // Load the images required by the current scene.
  useEffect(() => {
    let cancelled = false;

    scene.puppets.forEach((puppet) => {
      const image = new Image();

      image.onload = () => {
        if (!cancelled) {
          setLoadedImages((previous) => ({
            ...previous,
            [puppet.id]: image,
          }));
        }
      };

      image.onerror = () => {
        console.error(`Could not load puppet image: ${puppet.image}`);
      };

      image.src = puppet.image;
    });

    return () => {
      cancelled = true;
    };
  }, [scene]);

  // Draw only the puppets belonging to the active scene.
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Theatre background.
    ctx.fillStyle = "#f5e5bb";
    ctx.fillRect(0, 0, width, height);

    // Decorative borders.
    ctx.fillStyle = "#63351e";
    ctx.fillRect(0, 0, width, 35);
    ctx.fillRect(0, height - 35, width, 35);

    function drawPuppet(image, x, y, scale = 1) {
      if (!image?.complete || !image.naturalWidth) return;

      const puppetHeight = height * 0.55 * scale;
      const puppetWidth =
        puppetHeight * (image.naturalWidth / image.naturalHeight);

      // Soft shadow.
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.filter = "blur(8px)";
      ctx.drawImage(
        image,
        x - puppetWidth / 2 + 10,
        y - puppetHeight + 8,
        puppetWidth,
        puppetHeight
      );
      ctx.restore();

      // Main puppet.
      ctx.drawImage(
        image,
        x - puppetWidth / 2,
        y - puppetHeight,
        puppetWidth,
        puppetHeight
      );
    }

    // Render the active scene's puppets only.
    scene.puppets.forEach((puppet) => {
      const image = loadedImages[puppet.id];

      // Match this puppet to its assigned hand.
      const trackedHand = hands.find(
        (hand) => hand.handedness === puppet.hand
      );

      const landmark = trackedHand?.landmarks?.[0];

      // Use the configured position if no hand is detected.
      const x = landmark
        ? landmark.x * width
        : puppet.x * width;

      const y = landmark
        ? Math.min(height, landmark.y * height + height * 0.25)
        : height * 0.9;

      drawPuppet(image, x, y);
    });
  }, [hands, scene, loadedImages]);

  return (
    <canvas
      ref={canvasRef}
      width={1280}
      height={720}
      className="theatre-canvas"
    />
  );
}
