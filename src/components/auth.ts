import api from "@/api/axios"

export const Auth = async (email: string, password: string) => {
    return (
        await api.post("/api/auth/login/", { email, password })
    ).data
}
    