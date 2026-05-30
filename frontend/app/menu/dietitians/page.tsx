'use client'

import styles from './page.module.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TURBO_TRACE_DEFAULT_MEMORY_LIMIT } from 'next/dist/shared/lib/constants'

type Client = {
    id: number;
    name: string;
    birthday: Date;
    gender: string;
}

export default function Home() {
    const [activeTab, setActiveTab] = useState<string>("clientes");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [errorClientes, setErrorClientes] = useState<string | null>(null);

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

    const getClientes = async () => {
        setErrorClientes(null)
        try {
            const response = await fetch("http://localhost:8000/clients/", {
                method: "GET",
                credentials: "include",
            })

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail ?? "Erro ao consultar clientes.")
            }

            setClients(data)
        } catch (err) {
            if (err instanceof Error) setErrorClientes(err.message)
        }
    }

    useEffect(() => {
        if (activeTab === "clientes") {
            getClientes()
        }
    }, [activeTab])

    const getUserAge = (birth: Date) => {
        const birthday = new Date(birth)
        const today = new Date()

        let years = today.getFullYear() - birthday.getFullYear();
        let months = today.getMonth() - birthday.getMonth();
        let days = today.getDate() - birthday.getDate();

        if (days < 0) {
            months -= 1;

            const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += previousMonth.getDate();
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        return `${birthday.toLocaleDateString("pt-BR")}: ${years} Anos, ${months} Meses e ${days} Dias.`;
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
                    <div className={styles.clientPage}>
                        <div className={styles.clientHeader}>
                            <button className={styles.newClientButton} onClick={() => {router.push('/client/new')}}>Novo Cliente</button>
                        </div>

                        <div className={styles.clientsList}>
                            {clients.length === 0? (
                                <p>Nenhum cliente encontrado.</p>
                            ) : (
                                clients.map((client) => (
                                    <div key={client.id} className={styles.clientCard}>
                                        <img src="/icons/user_pfp.png" className={styles.userIcon}/>
                                        <div>
                                            <p>{client.name}</p>
                                            <p>{client.gender === "female"? "Feminino" : "Masculino"}</p>
                                            <p>{getUserAge(client.birthday)}</p>
                                        </div>
                                        <button className={styles.editClientButton} onClick={() => {router.push("/client/"+client.id)}}>
                                            <img src="/icons/edit.png"/>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
                
                {activeTab === "placeholder" && (
                    <p>em desenvolvimento</p>
                )}
            </section>
        </main>
    )
}