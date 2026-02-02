import { useState, useEffect, openModal } from "Reactor";
import { apiFetch } from "@/core/lib/api";

type UserAvatarProps = {
    userId?: number;
    username?: string; // used for fallback initials or alt text
    src?: string;      // optional initial source if already known
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    className?: string;
    zoomable?: boolean;
};

const SIZE_CLASSES = {
    xs: "w-6 h-6 text-[8px]",
    sm: "w-8 h-8 text-[10px]",
    md: "w-10 h-10 text-xs",
    lg: "w-16 h-16 text-sm",
    xl: "w-24 h-24 text-base",
    "2xl": "w-32 h-32 text-lg",
    "3xl": "w-40 h-40 text-xl",
};

export default function UserAvatar({
    userId,
    username = "User",
    src,
    size = "md",
    className = "",
    zoomable = true,
}: UserAvatarProps) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(src || null);

    // Sync src prop if it changes
    useEffect(() => {
        if (src) setAvatarUrl(src);
    }, [src]);

    // Fetch avatar if not provided or to keep fresh
    useEffect(() => {
        if (!userId) return;

        let mounted = true;
        const fetchAvatar = async () => {
            try {
                const res = await apiFetch(`/api/users/${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (mounted && data.avatarUrl) {
                        setAvatarUrl(data.avatarUrl);
                    }
                }
            } catch {
                // ignore errors, stick to fallback
            }
        };

        // If we don't have a src, fetch it. 
        // Even if we do, we might want to fetch to ensure it's latest, but let's optimize to only fetch if missing or updated.
        if (!src) fetchAvatar();

        return () => { mounted = false; };
    }, [userId, src]);

    // Listen for global avatar update events
    useEffect(() => {
        const handleUpdate = () => {
            // If this component represents the *current* user, or if we want to be safe, re-fetch.
            // Since we don't know "who" triggered the event (the event payload is natively empty in the current impl),
            // we'll optimistically re-fetch if we have a userId. 
            // Ideally the event would carry the userId, but `window.dispatchEvent(new Event("user:avatar-update"))` doesn't.
            // We assume this event means "THE logged-in user updated their avatar".

            // So we should only re-fetch if this avatar belongs to the logged-in user.
            // We can't easily know if `userId` is the logged-in user without context, 
            // but re-fetching is safe enough for now.
            if (userId) {
                apiFetch(`/api/users/${userId}`)
                    .then(r => r.json())
                    .then(d => {
                        if (d.avatarUrl) setAvatarUrl(d.avatarUrl);
                    })
                    .catch(() => { });
            }
        };

        window.addEventListener("user:avatar-update", handleUpdate);
        return () => window.removeEventListener("user:avatar-update", handleUpdate);
    }, [userId]);

    const handleZoom = (e: any) => {
        if (!zoomable || !avatarUrl) return;
        e.stopPropagation();

        openModal({
            type: "IMAGE_ZOOM",
            payload: { url: avatarUrl },
            className: "!bg-transparent !p-0 !border-none !shadow-none !w-auto !max-w-none !max-h-none !overflow-visible",
            render: ({ url }: any) => (
                <div className="flex flex-col items-center justify-center outline-none" tabIndex={0} data-modal-autofocus>
                    <img
                        src={url}
                        className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl shadow-2xl border border-white/10"
                        alt={`${username}'s avatar`}
                    />
                    <button
                        onClick={() => window.open(url, '_blank')}
                        className="mt-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/80 border border-white/10 text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
                    >
                        <span className="icon-[heroicons--arrow-down-tray]" />
                        Open Original
                    </button>
                </div>
            )
        });
    };

    const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

    return (
        <div
            className={`relative inline-block rounded-full overflow-hidden bg-gray-800 border border-white/10 shrink-0 select-none ${sizeClass} ${className} ${zoomable && avatarUrl ? 'cursor-zoom-in hover:border-cyan-400/50 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all' : ''}`}
            onClick={handleZoom}
        >
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt={username}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                        setAvatarUrl(null);
                    }}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 text-gray-400 font-bold uppercase transition-colors">
                    {username?.slice(0, 2) || "??"}
                </div>
            )}
        </div>
    );
}
