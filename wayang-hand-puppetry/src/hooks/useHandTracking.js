import { useEffect, useRef, useState } from "react";

import {
    FilesetResolver,
    HandLandmarker
} from "@mediapipe/tasks-vision";

export default function useHandTracking() {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const animationRef = useRef(null);

    const [hands, setHands] = useState([]);
    const [cameraReady, setCameraReady] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let stream;
        let active = true;

        async function initialise() {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );

                const landmarker =
                    await HandLandmarker.createFromOptions(
                        vision,
                        {
                            baseOptions: {
                                modelAssetPath:
                                    "/models/hand_landmarker.task"
                            },

                            runningMode: "VIDEO",

                            numHands: 2,

                            minHandDetectionConfidence: 0.5,

                            minHandPresenceConfidence: 0.5,

                            minTrackingConfidence: 0.5
                        }
                    );

                if (!active) {
                    landmarker.close();
                    return;
                }

                landmarkerRef.current = landmarker;

                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    },
                    audio: false
                });

                if (!active) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                const video = videoRef.current;

                video.srcObject = stream;

                await new Promise(resolve => {
                    video.onloadedmetadata = resolve;
                });

                await video.play();

                if (!active) return;

                setCameraReady(true);

                function detectHands() {
                    if (!active) return;

                    const currentVideo = videoRef.current;
                    const currentLandmarker = landmarkerRef.current;

                    if (
                        currentVideo &&
                        currentLandmarker &&
                        currentVideo.readyState >= 2
                    ) {
                        const result =
                            currentLandmarker.detectForVideo(
                                currentVideo,
                                performance.now()
                            );

                        setHands(
                            result.landmarks.map((landmarks, index) => ({
                                landmarks,
                                handedness:
                                    result.handednesses?.[index]?.[0]?.categoryName
                                    ?? "Unknown"
                            }))
                        );
                    }

                    animationRef.current =
                        requestAnimationFrame(detectHands);
                }

                detectHands();

            } catch (err) {
                console.error(err);

                setError(
                    "Unable to initialise hand tracking. " +
                    "Check camera permissions and model loading."
                );
            }
        }

        initialise();

        return () => {
            active = false;

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            landmarkerRef.current?.close();
            landmarkerRef.current = null;
        };
    }, []);

    return {
        videoRef,
        hands,
        cameraReady,
        error
    };
}