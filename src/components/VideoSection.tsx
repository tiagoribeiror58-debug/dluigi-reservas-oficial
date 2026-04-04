import { Play, X } from 'lucide-react';
import { useState, useRef } from 'react';

type VideoData = {
  id: string;
  url: string;
  title: string;
};

interface VideoSectionProps {
  title: string;
  subtitle: string;
  videos: VideoData[];
}

export default function VideoSection({ title, subtitle, videos }: VideoSectionProps) {
  const [activeVideo, setActiveVideo] = useState<VideoData | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const setSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  return (
    <section className="section-media relative">
      <div className="text-center mb-8">
        <h2 className="section-title">{title}</h2>
        <p className="section-sub">{subtitle}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {videos.map((video) => (
          <div 
            key={video.id} 
            className="relative aspect-[9/16] md:aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group shadow-xl bg-black flex items-center justify-center border-2 border-[var(--border)] hover:border-[var(--red)] transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => setActiveVideo(video)}
          >
            <video 
              src={video.url} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              muted
              playsInline
              loop
              onMouseOver={e => (e.target as HTMLVideoElement).play()}
              onMouseOut={e => {
                (e.target as HTMLVideoElement).pause();
              }}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center pointer-events-none">
              <div className="bg-[var(--red)]/90 backdrop-blur-sm rounded-full p-4 transform group-hover:scale-110 transition-transform shadow-xl">
                <Play className="text-white w-10 h-10 ml-1" fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
              <p className="text-white font-medium text-lg drop-shadow-md">{video.title}</p>
            </div>
          </div>
        ))}
      </div>

      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8 animate-in fade-in duration-200">
           <button 
             onClick={() => setActiveVideo(null)}
             className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/70 hover:text-white bg-black/50 hover:bg-[var(--red)] p-3 rounded-full transition-colors z-[110] shadow-lg"
           >
             <X size={28} strokeWidth={2.5} />
           </button>
           
           <div className="relative w-full max-w-[460px] aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center">
              <video 
                ref={videoRef}
                src={activeVideo.url} 
                className="w-full h-full object-cover"
                controls
                autoPlay
                playsInline
              />
              <div className="absolute top-4 left-4 z-[110] flex gap-1 bg-black/50 p-1 rounded-lg backdrop-blur-sm border border-white/10">
                <button onClick={() => setSpeed(1)} className="text-white text-xs font-bold px-2 py-1 rounded hover:bg-white/20 transition-colors">1x</button>
                <button onClick={() => setSpeed(1.5)} className="text-white text-xs font-bold px-2 py-1 rounded hover:bg-white/20 transition-colors">1.5x</button>
                <button onClick={() => setSpeed(2)} className="text-white text-xs font-bold px-2 py-1 rounded hover:bg-white/20 transition-colors">2x</button>
              </div>
           </div>
        </div>
      )}
    </section>
  );
}
