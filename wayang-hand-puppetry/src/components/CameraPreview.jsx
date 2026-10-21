export default function CameraPreview({
    videoRef,
    cameraReady,
    error
}) {
    return (
        <div className="camera-preview">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
            />

            {!cameraReady && !error && (
                <div className="camera-status">
                    Starting camera...
                </div>
            )}

            {error && (
                <div className="camera-status error">
                    {error}
                </div>
            )}

            {cameraReady && !error && (
                <div className="camera-status">
                    Camera active
                </div>
            )}
        </div>
    );
}