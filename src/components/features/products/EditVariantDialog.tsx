import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateVariant } from '@/hooks/useProducts';
import { Loader2, Copy } from 'lucide-react';
import type { ProductVariant } from '@/types/product.types';
import { toast } from 'sonner';

interface EditVariantDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    variant: ProductVariant | null;
    productName: string;
}

export function EditVariantDialog({ open, onOpenChange, variant, productName, }: EditVariantDialogProps) {
    const [formData, setFormData] = useState({
        color: '',
        size: '',
        stockQuantity: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const updateVariant = useUpdateVariant();

    useEffect(() => {
        if (variant) {
            setFormData({
                color: variant.color || '',
                size: variant.size || '',
                stockQuantity: variant.stockQuantity.toString(),
            });
        }
    }, [variant]);

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

        if (!variant || !validateForm()) return;

        try {
            await updateVariant.mutateAsync({
                id: variant.id,
                data: {
                    name: `${formData.color} - ${formData.size}`,
                    color: formData.color,
                    size: formData.size,
                    stockQuantity: parseInt(formData.stockQuantity),
                },
            });

            setErrors({});
            onOpenChange(false);
        } catch (error) {
            console.error('Erreur lors de la modification de la variante:', error);
        }
    };

    const handleDuplicate = () => {
        toast.info('Fonctionnalité de duplication à implémenter');
        // TODO: Implémenter la logique de duplication
    };

    if (!variant) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Modifier la variante</DialogTitle>
                    <p className="text-sm text-gray-500">Pour le produit : {productName}</p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Couleur et Taille */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="edit-color">
                                Couleur <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="edit-color"
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                className={errors.color ? 'border-red-500' : ''}
                            />
                            {errors.color && <p className="text-xs text-red-500 mt-1">{errors.color}</p>}
                        </div>

                        <div>
                            <Label htmlFor="edit-size">
                                Taille <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="edit-size"
                                value={formData.size}
                                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                className={errors.size ? 'border-red-500' : ''}
                            />
                            {errors.size && <p className="text-xs text-red-500 mt-1">{errors.size}</p>}
                        </div>
                    </div>

                    {/* Stock */}
                    <div>
                        <Label htmlFor="edit-stock">
                            Stock disponible <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="edit-stock"
                            type="number"
                            min="0"
                            value={formData.stockQuantity}
                            onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                            className={errors.stockQuantity ? 'border-red-500' : ''}
                        />
                        {errors.stockQuantity && (
                            <p className="text-xs text-red-500 mt-1">{errors.stockQuantity}</p>
                        )}
                    </div>

                    {/* SKU (lecture seule) */}
                    <div>
                        <Label htmlFor="edit-sku">SKU</Label>
                        <div className="flex gap-2">
                            <Input id="edit-sku" value={variant.sku} disabled className="font-mono text-sm" />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    navigator.clipboard.writeText(variant.sku);
                                    toast.success('SKU copié');
                                }}
                            >
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={updateVariant.isPending}
                        >
                            Annuler
                        </Button>
                        {/*<Button
                            type="button"
                            variant="outline"
                            className="gap-2"
                            onClick={handleDuplicate}
                            disabled={updateVariant.isPending}
                        >
                            <Copy className="w-4 h-4" />
                            Dupliquer
                        </Button>*/}
                        <Button
                            type="submit"
                            className="bg-black text-white hover:bg-gray-800"
                            disabled={updateVariant.isPending}
                        >
                            {updateVariant.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Enregistrement...
                                </>
                            ) : (
                                'Enregistrer'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}