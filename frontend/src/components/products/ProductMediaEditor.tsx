import { ArrowUp, ArrowDown, X, PlayCircle } from 'lucide-react';

export interface ExistingMediaItem {
    id: string;
    url: string;
    type: 'IMAGE' | 'VIDEO';
}

export type MediaOrderEntry =
    | { kind: 'existing'; id: string }
    | { kind: 'new'; fileIndex: number };

interface ProductMediaEditorProps {
    existingMedia: ExistingMediaItem[];
    newFiles: File[];
    order: MediaOrderEntry[];
    onChange: (next: { newFiles: File[]; order: MediaOrderEntry[] }) => void;
    maxItems?: number;
}

// Caches object URLs per File so we don't recreate them on every render.
const previewUrlCache = new WeakMap<File, string>();
const getPreviewUrl = (file: File) => {
    let url = previewUrlCache.get(file);
    if (!url) {
        url = URL.createObjectURL(file);
        previewUrlCache.set(file, url);
    }
    return url;
};

export default function ProductMediaEditor({
    existingMedia,
    newFiles,
    order,
    onChange,
    maxItems = 8,
}: ProductMediaEditorProps) {
    const resolveEntry = (entry: MediaOrderEntry) => {
        if (entry.kind === 'existing') {
            const media = existingMedia.find((m) => m.id === entry.id);
            if (!media) return null;
            return { url: media.url, type: media.type, key: `existing-${media.id}` };
        }
        const file = newFiles[entry.fileIndex];
        if (!file) return null;
        return {
            url: getPreviewUrl(file),
            type: file.type.startsWith('video/') ? ('VIDEO' as const) : ('IMAGE' as const),
            key: `new-${entry.fileIndex}`,
        };
    };

    const move = (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= order.length) return;
        const next = [...order];
        [next[index], next[target]] = [next[target], next[index]];
        onChange({ newFiles, order: next });
    };

    const removeAt = (index: number) => {
        const entry = order[index];
        if (entry.kind === 'new') {
            const removedIndex = entry.fileIndex;
            const nextFiles = newFiles.filter((_, i) => i !== removedIndex);
            const nextOrder = order
                .filter((_, i) => i !== index)
                .map((e) =>
                    e.kind === 'new' && e.fileIndex > removedIndex
                        ? { ...e, fileIndex: e.fileIndex - 1 }
                        : e
                );
            onChange({ newFiles: nextFiles, order: nextOrder });
        } else {
            onChange({ newFiles, order: order.filter((_, i) => i !== index) });
        }
    };

    const addFiles = (files: File[]) => {
        const remaining = maxItems - order.length;
        if (remaining <= 0) return;
        const toAdd = files.slice(0, remaining);
        const startIndex = newFiles.length;
        const newEntries: MediaOrderEntry[] = toAdd.map((_, i) => ({
            kind: 'new',
            fileIndex: startIndex + i,
        }));
        onChange({ newFiles: [...newFiles, ...toAdd], order: [...order, ...newEntries] });
    };

    const atCapacity = order.length >= maxItems;

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {order.map((entry, index) => {
                    const item = resolveEntry(entry);
                    if (!item) return null;
                    return (
                        <div
                            key={item.key}
                            className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group bg-gray-100"
                        >
                            {item.type === 'VIDEO' ? (
                                <>
                                    <video src={item.url} className="w-full h-full object-cover" muted />
                                    <PlayCircle className="absolute inset-0 m-auto w-6 h-6 text-white drop-shadow" />
                                </>
                            ) : (
                                <img src={item.url} alt="Preview" className="w-full h-full object-cover" />
                            )}

                            {index === 0 && (
                                <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">
                                    Primary
                                </span>
                            )}

                            <button
                                type="button"
                                onClick={() => removeAt(index)}
                                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove"
                            >
                                <X className="w-3 h-3" />
                            </button>

                            <div className="absolute top-1 left-1 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={() => move(index, -1)}
                                    disabled={index === 0}
                                    className="bg-black/60 text-white rounded w-5 h-5 flex items-center justify-center disabled:opacity-30"
                                    aria-label="Move earlier"
                                >
                                    <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => move(index, 1)}
                                    disabled={index === order.length - 1}
                                    className="bg-black/60 text-white rounded w-5 h-5 flex items-center justify-center disabled:opacity-30"
                                    aria-label="Move later"
                                >
                                    <ArrowDown className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="space-y-1">
                <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    disabled={atCapacity}
                    onChange={(e) => {
                        addFiles(Array.from(e.target.files || []));
                        e.target.value = '';
                    }}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50"
                />
                <p className="text-xs text-gray-500">
                    Images and short videos, up to {maxItems} total. Use the arrows to reorder — the
                    first item is shown as the primary thumbnail.
                </p>
            </div>
        </div>
    );
}
