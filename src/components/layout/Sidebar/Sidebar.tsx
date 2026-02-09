import { ChartColumn, LogOut, PanelsTopLeft, ShoppingBasket, ShoppingCart, SlidersHorizontal, Star, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

export function Sidebar() {
    const { logout } = useAuth();
    const handleLogout = () => {
        logout();
    }
    const linkClass =
        "flex items-center gap-2 p-2 rounded-lg text-sm hover:bg-gray-100 focus:bg-gray-900 focus:text-white";

    return (
        <aside className="hidden md:flex md:flex-col md:w-60 bg-primary-foreground border-r border-border h-full p-4">
            <div className="mb-4 border-b border-border pb-6">
                <h1 className=" font-bold flex items-center gap-2">
                    <span className="w-7 h-7 bg-black text-white flex items-center justify-center rounded-full">
                        <Star size={15} />
                    </span>
                    Admin Panel
                </h1>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
                <NavLink to="/" className={linkClass}>
                    <PanelsTopLeft className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/commandes" className={linkClass}>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Commandes</span>
                </NavLink>

                <NavLink to="/produits" className={linkClass}>
                    <ShoppingBasket className="w-3.5 h-3.5" />
                    <span>Produits</span>
                </NavLink>

                <NavLink to="/clients" className={linkClass}>
                    <Users className="w-3.5 h-3.5" />
                    <span>Clients</span>
                </NavLink>

                <NavLink to="/analytics" className={linkClass}>
                    <ChartColumn className="w-3.5 h-3.5" />
                    <span>Analytics</span>
                </NavLink>

                <NavLink to="/parametres" className={linkClass}>
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Parametres</span>
                </NavLink>
            </nav>
            <div className="border-t border-border p-2 mt-auto">
                <button onClick={handleLogout} className=" flex items-center gap-2 p-1.5 rounded-lg text-xs hover:bg-gray-100 focus:bg-gray-900 focus:text-primary-foreground ">
                    <LogOut className="w-5 h-5" />
                    <span> Quitter dashboard</span>
                </button>
            </div>
        </aside>
    );
}

