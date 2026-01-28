// src/app/pages/user/settings.tsx
import { useEffect, useRef, useState, navigate } from "Reactor";
import { apiFetch } from "@/core/lib/api";
import { useAuth } from "@/core/lib/useAuth";

const MAX_BYTES = 2 * 1024 * 1024; // must match backend (2MB)
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export default function UserSettingsPage() {
  const auth = useAuth();
  const token = auth?.token;

  const fileRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // --- auth guard
  useEffect(() => {
    if (!token) navigate("/auth/login");
  }, [token]);

  // --- load my profile
  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setMsg(null);
      try {
        const res = await apiFetch("/api/me");
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        if (!cancelled) setProfile(data);
      } catch (e: any) {
        if (!cancelled) setMsg(e?.message || "Failed to load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // --- maintain preview URL
  useEffect(() => {
    if (!selected) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selected]);

  function pickFile() {
    fileRef.current?.click();
  }

  function onFileChange(e: any) {
    setMsg(null);

    const f: File | undefined = e?.target?.files?.[0];
    if (!f) {
      setSelected(null);
      return;
    }

    // client-side checks (backend still enforces!)
    if (!ALLOWED.has(f.type)) {
      setSelected(null);
      setMsg("Only JPG / PNG / WEBP are allowed");
      return;
    }
    if (f.size > MAX_BYTES) {
      setSelected(null);
      setMsg("File is too large (max 2MB)");
      return;
    }

    setSelected(f);
  }

  async function uploadAvatar() {
    if (!selected) {
      setMsg("Pick an image first");
      return;
    }

    setBusy(true);
    setMsg(null);

    try {
      const fd = new FormData();
      console.log("[SETTINGS] selected:", selected?.name, selected?.type, selected?.size);
      fd.append("avatar", selected); // MUST match backend field name
      console.log("[SETTINGS] formdata avatar =", fd.get("avatar"));


      const res = await apiFetch("/api/me/avatar", {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => ({}));

      console.log("[SETTINGS] upload status =", res.status);
      console.log("[SETTINGS] upload response =", data);

      if (!res.ok) {
        setMsg(data.error || "Upload failed");
        return;
      }

      // update local profile state immediately
      setProfile((prev: any) => ({
        ...(prev ?? {}),
        avatarUrl: data.avatarUrl ?? prev?.avatarUrl ?? null,
        avatarId: data.avatarId ?? prev?.avatarId ?? null,
      }));

      // clear selected file
      setSelected(null);
      if (fileRef.current) fileRef.current.value = "";

      setMsg("Avatar updated ✅");
    } catch {
      setMsg("Network error");
    } finally {
      setBusy(false);
    }
  }

  if (!token) return <div>Not logged in</div>;

  if (loading) {
    return (
      <div className="p-10 text-white">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-40 bg-gray-700 rounded" />
          <div className="h-36 w-full bg-gray-800 rounded" />
        </div>
      </div>
    );
  }

  const currentAvatar = profile?.avatarUrl || null;

  return (
    <div className="p-10 text-white max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Profile settings</h1>

        <button
          type="button"
          onClick={() => navigate("/user/me")}
          className="bg-gray-700 px-4 py-2 rounded font-bold hover:bg-gray-600"
        >
          Back
        </button>
      </div>

      {/* Avatar card */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Avatar</h2>

        <div className="flex items-center gap-6">
          {/* Current avatar */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center text-3xl font-bold">
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  className="w-full h-full object-cover"
                  alt="current avatar"
                  onError={(e) => {
                    console.warn("current avatar failed:", currentAvatar);
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <span>{profile?.username?.[0]?.toUpperCase() || "?"}</span>
              )}
            </div>
            <div className="text-xs text-gray-400">Current</div>
          </div>

          {/* Preview avatar */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center text-3xl font-bold">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  className="w-full h-full object-cover"
                  alt="preview"
                />
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </div>
            <div className="text-xs text-gray-400">Preview</div>
          </div>

          {/* Controls */}
          <div className="flex-1">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={onFileChange}
            />

            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={pickFile}
                disabled={busy}
                className="bg-blue-600 px-4 py-2 rounded font-bold hover:bg-blue-500 disabled:opacity-50"
              >
                Choose image
              </button>

              <button
                type="button"
                onClick={uploadAvatar}
                disabled={busy || !selected}
                className="bg-green-600 px-4 py-2 rounded font-bold hover:bg-green-500 disabled:opacity-50"
              >
                {busy ? "Uploading..." : "Upload"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setMsg(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                disabled={busy}
                className="bg-gray-700 px-4 py-2 rounded font-bold hover:bg-gray-600 disabled:opacity-50"
              >
                Clear
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-3">
              Allowed: JPG / PNG / WEBP. Max size: 2MB.
            </p>

            {msg && <p className="text-sm text-gray-300 mt-3">{msg}</p>}
          </div>
        </div>
      </div>

      {/* Later settings placeholder */}
      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-lg p-6 opacity-80">
        <h2 className="text-xl font-bold mb-2">More settings (later)</h2>
        <p className="text-sm text-gray-400">
          Username, email, location, etc. will go here.
        </p>
      </div>
    </div>
  );
}
