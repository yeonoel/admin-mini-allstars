import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
    const constext = useContext(AuthContext);
    if (!constext) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return constext;
}