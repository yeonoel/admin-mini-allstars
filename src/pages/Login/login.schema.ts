import * as yup from "yup";

export const loginSchema = yup.object({
    numero: yup.string().matches(/^[0-9+]+$/, "Numéro invalide").min(10, "Numéro trop court").required("Obligatoire"),
    password: yup.string().min(6, "Trop court").required("Obligatoire"),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
