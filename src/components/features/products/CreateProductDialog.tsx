import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from './ImageUpload';
import { useCreateProduct } from '@/hooks/useProducts';
import { Loader2 } from 'lucide-react';

interface CreateProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateProductDialog({ open, onOpenChange }: CreateProductDialogProps) {
    const [formData, setFormData] = useState({
        name: '',
        shortDescription: '',
        price: '',
        stockQuantity: '',
        images: [] as File[],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const createProduct = useCreateProduct();

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

        if (formData.images.length === 0) {
            newErrors.images = 'Au moins une image est requise';
        } else if (formData.images.length > 3) {
            newErrors.images = 'Maximum 3 images autorisées';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await createProduct.mutateAsync({
                name: formData.name,
                shortDescription: formData.shortDescription,
                price: parseFloat(formData.price),
                stockQuantity: parseInt(formData.stockQuantity),
                images: formData.images,
            });

            // Réinitialiser le formulaire
            setFormData({
                name: '',
                shortDescription: '',
                price: '',
                stockQuantity: '',
                images: [],
            });
            setErrors({});
            onOpenChange(false);
        } catch (error) {
            console.error('Erreur lors de la création:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Créer un nouveau produit</DialogTitle>
                    <p className="text-sm text-gray-500">
                        Remplissez les informations de base du produit
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nom du produit */}
                    <div>
                        <Label htmlFor="name">
                            Nom du produit <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
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
                            <Label htmlFor="price">
                                Prix (FCFA) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="price"
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
                            <Label htmlFor="stock">
                                Stock initial <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="stock"
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
                        <Label htmlFor="description">
                            Description courte <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="description"
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

                    {/* Images */}
                    <div>
                        <Label>
                            Images du produit <span className="text-red-500">*</span>
                        </Label>
                        <p className="text-xs text-gray-500 mb-2">Ajoutez jusqu'à 3 images</p>
                        <ImageUpload
                            maxImages={3}
                            value={formData.images}
                            onImagesChange={(images) => setFormData({ ...formData, images })}
                        />
                        {errors.images && <p className="text-xs text-red-500 mt-1">{errors.images}</p>}
                    </div>

                    {/* Boutons */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={createProduct.isPending}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            className="bg-black text-white hover:bg-gray-800"
                            disabled={createProduct.isPending}
                        >
                            {createProduct.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Création...
                                </>
                            ) : (
                                'Créer le produit'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}