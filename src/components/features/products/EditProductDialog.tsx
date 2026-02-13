import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from './ImageUpload';
import { useUpdateProduct } from '@/hooks/useProducts';
import { Loader2, X } from 'lucide-react';
import type { Product } from '@/types/product.types';

interface EditProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product | null;
}

export function EditProductDialog({ open, onOpenChange, product }: EditProductDialogProps) {
    const [formData, setFormData] = useState({
        name: '',
        shortDescription: '',
        price: '',
        stockQuantity: '',
        existingImages: [] as { id: string; url: string }[],
        newImages: [] as File[],
        imagesToDelete: [] as string[], // IDs des images à supprimer
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const updateProduct = useUpdateProduct();

    // Initialiser le formulaire avec les données du produit
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                shortDescription: product.shortDescription || product.description || '',
                price: product.price,
                stockQuantity: product.stockQuantity.toString(),
                existingImages: product.images.map((img) => ({
                    id: img.id,
                    url: img.imageUrl,
                })),
                newImages: [],
                imagesToDelete: [],
            });
            setErrors({});
        }
    }, [product]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom du produit est requis';
        }

        if (!formData.shortDescription.trim()) {
            newErrors.shortDescription = 'La description est requise';
        } else if (formData.shortDescription.length > 150) {
            newErrors.shortDescription = 'La description ne doit pas dépasser 150 caractères';
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Le prix doit être supérieur à 0';
        }

        if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
            newErrors.stockQuantity = 'Le stock doit être un nombre positif';
        }

        const totalImages =
            formData.existingImages.length -
            formData.imagesToDelete.length +
            formData.newImages.length;

        if (totalImages === 0) {
            newErrors.images = 'Au moins une image est requise';
        } else if (totalImages > 3) {
            newErrors.images = 'Maximum 3 images autorisées';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!product || !validateForm()) return;

        try {
            await updateProduct.mutateAsync({
                id: product.id,
                data: {
                    name: formData.name,
                    shortDescription: formData.shortDescription,
                    price: parseFloat(formData.price),
                    stockQuantity: parseInt(formData.stockQuantity),
                    newImages: formData.newImages,
                    imagesToDelete: formData.imagesToDelete,
                },
            });

            onOpenChange(false);
        } catch (error) {
            console.error('Erreur lors de la modification:', error);
        }
    };

    const removeExistingImage = (imageId: string) => {
        setFormData({
            ...formData,
            imagesToDelete: [...formData.imagesToDelete, imageId],
        });
    };

    const restoreExistingImage = (imageId: string) => {
        setFormData({
            ...formData,
            imagesToDelete: formData.imagesToDelete.filter((id) => id !== imageId),
        });
    };

    const handleNewImagesChange = (images: File[]) => {
        setFormData({ ...formData, newImages: images });
    };

    if (!product) return null;

    const visibleExistingImages = formData.existingImages.filter(
        (img) => !formData.imagesToDelete.includes(img.id)
    );

    const totalImages = visibleExistingImages.length + formData.newImages.length;
    const canAddMore = totalImages < 3;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Modifier le produit</DialogTitle>
                    <p className="text-sm text-gray-500">
                        Modifiez les informations du produit "{product.name}"
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nom du produit */}
                    <div>
                        <Label htmlFor="edit-name">
                            Nom du produit <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="edit-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: Classic High Top"
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Prix et Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="edit-price">
                                Prix (FCFA) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="edit-price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="0"
                                className={errors.price ? 'border-red-500' : ''}
                            />
                            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                        </div>

                        <div>
                            <Label htmlFor="edit-stock">
                                Stock <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="edit-stock"
                                type="number"
                                min="0"
                                value={formData.stockQuantity}
                                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                                placeholder="0"
                                className={errors.stockQuantity ? 'border-red-500' : ''}
                            />
                            {errors.stockQuantity && (
                                <p className="text-xs text-red-500 mt-1">{errors.stockQuantity}</p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="edit-description">
                            Description courte <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="edit-description"
                            value={formData.shortDescription}
                            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                            placeholder="Description du produit (max 150 caractères)..."
                            maxLength={150}
                            rows={3}
                            className={`resize-none w-full h-24 overflow-y-auto ${errors.shortDescription ? 'border-red-500' : ''
                                }`}
                        />
                        <div className="flex justify-between items-center mt-1">
                            {errors.shortDescription && (
                                <p className="text-xs text-red-500">{errors.shortDescription}</p>
                            )}
                            <p className="text-xs text-gray-500 ml-auto">
                                {formData.shortDescription.length}/150
                            </p>
                        </div>
                    </div>

                    {/* Images existantes */}
                    {formData.existingImages.length > 0 && (
                        <div>
                            <Label>Images actuelles</Label>
                            <div className="grid grid-cols-3 gap-4 mt-2">
                                {formData.existingImages.map((img) => {
                                    const isMarkedForDeletion = formData.imagesToDelete.includes(img.id);

                                    return (
                                        <div key={img.id} className="relative group">
                                            <img
                                                src={img.url}
                                                alt="Image du produit"
                                                className={`w-full h-32 object-cover rounded-lg border border-gray-200 ${isMarkedForDeletion ? 'opacity-50 grayscale' : ''
                                                    }`}
                                            />

                                            {isMarkedForDeletion ? (
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    className="absolute top-2 right-2 h-8 text-xs"
                                                    onClick={() => restoreExistingImage(img.id)}
                                                >
                                                    Restaurer
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                                    onClick={() => removeExistingImage(img.id)}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            )}

                                            {isMarkedForDeletion && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                                                        À supprimer
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Nouvelles images */}
                    {canAddMore && (
                        <div>
                            <Label>
                                Nouvelles images à ajouter{' '}
                                <span className="text-xs text-gray-500">
                                    ({totalImages}/3 utilisées)
                                </span>
                            </Label>
                            <p className="text-xs text-gray-500 mb-2">
                                Vous pouvez ajouter encore {3 - totalImages} image(s)
                            </p>
                            <ImageUpload
                                maxImages={3 - totalImages}
                                value={formData.newImages}
                                onImagesChange={handleNewImagesChange}
                            />
                        </div>
                    )}

                    {errors.images && <p className="text-xs text-red-500">{errors.images}</p>}

                    {/* Info importante */}
                    {formData.imagesToDelete.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-xs text-yellow-800">
                                ⚠️ {formData.imagesToDelete.length} image(s) sera/seront supprimée(s) lors de la
                                modification
                            </p>
                        </div>
                    )}

                    {/* Boutons */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={updateProduct.isPending}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            className="bg-black text-white hover:bg-gray-800"
                            disabled={updateProduct.isPending}
                        >
                            {updateProduct.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Modification...
                                </>
                            ) : (
                                'Modifier le produit'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}