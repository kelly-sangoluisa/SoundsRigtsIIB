interface Song {
  id: string;
  title: string;
  artist: string;
  price: number;
  genre: string;
  duration: string;
  imageUrl: string;
  owner: string;
  currentOwnerId?: string;
  status?: 'available' | 'requested' | 'sold';
  requestedById?: string;
}

interface SongCardProps {
  song: Song;
  onBuy: (songId: string) => void;
  onRequest?: (songId: string) => void;
  currentUserId?: string;
  isOwner?: boolean;
}

export default function SongCard({ song, onBuy, onRequest, currentUserId, isOwner }: SongCardProps) {
  const getStatusBadge = () => {
    switch (song.status) {
      case 'requested':
        return (
          <span className="bg-yellow-600 text-white px-2 py-1 rounded-full text-xs">
            Solicitada
          </span>
        );
      case 'sold':
        return (
          <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs">
            Vendida
          </span>
        );
      default:
        return null;
    }
  };

  const getActionButton = () => {
    if (isOwner) {
      return (
        <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
          Mi canción
        </span>
      );
    }

    if (song.status === 'sold') {
      return (
        <span className="bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-semibold opacity-50">
          No disponible
        </span>
      );
    }

    if (song.status === 'requested') {
      if (song.requestedById === currentUserId) {
        return (
          <span className="bg-yellow-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
            Pendiente
          </span>
        );
      } else {
        return (
          <span className="bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-semibold opacity-50">
            Solicitada
          </span>
        );
      }
    }

    // Canción disponible para solicitar
    return (
      <button
        onClick={() => onRequest ? onRequest(song.id) : onBuy(song.id)}
        className="bg-spotify-green text-spotify-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-spotify-green-hover transition-all hover:scale-105"
      >
        🛒 Pedir
      </button>
    );
  };
  return (
    <div className="song-card group">
      {/* Song Image */}
      <div className="aspect-square bg-spotify-light-gray rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
        <span className="text-4xl">🎵</span>
        
        {/* Play button overlay on hover */}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center hover:bg-spotify-green-hover transition-colors">
            <span className="text-spotify-black text-xl">▶</span>
          </button>
        </div>
      </div>

      {/* Song Info */}
            {/* Song Info */}
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-white truncate">
              {song.title}
            </h3>
            <p className="text-sm text-spotify-light-gray truncate">
              {song.artist}
            </p>
          </div>
          {getStatusBadge()}
        </div>
        
        <div className="flex justify-between items-center text-xs text-spotify-light-gray">
          <span className="bg-spotify-dark-gray px-2 py-1 rounded-full">
            {song.genre}
          </span>
          <span>{song.duration}</span>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-bold text-spotify-green">
            ${song.price}
          </span>
          {getActionButton()}
        </div>
      </div>
    </div>
  );
}
