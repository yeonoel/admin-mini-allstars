import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../../components/common/Input/Input";
import { Button } from "../../components/common/Button/Button";
import { Lock, Mail, Star } from "lucide-react";
import { loginSchema, type LoginFormData } from "./login.schema";

export default function Login() {
    const { login, loading, error } = useAuth();

    const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
        mode: "onChange"
    });

    const onSubmit = async (data: LoginFormData) => {
        await login(data.email, data.password);
    };

    return (
        <div className="min-h-screen bg-gradient-cinematic flex items-center justify-center">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
                <div className="flex flex-col items-center justify-center space-y-5">
                    <span className="w-14 h-14 bg-black text-white flex items-center justify-center  rounded-full">
                        <Star size={15} />
                    </span>
                    <h1 className="text-2xl font-bold mb-6 text-center ">Panneau admin</h1>
                    <p className="text-sm text-gray-500 text-center ">Connectez-vous pour accéder au dashboard</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="admin@allstart.com"
                        icon={<Mail className="w-4 h-4" />}
                        {...register("email")}
                        error={errors.email?.message}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="*******"
                        icon={<Lock className="w-4 h-4" />}
                        {...register("password")}
                        error={errors.password?.message}
                    />

                    {error && (
                        <p className="text-sm text-red-500 text-center">{error}</p>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        loading={loading}
                        disabled={!isValid || isSubmitting}>
                        Se connecter
                    </Button>
                    <p className="cursor-pointer text-sm text-gray-500 text-center curso"><small>Besoin d'aide ? Contactez le support</small></p>
                </form>
            </div>
        </div>
    );
}
