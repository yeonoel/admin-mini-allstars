import { Outlet } from "react-router-dom";
import { Header } from "../Header/Header";
import { MobileSidebar } from "../MobileSidebar/MobileSidebar";
import { Sidebar } from "../Sidebar/Sidebar";
import { useState } from "react";

export function MainLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0">
                <Header onMenuClick={() => setMobileOpen(true)} />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}