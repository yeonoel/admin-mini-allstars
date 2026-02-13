import { useCallback, useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
    maxImages?: number;
    onImagesChange: (images: File[]) => void;
    value?: File[];
}

export function ImageUpload({ maxImages = 3, onImagesChange, value = [] }: ImageUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const [previews, setPreviews] = useState<string[]>([]);

    // Synchroniser les previews avec les fichiers value
    useEffect(() => {
        if (value.length === 0) {
            setPreviews([]);
            return;
        }

        // Générer les previews pour tous les fichiers dans value
        const newPreviews: string[] = [];
        let loadedCount = 0;

        value.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                loadedCount++;
                if (loadedCount === value.length) {
                    setPreviews(newPreviews);
                }
            };
            reader.readAsDataURL(file);
        });
    }, [value]);

    const handleFiles = useCallback(
        (files: FileList | null) => {
            if (!files) return;

            const fileArray = Array.from(files);
            const remainingSlots = maxImages - value.length;

            if (fileArray.length > remainingSlots) {
                alert(`Vous ne pouvez ajouter que ${remainingSlots} image(s) supplémentaire(s)`);
                return;
            }

            const validFiles = fileArray.filter((file) => {
                if (!file.type.startsWith('image/')) {
                    alert(`${file.name} n'est pas une image valide`);
                    return false;
                }
                return true;
            });

            const newImages = [...value, ...validFiles];
            onImagesChange(newImages);
        },
        [value, maxImages, onImagesChange]
    );

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const removeImage = (index: number) => {
        const newImages = value.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    return (
        <div className="space-y-4">
            {/* Zone de drop */}
            {value.length < maxImages && (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={cn(
                        'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
                        dragActive
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-300 hover:border-gray-400'
                    )}
                >
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                        id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                            <Upload className="w-12 h-12 text-gray-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    Cliquez pour télécharger ou glissez-déposez
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    PNG, JPG, WEBP jusqu'à 10MB ({value.length}/{maxImages} images)
                                </p>
                            </div>
                        </div>
                    </label>
                </div>
            )}

            {/* Previews */}
            {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    {previews.map((preview, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                onClick={() => removeImage(index)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}