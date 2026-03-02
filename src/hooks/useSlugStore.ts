import { useParams } from "react-router-dom";

export function useStoreSlug() {
    const { storeSlug } = useParams<{ storeSlug: string }>();
    return storeSlug;
}