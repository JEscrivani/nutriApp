'use client'

import styles from './page.module.css'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
    const [activeTab, setActiveTab] = useState<string>("clientes")
    const [error, setError] = useState<string | null>(null)
    const router = useRouter();

    const handleLogout = async () => {
        setError(null)
        try {
            const response = await fetch("http://localhost:8000/auth/logout", {
                method: "DELETE",
                credentials: "include"
            })

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail ?? "Erro ao encerrar sessão.");
            }

            router.push("/login");
        } catch (err) {
            if (err instanceof Error) setError(err.message);
        }
    }

    return (
        <main className={styles.page}>
            <aside className={styles.sidebar}>
                <div className={styles.personalInfo}>
                    <img src="/icons/user_pfp.png" className={styles.userIcon}/>
                    <div>
                        <h1>Nome Usuario</h1>
                        <p>role</p>
                    </div>
                </div>

                <nav className={styles.navigator}>
                    <button className={activeTab === "clientes"? styles.activeTab : styles.tab} onClick={() => setActiveTab("clientes")}>
                        Clientes
                    </button>
                    
                    <button className={activeTab === "placeholder"? styles.activeTab : styles.tab} onClick={() => setActiveTab("placeholder")}>
                        Placeholder
                    </button>
                </nav>

                <button className={styles.logout} onClick={handleLogout}>
                    Sair
                    <img src="/icons/logout.png" className={styles.logoutIcon}/>
                </button>
                {error && <p>{error}</p>}
            </aside>

            <section>
                {activeTab === "clientes" && (
                    <p>seção clientes</p>
                )}
                
                {activeTab === "placeholder" && (
                    <p>em desenvolvimento</p>
                )}
            </section>
        </main>
    )
}