import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    ExternalLink, Pencil, X, Store, Phone,
    FileText, Image, Loader2
} from "lucide-react";
import { useStore, useUpdateStore } from "@/hooks/useStore";
import { isValidCIPhone } from "@/lib/utils";
import { getStoreUrl } from "@/config";
import { CopyButton } from "@/components/common/copirUrl/CopieUrl";


const schema = yup.object({
    name: yup.string().min(2, "Minimum 2 caractères").required("Nom requis"),
    whatsappNumber: yup
        .string()
        .required("Numéro requis")
        .test("ci-phone", "Numéro invalide (ex: 0747492156)", (v) => isValidCIPhone(v ?? "")),
    description: yup.string().optional().default(""),
});

type FormFields = yup.InferType<typeof schema>;

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Sk({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />;
}

function PageSkeleton() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="h-24 bg-gray-200 animate-pulse" />
                <div className="px-4 pb-4">
                    <div className="flex items-end justify-between -mt-8 mb-3">
                        <Sk className="w-16 h-16 rounded-xl" />
                        <Sk className="w-20 h-8 rounded-lg" />
                    </div>
                    <Sk className="w-40 h-5 mb-2" />
                    <Sk className="w-24 h-3 mb-2" />
                    <Sk className="w-16 h-5 rounded-full" />
                </div>
            </div>
            <Sk className="w-full h-28 rounded-2xl" />
            <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
                <Sk className="w-28 h-3" />
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3 py-2">
                        <Sk className="w-8 h-8 rounded-lg shrink-0" />
                        <div className="space-y-1.5 flex-1">
                            <Sk className="w-16 h-3" />
                            <Sk className="w-36 h-4" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── InfoRow ──────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-medium text-gray-900 break-all">{value || "—"}</p>
            </div>
        </div>
    );
}



// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StorePage() {
    const { data: store, isLoading, isError } = useStore();
    const updateMutation = useUpdateStore();
    const [editing, setEditing] = useState(false);
    const [logo, setLogo] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const storefrontUrl = getStoreUrl(store?.slug ?? "");

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormFields>({
        resolver: yupResolver(schema) as any,
    });

    useEffect(() => {
        if (store) {
            reset({
                name: store.name,
                whatsappNumber: store.whatsappNumber ?? "",
                description: store.description ?? "",
            });
        }
    }, [store, reset]);

    const onSubmit = (data: FormFields) => {
        if (!store) return;
        updateMutation.mutate(
            { id: store.id, dto: { ...data, logo: logo ?? undefined } },
            { onSuccess: () => { setEditing(false); setLogo(null); } }
        );
    };

    const onCancel = () => {
        setEditing(false);
        setLogo(null);
        if (store) reset({ name: store.name, whatsappNumber: store.whatsappNumber ?? "", description: store.description ?? "" });
    };

    const logoPreview = logo ? URL.createObjectURL(logo) : store?.logoUrl ?? null;
    const initial = (store?.name?.charAt(0) ?? "K").toUpperCase();

    if (isLoading) return <PageSkeleton />;

    if (isError) return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="bg-white rounded-2xl border border-red-100 p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
                    <Store className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Erreur de chargement</p>
                <p className="text-xs text-gray-400">Impossible de récupérer les infos de votre boutique.</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

            {/* ── Header ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="h-24 bg-linear-to-r from-gray-900 via-gray-800 to-gray-700 relative">
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                </div>
                <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                    <div className="flex items-end justify-between -mt-8 mb-3">
                        <div className="w-16 h-16 rounded-xl border-[3px] border-white shadow-md overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                            {logoPreview
                                ? <img src={logoPreview} alt="logo" className="w-full h-full object-cover" />
                                : <span className="text-xl font-bold text-gray-400">{initial}</span>
                            }
                        </div>
                        {!editing && (
                            <button
                                onClick={() => setEditing(true)}
                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 active:scale-95 transition-all"
                            >
                                <Pencil className="w-3 h-3" />
                                Modifier
                            </button>
                        )}
                    </div>
                    <h1 className="text-base font-bold text-gray-900 mb-0.5">{store?.name}</h1>
                    <p className="text-xs text-gray-400 mb-2">@{store?.slug}</p>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${store?.status === "active" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${store?.status === "active" ? "bg-green-500" : "bg-yellow-500"}`} />
                        {store?.status === "active" ? "Active" : "En attente"}
                    </span>
                </div>
            </div>

            {/* ── Lien boutique ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Lien de votre vitrine</p>
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200 mb-3">
                    <p className="text-xs text-gray-600 truncate flex-1 font-mono">{storefrontUrl}</p>
                    <CopyButton text={storefrontUrl} />
                </div>
                <a
                    href={storefrontUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-700 rounded-xl transition-colors no-underline active:scale-95"
                >
                    <ExternalLink className="w-4 h-4" />
                    Voir ma boutique
                </a>
            </div>

            {/* ── Infos ── */}
            {!editing && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Informations</p>
                    <InfoRow icon={<Store className="w-4 h-4 text-gray-500" />} label="Nom" value={store?.name} />
                    <InfoRow icon={<Phone className="w-4 h-4 text-gray-500" />} label="WhatsApp" value={store?.whatsappNumber} />
                    <InfoRow icon={<FileText className="w-4 h-4 text-gray-500" />} label="Description" value={store?.description} />
                </div>
            )}

            {/* ── Formulaire ── */}
            {editing && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-sm font-semibold text-gray-900">Modifier la boutique</p>
                        <button onClick={onCancel} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                            <X className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                        {/* Logo */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">Logo</label>
                            <div className="flex items-center gap-3">
                                <div
                                    onClick={() => inputRef.current?.click()}
                                    className="w-14 h-14 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-500 overflow-hidden flex items-center justify-center bg-gray-50 cursor-pointer transition-colors shrink-0 active:scale-95"
                                >
                                    {logoPreview
                                        ? <img src={logoPreview} alt="logo" className="w-full h-full object-cover" />
                                        : <Image className="w-5 h-5 text-gray-300" />
                                    }
                                </div>
                                <div>
                                    <button type="button" onClick={() => inputRef.current?.click()}
                                        className="text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                                        {logo ? "Changer le logo" : "Ajouter un logo"}
                                    </button>
                                    {logo && (
                                        <button type="button" onClick={() => setLogo(null)} className="text-xs text-red-500 ml-2">Supprimer</button>
                                    )}
                                    <p className="text-[11px] text-gray-400 mt-1">PNG, JPG · max 2 Mo</p>
                                </div>
                            </div>
                            <input ref={inputRef} type="file" accept="image/png,image/jpeg" className="hidden"
                                onChange={e => {
                                    const f = e.target.files?.[0];
                                    if (f && f.size <= 2 * 1024 * 1024) setLogo(f);
                                }} />
                        </div>

                        {/* Nom */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Nom de la boutique</label>
                            <input {...register("name")} placeholder="Ex: Tech Universe"
                                className={`w-full px-3 py-2.5 text-sm bg-gray-50 border rounded-xl outline-none transition-colors ${errors.name ? "border-red-400" : "border-gray-200 focus:border-gray-500"}`} />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                        </div>

                        {/* WhatsApp */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Numéro WhatsApp</label>
                            <input {...register("whatsappNumber")} placeholder="Ex: 0747492156" inputMode="numeric"
                                className={`w-full px-3 py-2.5 text-sm bg-gray-50 border rounded-xl outline-none transition-colors ${errors.whatsappNumber ? "border-red-400" : "border-gray-200 focus:border-gray-500"}`} />
                            {errors.whatsappNumber && <p className="text-xs text-red-500 mt-1">{errors.whatsappNumber.message}</p>}
                            <p className="text-[11px] text-gray-400 mt-1">Formats : 0747492156 · 2250747492156 · +2250747492156</p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                Description <span className="text-gray-400 font-normal">(optionnel)</span>
                            </label>
                            <textarea {...register("description")} placeholder="Décrivez votre boutique..." rows={3}
                                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 focus:border-gray-500 rounded-xl outline-none transition-colors resize-none" />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-1">
                            <button type="button" onClick={onCancel}
                                className="flex-1 py-3 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors active:scale-95">
                                Annuler
                            </button>
                            <button type="submit" disabled={updateMutation.isPending}
                                className="flex-2 py-3 text-sm font-bold text-white bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 rounded-xl transition-colors active:scale-95 flex items-center justify-center gap-2">
                                {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                {updateMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}