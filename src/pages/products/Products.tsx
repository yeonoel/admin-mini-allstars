import { useState } from "react";
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Product {
    id: string;
    name: string;
    images: { id: string; url: string }[];
    shortDescription: string;
    price: number;
    stockQuantity: number;
    category?: { name: string };
    variants: ProductVariant[];
}

interface ProductVariant {
    id: string;
    name: string;
    sku: string;
    color?: string;
    size?: string;
    stockQuantity: number;
    isActive: boolean;
}

export function Products() {
    const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [isAddVariantOpen, setIsAddVariantOpen] = useState(false);
    const [isEditVariantOpen, setIsEditVariantOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

    // Mock data
    const products: Product[] = [
        {
            id: "1",
            name: "Classic High Top",
            images: [{ id: "1", url: "/api/placeholder/80/80" }],
            shortDescription: "Baskets montantes classiques et confortables",
            price: 75000,
            stockQuantity: 90,
            category: { name: "High Tops" },
            variants: [
                { id: "v1", name: "Black - Size 9", sku: "CLA-BLA-9", color: "Black", size: "Size 9", stockQuantity: 25, isActive: true },
                { id: "v2", name: "Black - Size 10", sku: "CLA-BLA-10", color: "Black", size: "Size 10", stockQuantity: 30, isActive: true },
                { id: "v3", name: "White - Size 9", sku: "CLA-WHI-9", color: "White", size: "Size 9", stockQuantity: 20, isActive: true },
                { id: "v4", name: "Red - Size 9", sku: "CLA-RED-9", color: "Red", size: "Size 9", stockQuantity: 15, isActive: true },
            ]
        },
        {
            id: "2",
            name: "Low Top Classic",
            images: [{ id: "2", url: "/api/placeholder/80/80" }],
            shortDescription: "Baskets basses pour un style décontracté",
            price: 65000,
            stockQuantity: 75,
            category: { name: "Low Tops" },
            variants: [
                { id: "v5", name: "White - Size 10", sku: "LOW-WHI-10", color: "White", size: "Size 10", stockQuantity: 40, isActive: true },
                { id: "v6", name: "Blue - Size 9", sku: "LOW-BLU-9", color: "Blue", size: "Size 9", stockQuantity: 35, isActive: true },
            ]
        },
        {
            id: "3",
            name: "Platform High Top",
            images: [{ id: "3", url: "/api/placeholder/80/80" }],
            shortDescription: "Baskets à plateforme tendance",
            price: 95000,
            stockQuantity: 0,
            category: { name: "Platform" },
            variants: []
        },
    ];

    const toggleProduct = (productId: string) => {
        const newExpanded = new Set(expandedProducts);
        if (newExpanded.has(productId)) {
            newExpanded.delete(productId);
        } else {
            newExpanded.add(productId);
        }
        setExpandedProducts(newExpanded);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'decimal',
            minimumFractionDigits: 0
        }).format(amount) + ' FCFA';
    };

    const AddProductDialog = () => {
        const [images, setImages] = useState<string[]>([]);

        return (
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Ajouter un produit</DialogTitle>
                    <p className="text-sm text-gray-500">Étape 1/2 : Informations de base du produit</p>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nom du produit *</Label>
                        <Input id="name" placeholder="Ex: Classic High Top" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="category">Catégorie *</Label>
                            <Input id="category" placeholder="High Tops" />
                        </div>
                        <div>
                            <Label htmlFor="price">Prix (FCFA) *</Label>
                            <Input id="price" type="number" placeholder="0" />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="images">Image du produit * (3 photos max)</Label>
                        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <div className="space-y-2">
                                <div className="flex justify-center">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-600">Upload de fichier simulé</p>
                                <Input
                                    type="text"
                                    placeholder="https://example.com/image.jpg"
                                    className="max-w-md mx-auto"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">Description (max 150 caractères)</Label>
                        <Textarea
                            id="description"
                            placeholder="Description du produit..."
                            maxLength={150}
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                            Annuler
                        </Button>
                        <Button className="bg-black text-white hover:bg-gray-800">
                            Créer et ajouter variantes
                        </Button>
                    </div>
                </div>
            </DialogContent>
        );
    };

    const AddVariantDialog = () => (
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Ajouter une variante</DialogTitle>
                <p className="text-sm text-gray-500">Pour le produit : {selectedProduct || "Classic High Top"}</p>
            </DialogHeader>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="color">Couleur *</Label>
                        <Input id="color" placeholder="Ex: Black, White..." />
                    </div>
                    <div>
                        <Label htmlFor="size">Taille *</Label>
                        <Input id="size" placeholder="Ex: 9, 10..." />
                    </div>
                </div>

                <div>
                    <Label htmlFor="stock">Stock disponible *</Label>
                    <Input id="stock" type="number" placeholder="0" />
                </div>

                <div>
                    <Label htmlFor="sku">SKU (optionnel)</Label>
                    <Input id="sku" placeholder="Auto-généré si vide" disabled />
                    <p className="text-xs text-gray-500 mt-1">Généré automatiquement si laissé vide</p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setIsAddVariantOpen(false)}>
                        Annuler
                    </Button>
                    <Button className="bg-black text-white hover:bg-gray-800">
                        Ajouter
                    </Button>
                </div>
            </div>
        </DialogContent>
    );

    const EditVariantDialog = () => (
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Modifier la variante</DialogTitle>
                <p className="text-sm text-gray-500">Pour le produit : Classic High Top</p>
            </DialogHeader>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="edit-color">Couleur *</Label>
                        <Input id="edit-color" defaultValue="Black" />
                    </div>
                    <div>
                        <Label htmlFor="edit-size">Taille *</Label>
                        <Input id="edit-size" defaultValue="9" />
                    </div>
                </div>

                <div>
                    <Label htmlFor="edit-stock">Stock disponible *</Label>
                    <Input id="edit-stock" type="number" defaultValue="25" />
                </div>

                <div>
                    <Label htmlFor="edit-sku">SKU (optionnel)</Label>
                    <Input id="edit-sku" defaultValue="CLA-BLA-9" />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setIsEditVariantOpen(false)}>
                        Annuler
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Dupliquer
                    </Button>
                    <Button className="bg-black text-white hover:bg-gray-800">
                        Enregistrer
                    </Button>
                </div>
            </div>
        </DialogContent>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{products.length} produit(s) · 1 en rupture</p>
                </div>
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-black text-white hover:bg-gray-800 gap-2">
                            <Plus className="w-4 h-4" />
                            Ajouter un produit
                        </Button>
                    </DialogTrigger>
                    <AddProductDialog />
                </Dialog>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="w-12 px-6 py-3"></th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Produit
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Catégorie
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
                        {products.map((product) => (
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
                                                src={product.images[0]?.url}
                                                alt={product.name}
                                                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                            />
                                            <span className="font-medium text-gray-900">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {product.category?.name || "Aucune"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-semibold text-gray-900">{formatCurrency(product.price)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`font-semibold ${product.stockQuantity === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                            {product.stockQuantity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            {product.variants.length} variante(s)
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Dialog open={isAddVariantOpen} onOpenChange={setIsAddVariantOpen}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-2"
                                                        onClick={() => setSelectedProduct(product.name)}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Variante
                                                    </Button>
                                                </DialogTrigger>
                                                <AddVariantDialog />
                                            </Dialog>
                                            <Button variant="ghost" size="sm">
                                                <Edit className="w-4 h-4 text-gray-600" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setIsDeleteDialogOpen(true)}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>

                                {/* Variants rows */}
                                {expandedProducts.has(product.id) && product.variants.length > 0 && (
                                    <tr>
                                        <td colSpan={7} className="bg-gray-50 px-6 py-4">
                                            <div className="space-y-3">
                                                <h4 className="font-medium text-gray-900">Variantes de {product.name}</h4>
                                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                                    <table className="w-full">
                                                        <thead className="bg-gray-50 border-b border-gray-200">
                                                            <tr>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Couleur</th>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Taille</th>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200">
                                                            {product.variants.map((variant) => (
                                                                <tr key={variant.id} className="hover:bg-gray-50">
                                                                    <td className="px-4 py-3">
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                            {variant.color}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm text-gray-900">{variant.size}</td>
                                                                    <td className="px-4 py-3 text-sm text-gray-500 font-mono">{variant.sku}</td>
                                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{variant.stockQuantity}</td>
                                                                    <td className="px-4 py-3">
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                            Disponible
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        <div className="flex items-center gap-2">
                                                                            <Dialog open={isEditVariantOpen} onOpenChange={setIsEditVariantOpen}>
                                                                                <DialogTrigger asChild>
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        onClick={() => setSelectedVariant(variant)}
                                                                                    >
                                                                                        <Edit className="w-4 h-4 text-gray-600" />
                                                                                    </Button>
                                                                                </DialogTrigger>
                                                                                <EditVariantDialog />
                                                                            </Dialog>
                                                                            <Button variant="ghost" size="sm">
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

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer ce produit et toutes ses variantes ?
                            Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}