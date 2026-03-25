import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getPackById } from '@/lib/supabase/packs';
import { AudioPlayerDrawer } from '@/components/AudioPlayerDrawer';

type PreviewKind = 'pack' | 'sample';

interface PlayablePreviewBase {
  kind: PreviewKind;
  id: string; // pack.id or sample.id
  name: string;
  creatorName: string;
  coverUrl?: string | null;
  packId?: string | null;
  creatorId?: string | null;
  samplesCount?: number | null; // pack-only
}

interface PlayablePack extends PlayablePreviewBase {
  kind: 'pack';
}

interface PlayableSample extends PlayablePreviewBase {
  kind: 'sample';
  previewAudioUrl: string;
  durationLabel?: string;
  bpm?: number | null;
  key?: string | null;
}

interface PackPreviewPlayerContextValue {
  activePreviewKind: PreviewKind | null;
  activePreviewId: string | null;
  isPlaying: boolean;
  playPackPreview: (pack: PlayablePack) => Promise<void>;
  playSamplePreview: (sample: PlayableSample) => Promise<void>;
  togglePlayPause: () => void;
  progress01: number; // 0..1
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
  const [activePreview, setActivePreview] = useState<PlayablePreviewBase | null>(null);
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

    if (activePreview?.kind === 'pack' && activePreview?.id === pack.id && audioRef.current) {
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
    setActivePreview({
      kind: 'pack',
      id: pack.id,
      name: pack.name,
      creatorName: pack.creatorName,
      coverUrl: pack.coverUrl,
      samplesCount: pack.samplesCount,
      packId: pack.id,
      creatorId: detail?.creator_id ?? null,
    });
    setCurrentTime(0);
    setDuration(0);
    setPreviewLabel(firstSample.length ?? '0:00');

    try {
      await audio.play();
    } catch {
      toast.error('Unable to start audio preview.');
    }
  }, [activePreview?.id, activePreview?.kind, bindAudioEvents, isRepeatOn, volumePercent]);

  const playSamplePreview = useCallback(async (sample: PlayableSample) => {
    if (!sample.previewAudioUrl) return;

    if (activePreview?.kind === 'sample' && activePreview?.id === sample.id && audioRef.current) {
      const audio = audioRef.current;
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(sample.previewAudioUrl);
    audio.loop = isRepeatOn;
    audio.volume = Math.max(0, Math.min(1, volumePercent / 100));
    audioRef.current = audio;
    bindAudioEvents(audio);
    setActivePreview({
      kind: 'sample',
      id: sample.id,
      name: sample.name,
      creatorName: sample.creatorName,
      coverUrl: sample.coverUrl,
      packId: sample.packId ?? null,
      creatorId: sample.creatorId ?? null,
    });

    setCurrentTime(0);
    setDuration(0);
    setPreviewLabel(sample.durationLabel ?? '0:00');

    try {
      await audio.play();
    } catch {
      toast.error('Unable to start audio preview.');
    }
  }, [activePreview?.id, activePreview?.kind, bindAudioEvents, isRepeatOn, volumePercent]);

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
  const progress01 = duration > 0 ? Math.min(1, currentTime / duration) : 0;
  const previewTime = duration > 0 ? formatTime(duration) : previewLabel;

  // Intentionally not memoized: these handlers depend on `activePack`,
  // and the React Compiler in this repo prefers not to preserve manual memoization.
  const onGetPack = () => {
    const packId = activePreview?.packId ?? (activePreview?.kind === 'pack' ? activePreview?.id : null);
    if (!packId) return;
    navigate(`/dashboard/packs/${packId}`);
  };

  const onViewCreator = async () => {
    const creatorId =
      activePreview?.creatorId ??
      (activePreview?.kind === 'pack' ? (await getPackById(activePreview.id))?.creator_id ?? null : null);
    if (creatorId) {
      navigate(`/dashboard/creators/${creatorId}`);
      return;
    }
    toast.error('Creator not found for this preview.');
  };

  const onShare = async () => {
    const packId = activePreview?.packId ?? (activePreview?.kind === 'pack' ? activePreview?.id : null);
    if (!packId || !activePreview?.name) return;
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard/packs/${packId}`;
    const nav: any = typeof navigator !== 'undefined' ? navigator : null;

    try {
      if (nav?.share) {
        await nav.share({ title: activePreview.name, url });
      } else if (nav?.clipboard?.writeText) {
        await nav.clipboard.writeText(url);
        toast.success('Link copied');
      } else {
        toast.error('Sharing is not supported in this browser.');
      }
    } catch {
      toast.error('Unable to share.');
    }
  };
  const value = useMemo<PackPreviewPlayerContextValue>(() => ({
    activePreviewKind: activePreview?.kind ?? null,
    activePreviewId: activePreview?.id ?? null,
    isPlaying,
    playPackPreview,
    playSamplePreview,
    togglePlayPause,
    progress01,
    volumePercent,
    setVolumePercent,
  }), [
    activePreview?.id,
    activePreview?.kind,
    isPlaying,
    playPackPreview,
    playSamplePreview,
    togglePlayPause,
    progress01,
    volumePercent,
    setVolumePercent,
  ]);

  return (
    <PackPreviewPlayerContext.Provider value={value}>
      {children}
      {activePreview && (
        <AudioPlayerDrawer
          pack={activePreview as any}
          isPlaying={isPlaying}
          volumePercent={volumePercent}
          onSetVolumePercent={setVolumePercent}
          isRepeatOn={isRepeatOn}
          progressPercent={progressPercent}
          previewTime={previewTime}
          onTogglePlayPause={togglePlayPause}
          onToggleRepeat={toggleRepeat}
          onViewPack={() => {
            const packId = activePreview.packId ?? (activePreview.kind === 'pack' ? activePreview.id : null);
            if (packId) navigate(`/dashboard/packs/${packId}`);
          }}
          onGetPack={onGetPack}
          onViewCreator={onViewCreator}
          onShare={onShare}
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
