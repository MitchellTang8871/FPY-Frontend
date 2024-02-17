import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

const WebcamCapture = ({ onCapture, onCancel, onReload, onBack, live=false, }) => {
  const webcamRef = useRef(null);
  const [isCameraAvailable, setIsCameraAvailable] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);

  const onUserMedia = () => {
    // Webcam is successfully initialized
    setIsCameraAvailable(true);
    console.log("Webcam initialized");
  };

  const onUserMediaError = (error) => {
    console.error("Webcam error:", error);

    // Notify the user about the webcam error and request permission again
    alert("Webcam error: " + error.message + "\nPlease allow access to the webcam and try again.");

    setIsCameraAvailable(false);

    // // Try to request permission again
    // if (webcamRef.current) {
    //   navigator.mediaDevices
    //     .getUserMedia({ video: true })
    //     .then((stream) => {
    //       webcamRef.current.video.srcObject = stream;
    //       webcamRef.current.video.play();
    //     })
    //     .catch((err) => {
    //       console.error("Failed to request webcam access:", err);
    //     });
    // }
  };

  const checkCameraAvailability = () => {
    //request access to the webcam
    if (webcamRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          webcamRef.current.video.srcObject = stream;
          webcamRef.current.video.play();
          onUserMedia();
        })
        .catch((err) => {
          console.error("Failed to request webcam access:", err);
          onUserMediaError(err);
        });
    }
  }

  useEffect(() => {
    checkCameraAvailability();
  }, []);

  useEffect(() => {
    let captureInterval;

    if (isCameraAvailable && live) {
      // Start capturing every 3 seconds
      captureInterval = setInterval(()=>handleCapture(), 3000);
    }

    return () => {
      // Clear the interval when the component unmounts or isCameraAvailable becomes false
      clearInterval(captureInterval);
    };
  }, [isCameraAvailable, live]);

  const handleCapture = () => {
    if (isCameraAvailable && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      const blob = dataURLtoBlob(imageSrc);
      const file = new File([blob], "webcam_capture.png", { type: "image/png" });
      setCapturedImage(imageSrc);
      onCapture(file);
    } else {
      alert("Camera is not available. Please check your camera settings and try again.");
    }
  };

  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
        onCapture(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelCapture = () => {
    // Reset captured image and file
    setCapturedImage(null);
    onCancel(null);
  };

  return (
    <div>
      {!isCameraAvailable ? (
        <>
          <div>
            <p>Camera is not available. Please check your camera settings and try again.</p>
          </div>
          <button type="button" onClick={onReload}>
            Reload
          </button>
        </>
      ) : (
        live ? (
          <div>
            <button onClick={()=>onBack()}>Back</button>
            <div>
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/png"
                audio={false}
                mirrored={true}
                onUserMediaError={()=>onUserMediaError}
                onUserMedia={()=>onUserMedia}
              />
            </div>
          </div>
        ) : (
          capturedImage ? (
            <div>
              <div><img src={capturedImage} alt="Captured" /></div>
              <button type="button" onClick={handleCancelCapture}>
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <div>
                <button onClick={()=>onBack()}>Back</button>
                <div>
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/png"
                    audio={false}
                    mirrored={true}
                    onUserMediaError={()=>onUserMediaError}
                    onUserMedia={()=>onUserMedia}
                  />
                </div>
                <button type="button" onClick={handleCapture}>
                  Capture Face
                </button>
                <input type="file" accept="image/*" onChange={handleUpload} />
              </div>
            </div>
          )
        )
      )}
    </div>
  );
};

export default WebcamCapture;
