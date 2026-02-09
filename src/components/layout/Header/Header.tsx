import { ChartNoAxesGantt, } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useLocation } from "react-router-dom";

interface HeaderProps {
    onMenuClick: () => void
}

const pageTitles: Record<string, string> = {
    "/": "Dashboard",
    "/commandes": "Orders",
    "/produits": "Products"
};

export function Header({ onMenuClick }: HeaderProps) {
    const { user } = useAuth();
    const firstletterFistName = user?.firstName.charAt(0).toUpperCase();
    const firstletterLastName = user?.lastName.charAt(0).toUpperCase();
    const firstName = user?.firstName || "Admin";
    const lastName = user?.lastName || "User";
    const email = user?.email || "adminemail@com";
    const location = useLocation();

    const title = pageTitles[location.pathname] || "overview";

    return (
        <>
            <div className="flex justify-between items-center p-4 bg-white border-b border-border">
                {/* LEFT */}
                <div className="flex items-center gap-3">
                    <ChartNoAxesGantt className="w-6 h-6 lg:hidden" onClick={onMenuClick} />
                    <span className="text-lg font-semibold">{title}</span>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4 ">
                    <div className="text-right cursor-pointer">
                        <p className="text-sm font-medium">{firstName} {lastName}</p>
                        <p className="text-xs text-gray-500">{email}</p>
                    </div>

                    <div className="cursor-pointer w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                        {firstletterFistName}
                        {firstletterLastName}
                    </div>
                </div>
            </div>
        </>
    );
}