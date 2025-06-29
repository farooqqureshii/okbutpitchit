"use client";

interface MediaEmbedProps {
  media: { type: 'tweet' | 'youtube'; url: string };
}

export default function MediaEmbed({ media }: MediaEmbedProps) {
  if (media.type === 'youtube') {
    const videoId = media.url.split('v=')[1]?.split('&')[0] || '';
    return (
      <div className="aspect-video w-full max-w-2xl mx-auto">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-xl border"
        />
      </div>
    );
  }
  if (media.type === 'tweet') {
    return (
      <blockquote className="twitter-tweet">
        <a href={media.url}>View Tweet</a>
      </blockquote>
    );
  }
  return null;
} 