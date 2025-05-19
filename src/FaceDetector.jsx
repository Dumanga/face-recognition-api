import { useRef, useState, useEffect } from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import * as faceapi from 'face-api.js';

export default function FaceDetector() {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const [fileURL, setFileURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const MODEL_URL = import.meta.env.BASE_URL + '/models/';

  // Loading the SSD-Mobilenet model 
  useEffect(() => {
    faceapi.nets.ssdMobilenetv1
      .loadFromUri(MODEL_URL)
          .then(() => console.log('SSD-Mobilenet loaded'))
          .catch(err => console.error(err));
  }, []);

  // Uploading the image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const cnv = canvasRef.current;
      if (cnv) {
        const ctx = cnv.getContext('2d');
        ctx.clearRect(0, 0, cnv.width, cnv.height);
      }
      const url = URL.createObjectURL(file);
      setFileURL(url);
    }
  };

  // Detecting faces
  const handleImageLoad = async () => {
    if (!imgRef.current) return;
    setLoading(true);

    const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });
    const detections = await faceapi.detectAllFaces(imgRef.current, options);
    console.log('Detected faces:', detections);

    const canvas = canvasRef.current;
    faceapi.matchDimensions(canvas, {
      width: imgRef.current.width,
      height: imgRef.current.height,
    });
    const resized = faceapi.resizeResults(detections, {
      width: imgRef.current.width,
      height: imgRef.current.height,
    });
    faceapi.draw.drawDetections(canvas, resized);

    setLoading(false);
  };

  // Reset everything
  const handleReset = () => {
    if (fileURL) {
      URL.revokeObjectURL(fileURL);
    }
    setFileURL(null);
    setLoading(false);
    const cnv = canvasRef.current;
    if (cnv) {
      const ctx = cnv.getContext('2d');
      ctx.clearRect(0, 0, cnv.width, cnv.height);
    }
  };

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 300,
          border: '2px dashed #555',
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {fileURL ? (
          <>
            <img
              ref={imgRef}
              src={fileURL}
              alt="Preview"
              onLoad={handleImageLoad}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />
            <canvas
              ref={canvasRef}
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
          </>
        ) : (
          <Typography color="#888">
            Upload an image to detect face(s)
          </Typography>
        )}
      </Box>
      <Stack direction="row" spacing={1}>
        {!fileURL && (
          <Button
            component="label"
            variant="contained"
            fullWidth
            sx={{ bgcolor: '#3a3a3a' }}
          >
            Upload an image to detect face(s)
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
          </Button>
        )}
        {fileURL && loading && (
          <Button
            variant="contained"
            disabled
            fullWidth
            sx={{ bgcolor: '#3a3a3a' }}
          >
            Detecting… please wait!
          </Button>
        )}
        {fileURL && !loading && (
          <Button
            component="label"
            variant="contained"
            fullWidth
            sx={{ bgcolor: '#3a3a3a' }}
          >
            Upload another image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
          </Button>
        )}
        {fileURL && !loading && (
          <Button
            variant="outlined"
            fullWidth
            onClick={handleReset}
            sx={{
              color: '#fff',
              borderColor: '#555',
              '&:hover': { borderColor: '#888' }
            }}
          >
            Reset
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
