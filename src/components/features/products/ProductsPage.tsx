import { useState, useMemo } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    ChevronDown,
    ChevronRight,
    Package,
    DollarSign,
    Layers,
    Loader2,
    AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { CreateProductDialog } from './CreateProductDialog';
import { CreateVariantDialog } from './CreateVariantDialog';
import { EditVariantDialog } from './EditVariantDialog';
import { EditProductDialog } from './EditProductDialog';
import { ProductSearch } from './ProductSearch';

import { useProducts, useDeleteProduct, useDeleteVariant } from '@/hooks/useProducts';
import type { Product, ProductVariant } from '@/types/product.types';

export function ProductsPage() {
    // États pour les dialogs
    const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
    const [isEditProductOpen, setIsEditProductOpen] = useState(false);
    const [isCreateVariantOpen, setIsCreateVariantOpen] = useState(false);
    const [isEditVariantOpen, setIsEditVariantOpen] = useState(false);
    const [isDeleteProductDialogOpen, setIsDeleteProductDialogOpen] = useState(false);
    const [isDeleteVariantDialogOpen, setIsDeleteVariantDialogOpen] = useState(false);

    // États pour les sélections
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');

    // Hooks pour les données et mutations
    const { data, isLoading, error } = useProducts();
    const deleteProduct = useDeleteProduct();
    const deleteVariant = useDeleteVariant();

    // Filtrage des produits par recherche (côté front)
    const filteredProducts = useMemo(() => {
        if (!data?.data) return [];

        if (!searchQuery.trim()) return data.data;

        const query = searchQuery.toLowerCase();
        return data.data.filter(
            (product) =>
                product.name.toLowerCase().includes(query) ||
                product.description?.toLowerCase().includes(query) ||
                product.sku.toLowerCase().includes(query) ||
                product.variants.some(
                    (v) =>
                        v.name.toLowerCase().includes(query) ||
                        v.sku.toLowerCase().includes(query) ||
                        v.color?.toLowerCase().includes(query) ||
                        v.size?.toLowerCase().includes(query)
                )
        );
    }, [data, searchQuery]);

    // Calcul des statistiques
    const stats = useMemo(() => {
        if (!data?.data) return { total: 0, outOfStock: 0 };

        const outOfStock = data.data.filter((p) => p.stockQuantity === 0).length;
        return {
            total: data.data.length,
            outOfStock,
        };
    }, [data]);

    // Fonctions utilitaires
    const toggleProduct = (productId: string) => {
        const newExpanded = new Set(expandedProducts);
        if (newExpanded.has(productId)) {
            newExpanded.delete(productId);
        } else {
            newExpanded.add(productId);
        }
        setExpandedProducts(newExpanded);
    };

    const formatCurrency = (amount: string | number) => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return (
            new Intl.NumberFormat('fr-FR', {
                style: 'decimal',
                minimumFractionDigits: 0,
            }).format(numAmount) + ' FCFA'
        );
    };

    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;
        await deleteProduct.mutateAsync(selectedProduct.id);
        setIsDeleteProductDialogOpen(false);
        setSelectedProduct(null);
    };

    const handleDeleteVariant = async () => {
        if (!selectedVariant) return;
        await deleteVariant.mutateAsync(selectedVariant.id);
        setIsDeleteVariantDialogOpen(false);
        setSelectedVariant(null);
    };

    const handleAddVariant = (product: Product) => {
        setSelectedProduct(product);
        setIsCreateVariantOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsEditProductOpen(true);
    };

    const handleEditVariant = (product: Product, variant: ProductVariant) => {
        setSelectedProduct(product);
        setSelectedVariant(variant);
        setIsEditVariantOpen(true);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <p className="text-gray-600">Erreur lors du chargement des produits</p>
                <Button onClick={() => window.location.reload()}>Réessayer</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
                    <p className="text-sm text-gray-500">
                        {stats.total} produit(s)
                        {stats.outOfStock > 0 && ` · ${stats.outOfStock} en rupture`}
                    </p>
                </div>
                <Button
                    className="bg-black text-white hover:bg-gray-800 gap-2 w-full sm:w-auto"
                    onClick={() => setIsCreateProductOpen(true)}
                >
                    <Plus className="w-4 h-4" />
                    Ajouter un produit
                </Button>
            </div>

            {/* Barre de recherche */}
            <ProductSearch value={searchQuery} onChange={setSearchQuery} />

            {/* Message si aucun résultat */}
            {filteredProducts.length === 0 && searchQuery && (
                <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun produit trouvé pour "{searchQuery}"</p>
                    <Button variant="link" onClick={() => setSearchQuery('')}>
                        Effacer la recherche
                    </Button>
                </div>
            )}

            {/* MOBILE: Vue en cartes */}
            <div className="lg:hidden space-y-4">
                {filteredProducts.map((product) => (
                    <Card key={product.id}>
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                {/* Image et infos principales */}
                                <div className="flex gap-3">
                                    <img
                                        src={product.images.find((img) => img.isPrimary)?.imageUrl || product.images[0]?.imageUrl}
                                        alt={product.name}
                                        className="w-20 h-20 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-base mb-1">{product.name}</h3>
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {product.shortDescription || product.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Métriques en grille */}
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Prix</p>
                                            <p className="font-semibold">{formatCurrency(product.price)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Stock</p>
                                            <p
                                                className={`font-semibold ${product.stockQuantity === 0 ? 'text-red-600' : ''
                                                    }`}
                                            >
                                                {product.stockQuantity}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Layers className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Variantes</p>
                                            <Badge variant="outline" className="text-xs mt-1">
                                                {product.variants.length}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Boutons d'action */}
                                <div className="flex gap-2 pt-2 border-t">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 gap-2"
                                        onClick={() => handleAddVariant(product)}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Variante
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditProduct(product)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setIsDeleteProductDialogOpen(true);
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                </div>

                                {/* Variantes expandables */}
                                {product.variants.length > 0 && (
                                    <div className="border-t pt-3">
                                        <button
                                            onClick={() => toggleProduct(product.id)}
                                            className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900"
                                        >
                                            <span>Voir les variantes ({product.variants.length})</span>
                                            {expandedProducts.has(product.id) ? (
                                                <ChevronDown className="w-4 h-4" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4" />
                                            )}
                                        </button>

                                        {expandedProducts.has(product.id) && (
                                            <div className="mt-3 space-y-2">
                                                {product.variants.map((variant) => (
                                                    <div key={variant.id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex gap-2">
                                                                {variant.color && (
                                                                    <Badge className="text-xs">{variant.color}</Badge>
                                                                )}
                                                                {variant.size && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {variant.size}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleEditVariant(product, variant)}
                                                                >
                                                                    <Edit className="w-3 h-3" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setSelectedVariant(variant);
                                                                        setIsDeleteVariantDialogOpen(true);
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-3 h-3 text-red-600" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="text-gray-500 font-mono">{variant.sku}</span>
                                                            <span className="font-semibold">Stock: {variant.stockQuantity}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* DESKTOP: Vue tableau */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="w-12 px-6 py-3"></th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Produit
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Prix
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Variantes
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <>
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        {product.variants.length > 0 && (
                                            <button
                                                onClick={() => toggleProduct(product.id)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                {expandedProducts.has(product.id) ? (
                                                    <ChevronDown className="w-5 h-5" />
                                                ) : (
                                                    <ChevronRight className="w-5 h-5" />
                                                )}
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={
                                                    product.images.find((img) => img.isPrimary)?.imageUrl ||
                                                    product.images[0]?.imageUrl
                                                }
                                                alt={product.name}
                                                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                            />
                                            <div>
                                                <span className="font-medium text-gray-900 block">{product.name}</span>
                                                <span className="text-xs text-gray-500 font-mono">{product.sku}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-semibold text-gray-900">
                                            {formatCurrency(product.price)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`font-semibold ${product.stockQuantity === 0 ? 'text-red-600' : 'text-gray-900'
                                                }`}
                                        >
                                            {product.stockQuantity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant="outline" className="text-xs">
                                            {product.variants.length} variante(s)
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2"
                                                onClick={() => handleAddVariant(product)}
                                            >
                                                <Plus className="w-4 h-4" />
                                                Variante
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditProduct(product)}
                                            >
                                                <Edit className="w-4 h-4 text-gray-600" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setIsDeleteProductDialogOpen(true);
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>

                                {/* Variants rows */}
                                {expandedProducts.has(product.id) && product.variants.length > 0 && (
                                    <tr>
                                        <td colSpan={6} className="bg-gray-50 px-6 py-4">
                                            <div className="space-y-3">
                                                <h4 className="font-medium text-gray-900">Variantes de {product.name}</h4>
                                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                                    <table className="w-full">
                                                        <thead className="bg-gray-50 border-b border-gray-200">
                                                            <tr>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                                    Couleur
                                                                </th>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                                    Taille
                                                                </th>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                                    SKU
                                                                </th>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                                    Stock
                                                                </th>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                                    Statut
                                                                </th>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                                    Actions
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200">
                                                            {product.variants.map((variant) => (
                                                                <tr key={variant.id} className="hover:bg-gray-50">
                                                                    <td className="px-4 py-3">
                                                                        {variant.color && (
                                                                            <Badge className="text-xs">{variant.color}</Badge>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                                        {variant.size}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                                                                        {variant.sku}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                                                        {variant.stockQuantity}
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        <Badge
                                                                            variant={variant.isActive ? 'default' : 'secondary'}
                                                                            className="text-xs"
                                                                        >
                                                                            {variant.isActive ? 'Disponible' : 'Indisponible'}
                                                                        </Badge>
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        <div className="flex items-center gap-2">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => handleEditVariant(product, variant)}
                                                                            >
                                                                                <Edit className="w-4 h-4 text-gray-600" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => {
                                                                                    setSelectedVariant(variant);
                                                                                    setIsDeleteVariantDialogOpen(true);
                                                                                }}
                                                                            >
                                                                                <Trash2 className="w-4 h-4 text-red-600" />
                                                                            </Button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Dialogs */}
            <CreateProductDialog open={isCreateProductOpen} onOpenChange={setIsCreateProductOpen} />

            <EditProductDialog
                open={isEditProductOpen}
                onOpenChange={setIsEditProductOpen}
                product={selectedProduct}
            />

            {selectedProduct && (
                <CreateVariantDialog
                    open={isCreateVariantOpen}
                    onOpenChange={setIsCreateVariantOpen}
                    productId={selectedProduct.id}
                    productName={selectedProduct.name}
                />
            )}

            {selectedProduct && selectedVariant && (
                <EditVariantDialog
                    open={isEditVariantOpen}
                    onOpenChange={setIsEditVariantOpen}
                    variant={selectedVariant}
                    productName={selectedProduct.name}
                />
            )}

            {/* Delete Product Dialog */}
            <AlertDialog open={isDeleteProductDialogOpen} onOpenChange={setIsDeleteProductDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer le produit "{selectedProduct?.name}" et toutes ses
                            variantes ? Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleDeleteProduct}
                            disabled={deleteProduct.isPending}
                        >
                            {deleteProduct.isPending ? 'Suppression...' : 'Supprimer'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Variant Dialog */}
            <AlertDialog open={isDeleteVariantDialogOpen} onOpenChange={setIsDeleteVariantDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer la variante "{selectedVariant?.name}" ? Cette
                            action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleDeleteVariant}
                            disabled={deleteVariant.isPending}
                        >
                            {deleteVariant.isPending ? 'Suppression...' : 'Supprimer'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}