import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProductSearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function ProductSearch({ value, onChange, placeholder = 'Rechercher un produit...' }: ProductSearchProps) {
    return (
        <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="pl-10 pr-10"
            />
            {value && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => onChange('')}
                >
                    <X className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}