import * as faceapi from '@vladmandic/face-api';

let isModelLoaded = false;

export const loadModels = async () => {
  if (isModelLoaded) return;
  const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
  ]);
  isModelLoaded = true;
};

export const detectFace = async (videoElement: HTMLVideoElement) => {
  if (!isModelLoaded) await loadModels();
  
  const detection = await faceapi.detectSingleFace(
    videoElement, 
    new faceapi.TinyFaceDetectorOptions()
  ).withFaceLandmarks();

  if (!detection) return { status: 'away' };

  // Analyze landmarks for head pose and eyes (simple heuristic)
  const landmarks = detection.landmarks;
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();

  // Basic eye closure detection (vertical distance check)
  const getEyeHeight = (eye: faceapi.Point[]) => {
    const top = (eye[1].y + eye[2].y) / 2;
    const bottom = (eye[4].y + eye[5].y) / 2;
    return bottom - top;
  };

  const leftHeight = getEyeHeight(leftEye);
  const rightHeight = getEyeHeight(rightEye);
  
  if (leftHeight < 3 && rightHeight < 3) {
    return { status: 'drowsy' };
  }

  // Head pose estimation (very simplified based on nose position relative to face box)
  const nose = landmarks.getNose()[0];
  const box = detection.detection.box;
  const noseRelativeX = (nose.x - box.x) / box.width;

  if (noseRelativeX < 0.3 || noseRelativeX > 0.7) {
    return { status: 'distracted' };
  }

  return { status: 'focused' };
};
