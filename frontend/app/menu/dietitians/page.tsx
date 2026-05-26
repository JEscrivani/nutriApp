'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8000/auth/logout", {
                method: "DELETE",
                credentials: "include",
            })

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail ?? "Erro ao validar usuário.")
            }

            router.push('/login')
        } catch (err) {
            if (err instanceof Error) setError(err.message);
        }
    }

    const handleNewClient = async () => {
        router.push('/client/new')
    }

    return (
        <main>
            <p>PAGINA NUTRICIONISTA</p>
            <button onClick={handleLogout}>Sair</button>
            <button onClick={handleNewClient}>Cadastrar novo cliente</button>
            {error && <p>{error}</p>}
        </main>
    )
}