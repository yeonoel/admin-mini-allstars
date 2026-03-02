import { toast } from 'sonner';

export function handleApiError(error: any, fallback = 'Une erreur est survenue') {
    const message = error?.response?.data?.message ?? fallback;
    toast.error(message);
}

export function handleApiSuccess(message: string) {
    toast.success(message);
}

