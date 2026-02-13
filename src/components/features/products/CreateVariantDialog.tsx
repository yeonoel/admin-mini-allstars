import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateVariant } from '@/hooks/useProducts';
import { Loader2 } from 'lucide-react';

interface CreateVariantDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productId: string;
    productName: string;
}

export function CreateVariantDialog({
    open,
    onOpenChange,
    productId,
    productName,
}: CreateVariantDialogProps) {
    const [formData, setFormData] = useState({
        color: '',
        size: '',
        stockQuantity: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const createVariant = useCreateVariant();

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.color.trim()) {
            newErrors.color = 'La couleur est requise';
        }

        if (!formData.size.trim()) {
            newErrors.size = 'La taille est requise';
        }

        if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
            newErrors.stockQuantity = 'Le stock doit être un nombre positif';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await createVariant.mutateAsync({
                productId,
                name: `${formData.color} - ${formData.size}`,
                color: formData.color,
                size: formData.size,
                stockQuantity: parseInt(formData.stockQuantity),
            });

            // Réinitialiser le formulaire
            setFormData({
                color: '',
                size: '',
                stockQuantity: '',
            });
            setErrors({});
            onOpenChange(false);
        } catch (error) {
            console.error('Erreur lors de la création de la variante:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Ajouter une variante</DialogTitle>
                    <p className="text-sm text-gray-500">Pour le produit : {productName}</p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Couleur et Taille */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="color">
                                Couleur <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="color"
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                placeholder="Ex: Noir, Blanc..."
                                className={errors.color ? 'border-red-500' : ''}
                            />
                            {errors.color && <p className="text-xs text-red-500 mt-1">{errors.color}</p>}
                        </div>

                        <div>
                            <Label htmlFor="size">
                                Taille <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="size"
                                value={formData.size}
                                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                placeholder="Ex: 42, M, L..."
                                className={errors.size ? 'border-red-500' : ''}
                            />
                            {errors.size && <p className="text-xs text-red-500 mt-1">{errors.size}</p>}
                        </div>
                    </div>

                    {/* Stock */}
                    <div>
                        <Label htmlFor="stock">
                            Stock disponible <span className="text-red-500">*</span>
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

                    {/* Info SKU */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-800">
                            ℹ️ Le SKU sera généré automatiquement lors de la création
                        </p>
                    </div>

                    {/* Boutons */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={createVariant.isPending}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            className="bg-black text-white hover:bg-gray-800"
                            disabled={createVariant.isPending}
                        >
                            {createVariant.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Ajout...
                                </>
                            ) : (
                                'Ajouter la variante'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}