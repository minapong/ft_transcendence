
export default function DancePage() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
      <iframe
        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
        title="Dance"
        allow="autoplay; encrypted-media"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}
