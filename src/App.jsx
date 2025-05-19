import { Box } from '@mui/material';
import FaceDetector from './FaceDetector';

export default function App() {
  return (
    <Box
      sx={{
        bgcolor: '#1e1e1e',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
      }}
    >
      <Box
        sx={{
          width: 400,
          bgcolor: '#2a2a2a',
          p: 3,
          borderRadius: 3,
        }}
      >
        <FaceDetector />
      </Box>
    </Box>
  );
}
