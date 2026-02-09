import { ArrowLeftToLine, ChartColumn, LogOut, PanelsTopLeft, ShoppingBasket, ShoppingCart, SlidersHorizontal, Star, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

interface MobileSidebarProps {
    open: boolean;
    onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
    if (!open) return null;
    const { logout } = useAuth();
    const handleLogout = () => {
        logout();
    }
    const linkClass =
        "flex items-center gap-2 p-2 rounded-lg text-sm hover:bg-gray-100 focus:bg-gray-900 focus:text-white";

    return (
        <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Overlay sombre */}
            <div
                className="fixed inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Menu qui glisse */}
            <aside className="flex flex-col relative w-64 bg-white h-full p-4 shadow-lg">
                <div className="flex items-center justify-between mb-4 border-b border-border pb-6">
                    <h1 className=" font-bold flex items-center gap-2">
                        <span className="w-7 h-7 bg-black text-white flex items-center justify-center rounded-full">
                            <Star size={15} />
                        </span>
                        Admin Panel
                    </h1>
                    <span onClick={onClose}><ArrowLeftToLine size={16} strokeWidth={1.75} /></span>
                </div>
                <nav className="space-y-2">
                    <NavLink to="/" className={linkClass} onClick={onClose}>
                        <PanelsTopLeft className="w-3.5 h-3.5" />
                        <span>Tableau de bord </span>
                    </NavLink>

                    <NavLink to="/commandes" className={linkClass} onClick={onClose}>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Commandes</span>
                    </NavLink>

                    <NavLink to="/produits" className={linkClass} onClick={onClose}>
                        <ShoppingBasket className="w-3.5 h-3.5" />
                        <span>Produits</span>
                    </NavLink>
                </nav>
                <div className="border-t border-border p-2 mt-auto">
                    <button onClick={handleLogout} className="flex items-center gap-2 p-1.5 rounded-lg text-xs hover:bg-gray-100 focus:bg-gray-900 focus:text-primary-foreground ">
                        <LogOut className="w-5 h-5" />
                        <span>Quitter dashboard</span>
                    </button>
                </div>
            </aside>
        </div>
    );
}
