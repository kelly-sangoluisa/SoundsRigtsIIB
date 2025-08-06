const express = require('express');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'songs-service', port: 3002 });
});

app.get('/api/songs/status', (req, res) => {
  res.json({ message: 'Songs service is running', timestamp: new Date().toISOString() });
});

// SONGS ENDPOINTS
app.get('/api/songs', (req, res) => {
  res.json({
    songs: [
      {
        id: 1,
        title: 'Demo Track 1',
        artist: 'Artist Demo',
        genre: 'Electronic',
        price: 49.99,
        duration: 180,
        license_type: 'basic'
      },
      {
        id: 2,
        title: 'Demo Track 2',
        artist: 'Producer Demo',
        genre: 'Hip Hop',
        price: 79.99,
        duration: 210,
        license_type: 'premium'
      }
    ]
  });
});

app.get('/api/songs/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    id: parseInt(id),
    title: `Demo Track ${id}`,
    artist: 'Artist Demo',
    genre: 'Electronic',
    price: 49.99,
    duration: 180,
    license_type: 'basic',
    description: 'Una canción demo para pruebas'
  });
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Songs Service running on port ${port}`);
});
