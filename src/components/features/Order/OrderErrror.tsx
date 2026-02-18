import { AlertCircle, RefreshCw, Wifi, Server } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface OrdersErrorProps {
    error: Error | any;
    onRetry?: () => void;
}

export function OrdersError({ error, onRetry }: OrdersErrorProps) {
    // Déterminer le type d'erreur
    const isNetworkError = error?.message?.includes('network') ||
        error?.message?.includes('fetch') ||
        !navigator.onLine;

    const isServerError = error?.status >= 500;
    const isAuthError = error?.status === 401 || error?.status === 403;

    // Configuration selon le type d'erreur
    const errorConfig = {
        network: {
            icon: Wifi,
            title: "Problème de connexion",
            description: "Impossible de se connecter au serveur. Vérifiez votre connexion internet.",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-200"
        },
        server: {
            icon: Server,
            title: "Erreur",
            description: "Veuillez réessayer dans quelques instants.",
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200"
        },
        auth: {
            icon: AlertCircle,
            title: "Accès refusé",
            description: "Vous n'avez pas les permissions nécessaires pour accéder à ces données.",
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200"
        },
        default: {
            icon: AlertCircle,
            title: "Une erreur est survenue",
            description: error?.message || "Impossible de charger les commandes.",
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200"
        }
    };

    const config = isNetworkError
        ? errorConfig.network
        : isServerError
            ? errorConfig.server
            : isAuthError
                ? errorConfig.auth
                : errorConfig.default;

    const Icon = config.icon;

    return (
        <div className="space-y-4">
            {/* Version mobile (Card) */}
            <Card className={`lg:hidden border-2 ${config.borderColor}`}>
                <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className={`p-3 rounded-full ${config.bgColor}`}>
                            <Icon className={`h-8 w-8 ${config.color}`} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg text-gray-900">
                                {config.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {config.description}
                            </p>
                        </div>
                        {onRetry && (
                            <Button
                                onClick={onRetry}
                                className="w-full gap-2 bg-gray-900 hover:bg-gray-800"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Réessayer
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Version desktop (Alert) */}
            <Alert className={`hidden lg:flex ${config.borderColor} ${config.bgColor}`}>
                <Icon className={`h-5 w-5 ${config.color}`} />
                <div className="flex-1">
                    <AlertTitle className="text-gray-900 font-semibold">
                        {config.title}
                    </AlertTitle>
                    <AlertDescription className="text-gray-600 mt-1">
                        {config.description}
                    </AlertDescription>
                </div>
                {onRetry && (
                    <Button
                        onClick={onRetry}
                        variant="outline"
                        size="sm"
                        className="gap-2 ml-4"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Réessayer
                    </Button>
                )}
            </Alert>

            {/* Message d'aide supplémentaire */}
            {isNetworkError && (
                <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm text-blue-700">
                        <strong>Conseils :</strong> Vérifiez que vous êtes connecté à internet,
                        rafraîchissez la page ou contactez le support si le problème persiste.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}