import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getPackById } from '@/lib/supabase/packs';
import { PackPreviewPlayerDrawer } from '@/components/PackPreviewPlayerDrawer';

interface PlayablePack {
  id: string;
  name: string;
  creatorName: string;
  coverUrl?: string | null;
  samplesCount?: number | null;
}

interface PackPreviewPlayerContextValue {
  activePackId: string | null;
  isPlaying: boolean;
  playPackPreview: (pack: PlayablePack) => Promise<void>;
  togglePlayPause: () => void;
  volumePercent: number; // 0..100
  setVolumePercent: (next: number) => void;
}

const PackPreviewPlayerContext = createContext<PackPreviewPlayerContextValue | null>(null);

function formatTime(seconds: number): string {
  const safe = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  const mins = Math.floor(safe / 60);
  const secs = Math.floor(safe % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function PackPreviewPlayerProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activePack, setActivePack] = useState<PlayablePack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeatOn, setIsRepeatOn] = useState(false);
  const [volumePercent, setVolumePercentState] = useState(80);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [previewLabel, setPreviewLabel] = useState('0:00');

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const bindAudioEvents = useCallback((audio: HTMLAudioElement) => {
    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };
    audio.onloadedmetadata = () => {
      setDuration(audio.duration || 0);
    };
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };
    audio.onpause = () => setIsPlaying(false);
    audio.onplay = () => setIsPlaying(true);
  }, []);

  const playPackPreview = useCallback(async (pack: PlayablePack) => {
    if (!pack.id) return;

    if (activePack?.id === pack.id && audioRef.current) {
      const audio = audioRef.current;
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
      return;
    }

    const detail = await getPackById(pack.id);
    const firstSample = detail?.samples?.find((s) => !!s.preview_audio_url);
    if (!firstSample?.preview_audio_url) {
      toast.error('No preview available for this pack yet.');
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(firstSample.preview_audio_url);
    audio.loop = isRepeatOn;
    audio.volume = Math.max(0, Math.min(1, volumePercent / 100));
    audioRef.current = audio;
    bindAudioEvents(audio);
    setActivePack(pack);
    setCurrentTime(0);
    setDuration(0);
    setPreviewLabel(firstSample.length ?? '0:00');

    try {
      await audio.play();
    } catch {
      toast.error('Unable to start audio preview.');
    }
  }, [activePack?.id, bindAudioEvents, isRepeatOn, volumePercent]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play();
    } else {
      audio.pause();
    }
  }, []);

  const toggleRepeat = useCallback(() => {
    setIsRepeatOn((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.loop = next;
      }
      return next;
    });
  }, []);

  const setVolumePercent = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(100, next));
    setVolumePercentState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped / 100;
    }
  }, []);

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const previewTime = duration > 0 ? formatTime(duration) : previewLabel;
  const value = useMemo<PackPreviewPlayerContextValue>(() => ({
    activePackId: activePack?.id ?? null,
    isPlaying,
    playPackPreview,
    togglePlayPause,
    volumePercent,
    setVolumePercent,
  }), [activePack?.id, isPlaying, playPackPreview, togglePlayPause, volumePercent, setVolumePercent]);

  return (
    <PackPreviewPlayerContext.Provider value={value}>
      {children}
      {activePack && (
        <PackPreviewPlayerDrawer
          pack={activePack}
          isPlaying={isPlaying}
          volumePercent={volumePercent}
          onSetVolumePercent={setVolumePercent}
          isRepeatOn={isRepeatOn}
          progressPercent={progressPercent}
          previewTime={previewTime}
          onTogglePlayPause={togglePlayPause}
          onToggleRepeat={toggleRepeat}
          onViewPack={() => navigate(`/dashboard/packs/${activePack.id}`)}
        />
      )}
    </PackPreviewPlayerContext.Provider>
  );
}

export function usePackPreviewPlayer() {
  const ctx = useContext(PackPreviewPlayerContext);
  if (!ctx) {
    throw new Error('usePackPreviewPlayer must be used inside PackPreviewPlayerProvider');
  }
  return ctx;
}
