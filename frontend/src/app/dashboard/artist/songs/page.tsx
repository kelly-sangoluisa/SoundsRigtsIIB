import { RouteGuard } from '@/shared/components/RouteGuard';
import { MySongsView } from '@/features/songs/components/MySongsView';

export default function ArtistSongsPage() {
  return (
    <RouteGuard>
      <MySongsView />
    </RouteGuard>
  );
}
