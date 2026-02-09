import * as yup from "yup";

export const loginSchema = yup.object({
    email: yup.string().email("Invalid email").required("Obligatoire"),
    password: yup.string().min(6, "Trop court").required("Obligatoire"),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
