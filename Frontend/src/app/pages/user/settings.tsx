// src/app/pages/user/settings.tsx
import { useEffect, useRef, useState, navigate, openModal } from "Reactor";
import { apiFetch } from "@/core/lib/api";
import { useAuth } from "@/core/lib/useAuth";
import { vAge, vUsername } from "@/core/lib/input/validators";
import { unwrap } from "@/core/lib/input/unwrap";
import { getDefaultAvatar } from "@/core/lib/defaultAvatar";

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

      setMsgAvatar("[SUCCESS] Avatar updated");
      window.dispatchEvent(new Event("user:avatar-update"));
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
      const ageValue = unwrap(vAge(ageValueRaw));

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

      setMsgBasics("[SUCCESS] Saved");
    } catch (e: any) {
      setMsgBasics(e?.message || "Invalid input");
    } finally {
      setSavingProfile(false);
    }
  }

  if (!token) return <div>Not logged in</div>;

  if (loading) {
    return (
      <div className="min-h-screen p-6 md:p-10 text-white">
        <div className="max-w-4xl mx-auto animate-pulse space-y-8">
          <div className="h-12 w-48 bg-gray-800/50 rounded-xl" />
          <div className="h-64 w-full bg-gray-900/50 backdrop-blur-md rounded-2xl border border-white/5" />
          <div className="h-48 w-full bg-gray-900/50 backdrop-blur-md rounded-2xl border border-white/5" />
        </div>
      </div>
    );
  }

  const currentAvatar = profile?.avatarUrl || null;

  return (
    <div className="min-h-screen text-white pb-20">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_1px]"></div>

      {/* Hero Header */}
      <div className="relative bg-gray-950 border-b border-white/5 py-8 md:py-12 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/20 via-purple-950/10 to-gray-950"></div>
        <div className="max-w-4xl mx-auto px-6 md:px-10 relative z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                <span className="icon-[solar--settings-bold-duotone] text-3xl md:text-4xl text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">System Preferences</h1>
                <p className="text-gray-400 text-sm font-mono mt-1">Configure your operator profile</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/user/me")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800/50 border border-white/10 text-gray-300 hover:text-cyan-400 hover:bg-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 backdrop-blur-sm group"
            >
              <span className="icon-[solar--arrow-left-bold] text-lg group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline font-medium">Back</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-10 space-y-8">
        {/* Avatar Section */}
        <section className="relative overflow-hidden bg-gray-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:p-8 group">
          {/* Cyan accent border */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400/50 via-cyan-400 to-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.3)] opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="flex items-center gap-3 mb-6">
            <span className="icon-[solar--user-circle-bold-duotone] text-2xl text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Avatar</h2>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            {/* Avatar Previews */}
            <div className="flex gap-6 shrink-0">
              {/* Current avatar */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative group/avatar">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full blur opacity-30 group-hover/avatar:opacity-60 transition-opacity"></div>
                  <div
                    className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center ring-2 ring-white/10 cursor-pointer hover:ring-cyan-400/50 transition-all"
                    onClick={() => {
                      if (currentAvatar) {
                        openModal({
                          type: "IMAGE_ZOOM",
                          payload: { url: currentAvatar },
                          className: "!bg-transparent !p-0 !border-none !shadow-none !w-auto !max-w-none !max-h-none !overflow-visible",
                          render: ({ url }: any) => (
                            <div className="flex flex-col items-center justify-center outline-none" tabIndex={0} data-modal-autofocus>
                              <img
                                src={url}
                                className="max-h-[60vh] max-w-[80vw] object-contain rounded-xl shadow-2xl border border-white/10"
                                alt="Zoomed avatar"
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
                      }
                    }}
                  >
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
                      <span className="icon-[solar--user-bold] text-3xl text-gray-500" />
                    )}
                    {/* Zoom overlay */}
                    {currentAvatar && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                        <span className="icon-[solar--magnifer-zoom-in-bold] text-white text-xl" />
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider font-mono">Current</span>
              </div>

              {/* Preview avatar */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative group/preview">
                  <div
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-800/50 border-2 ${previewUrl ? 'border-cyan-500/30 cursor-pointer hover:border-cyan-400' : 'border-dashed border-gray-700'} flex items-center justify-center transition-all`}
                    onClick={() => {
                      if (previewUrl) {
                        openModal({
                          type: "IMAGE_ZOOM",
                          payload: { url: previewUrl },
                          className: "!bg-transparent !p-0 !border-none !shadow-none !w-auto !max-w-none !max-h-none !overflow-visible",
                          render: ({ url }: any) => (
                            <div className="flex flex-col items-center justify-center outline-none" tabIndex={0} data-modal-autofocus>
                              <img
                                src={url}
                                className="max-h-[60vh] max-w-[80vw] object-contain rounded-xl shadow-2xl border border-white/10"
                                alt="Preview avatar"
                              />
                            </div>
                          )
                        });
                      }
                    }}
                  >
                    {previewUrl ? (
                      <>
                        <img src={previewUrl} className="w-full h-full object-cover" alt="preview" />
                        {/* Zoom overlay */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity">
                          <span className="icon-[solar--magnifer-zoom-in-bold] text-white text-xl" />
                        </div>
                      </>
                    ) : (
                      <span className="icon-[solar--gallery-add-bold-duotone] text-2xl text-gray-600" />
                    )}
                  </div>
                </div>
                <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider font-mono">Preview</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex-1 w-full md:w-auto">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onFileChange}
              />

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <button
                  type="button"
                  onClick={pickFile}
                  disabled={busyAvatar}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 font-medium text-sm hover:bg-cyan-900/50 hover:border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <span className="icon-[solar--gallery-bold]" />
                  Choose
                </button>

                <button
                  type="button"
                  onClick={uploadAvatar}
                  disabled={busyAvatar || !selected}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 font-medium text-sm hover:bg-emerald-900/50 hover:border-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <span className={busyAvatar ? "icon-[svg-spinners--ring-resize]" : "icon-[solar--upload-bold]"} />
                  {busyAvatar ? "Uploading..." : "Upload"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    setMsgAvatar(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  disabled={busyAvatar || !selected}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800/50 border border-gray-600/40 text-gray-400 font-medium text-sm hover:bg-gray-700/50 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <span className="icon-[solar--close-circle-bold]" />
                  Clear
                </button>
              </div>

              <p className="text-[10px] md:text-xs text-gray-500 mt-4 font-mono text-center md:text-left">
                <span className="icon-[solar--info-circle-bold] mr-1 opacity-60" />
                Allowed: JPG / PNG / WEBP • Max: 2MB
              </p>

              {msgAvatar && (
                <div className={`mt-4 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${msgAvatar.includes("[SUCCESS]") ? "bg-emerald-950/40 border border-emerald-500/30 text-emerald-400" : "bg-amber-950/40 border border-amber-500/30 text-amber-400"}`}>
                  <span className={msgAvatar.includes("[SUCCESS]") ? "icon-[solar--check-circle-bold]" : "icon-[solar--danger-triangle-bold]"} />
                  {msgAvatar.replace("[SUCCESS] ", "")}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Basics Section */}
        <section className="relative overflow-hidden bg-gray-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:p-8 group">
          {/* Cyan accent border */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-400/50 via-purple-400 to-purple-400/50 shadow-[0_0_10px_rgba(168,85,247,0.3)] opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="flex items-center gap-3 mb-6">
            <span className="icon-[solar--user-id-bold-duotone] text-2xl text-purple-400" />
            <h2 className="text-xl font-bold text-white">Operator Info</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                <span className="icon-[solar--calendar-bold] text-gray-500" />
                Age
              </label>
              <input
                type="number"
                min={0}
                max={130}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all duration-300"
                value={ageRaw}
                onKeyDown={(e: any) => {
                  if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
                }}
                onChange={(e: any) => {
                  setAgeRaw(e.target.value);
                  if (msgBasics) setMsgBasics(null);
                }}
                placeholder="e.g. 21"
              />
              <p className="text-[10px] text-gray-500 font-mono">Optional field</p>
            </div>

            {/* Location Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                <span className="icon-[solar--map-point-bold] text-gray-500" />
                Warehouse Location
              </label>
              <select
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all duration-300 appearance-none cursor-pointer"
                value={location}
                onChange={(e: any) => {
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
              <p className="text-[10px] text-gray-500 font-mono">Optional field</p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={saveBasics}
              disabled={savingProfile}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-400 font-bold hover:bg-purple-900/50 hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <span className={savingProfile ? "icon-[svg-spinners--ring-resize]" : "icon-[solar--diskette-bold]"} />
              {savingProfile ? "Saving..." : "Save Changes"}
            </button>

            {msgBasics && (
              <div className={`px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${msgBasics.includes("[SUCCESS]") ? "bg-emerald-950/40 border border-emerald-500/30 text-emerald-400" : "bg-red-950/40 border border-red-500/30 text-red-400"}`}>
                <span className={msgBasics.includes("[SUCCESS]") ? "icon-[solar--check-circle-bold]" : "icon-[solar--danger-triangle-bold]"} />
                {msgBasics.replace("[SUCCESS] ", "")}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
