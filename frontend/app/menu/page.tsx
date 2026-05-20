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

    return (
        <main>
            <p>placeholder</p>
            <button onClick={handleLogout}>Sair</button>
            {error && <p>{error}</p>}
        </main>
    )
}