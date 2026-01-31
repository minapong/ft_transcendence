// src/app/pages/user/settings.tsx
import { useEffect, useRef, useState, navigate } from "Reactor";
import { apiFetch } from "@/core/lib/api";
import { useAuth } from "@/core/lib/useAuth";
import { vAge, vUsername } from "@/core/lib/input/validators";
import { unwrap } from "@/core/lib/input/unwrap";

const WAREHOUSES = [
  "Mina Port W-001",
  "Mina Port W-014",
  "Mina Port W-023",
  "Mina Port W-107",
  "Mina Port W-204",
  "Mina Port W-404",
];

const MAX_BYTES = 2 * 1024 * 1024; // matches backend, nginx (2MB)
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export default function UserSettingsPage() {
  const auth = useAuth();
  const token = auth?.token;

  const fileRef = useRef<HTMLInputElement>(null);

  // ----------------------------
  // Profile base
  // ----------------------------
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ----------------------------
  // Avatar state
  // ----------------------------
  const [selected, setSelected] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busyAvatar, setBusyAvatar] = useState(false);
  const [msgAvatar, setMsgAvatar] = useState<string | null>(null);

  // ----------------------------
  // Basics state (age/location)
  // ----------------------------
  const [ageRaw, setAgeRaw] = useState<string | "">("");
  const [location, setLocation] = useState<string>("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [msgBasics, setMsgBasics] = useState<string | null>(null);

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
      setMsgAvatar(null);
      setMsgBasics(null);

      try {
        const res = await apiFetch("/api/me");
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();

        if (cancelled) return;

        setProfile(data);

        // fields to read from /api/me:
        // data.age, data.location
        setAgeRaw(typeof data?.age === "number" ? String(data.age) : "");
        setLocation(typeof data?.location === "string" ? data.location : "");
      } catch (e: any) {
        if (!cancelled) setMsgBasics(e?.message || "Failed to load profile");
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
    setMsgAvatar(null);

    const f: File | undefined = e?.target?.files?.[0];
    if (!f) {
      setSelected(null);
      return;
    }

    // client-side checks (backend still enforces)
    if (!ALLOWED.has(f.type)) {
      setSelected(null);
      setMsgAvatar("Only JPG / PNG / WEBP are allowed");
      return;
    }
    if (f.size > MAX_BYTES) {
      setSelected(null);
      setMsgAvatar("File is too large (max 2MB)");
      return;
    }

    setSelected(f);
  }

  // ----------------------------
  // Avatar upload
  // ----------------------------
  async function uploadAvatar() {
    if (!selected) {
      setMsgAvatar("Pick an image first");
      return;
    }

    setBusyAvatar(true);
    setMsgAvatar(null);

    try {
      const fd = new FormData();
      // IMPORTANT field name: backend expects file.fieldname === "avatar"
      fd.append("avatar", selected);

      const res = await apiFetch("/api/me/avatar", {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.ok == false) {
        setMsgAvatar(data.error || "Upload failed");
        return;
      }

      // fields read from response: data.avatarUrl, data.avatarId
      setProfile((prev: any) => ({
        ...(prev ?? {}),
        avatarUrl: data.avatarUrl ?? prev?.avatarUrl ?? null,
        avatarId: data.avatarId ?? prev?.avatarId ?? null,
      }));

      // clear selected
      setSelected(null);
      if (fileRef.current) fileRef.current.value = "";

      setMsgAvatar("Avatar updated ✅");
    } catch {
      setMsgAvatar("Network error");
    } finally {
      setBusyAvatar(false);
    }
  }

  // ----------------------------
  // Save basics (age + location)
  // Endpoint: PATCH /api/me/profile
  // Body: { age: number|null, location: string|null }
  // Expects: { user: { age, location, ... } }
  // ----------------------------
  async function saveBasics() {
    setSavingProfile(true);
    setMsgBasics(null);

    try {
      
      const raw = ageRaw.trim();
 
      if (raw !== "" && !/^\d+$/.test(raw)) {
        setMsgBasics("Age must be a whole number");
        return;
      }
      if (raw.length > 3) {
        setMsgBasics("Age must be 0-130");
      return;
      }
      const ageValueRaw = raw === "" ? null : Number(raw);
      const  ageValue = unwrap(vAge(ageValueRaw));

      const body = {
        age: ageValue,
        location: location ? location : null,
      };

      const res = await apiFetch("/api/me/profile", {
        method: "PATCH",
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.ok === false) {
        setMsgBasics(data.error || "Failed to save");
        return;
      }

      // expects data.user from backend
      const updatedUser = data.user ?? null;
      if (!updatedUser) {
        setMsgBasics("This input cannot be used");
        return;
      }

      // sync UI from backend truth
      setProfile((prev: any) => ({ ...(prev ?? {}), ...updatedUser }));
      setAgeRaw(typeof updatedUser.age === "number" ? String(updatedUser.age) : "");
      setLocation(typeof updatedUser.location === "string" ? updatedUser.location : "");

      setMsgBasics("Saved ✅");
    } catch (e: any) {
      setMsgBasics(e?.message || "Invalid input");
    } finally {
      setSavingProfile(false);
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

      {/* ----------------------------
          Avatar card
      ---------------------------- */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
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
                <img src={previewUrl} className="w-full h-full object-cover" alt="preview" />
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
                disabled={busyAvatar}
                className="bg-blue-600 px-4 py-2 rounded font-bold hover:bg-blue-500 disabled:opacity-50"
              >
                Choose image
              </button>

              <button
                type="button"
                onClick={uploadAvatar}
                disabled={busyAvatar || !selected}
                className="bg-green-600 px-4 py-2 rounded font-bold hover:bg-green-500 disabled:opacity-50"
              >
                {busyAvatar ? "Uploading..." : "Upload"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setMsgAvatar(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                disabled={busyAvatar}
                className="bg-gray-700 px-4 py-2 rounded font-bold hover:bg-gray-600 disabled:opacity-50"
              >
                Clear
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-3">Allowed: JPG / PNG / WEBP. Max size: 2MB.</p>

            {msgAvatar && <p className="text-sm text-gray-300 mt-3">{msgAvatar}</p>}
          </div>
        </div>
      </div>

      {/* ----------------------------
          Basics (age/location)
      ---------------------------- */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Basics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Age</label>
            <input
              type="number"
              min={0}
              max={130}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              value={ageRaw}
              onKeyDown={(e:any) => {
                if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
              }}
              onChange={(e:any) => {
                setAgeRaw(e.target.value );
                if (msgBasics) setMsgBasics(null);
              }}
              placeholder="e.g. 21"
            />
            <p className="text-xs text-gray-400 mt-1">Optional</p>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Location</label>
            <select
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              value={location}
              onChange={(e:any) => {
                setLocation(e.target.value);
                if (msgBasics) setMsgBasics(null);
              }}
            >
              <option value="">— select warehouse —</option>
              {WAREHOUSES.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">Optional</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={saveBasics}
            disabled={savingProfile}
            className="bg-green-600 px-4 py-2 rounded font-bold hover:bg-green-500 disabled:opacity-50"
          >
            {savingProfile ? "Saving..." : "Save"}
          </button>
        </div>

        {msgBasics && <p className="text-sm text-gray-300 mt-3">{msgBasics}</p>}
      </div>
    </div>
  );
}
