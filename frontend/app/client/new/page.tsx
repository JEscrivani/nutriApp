'use client';

import styles from './page.module.css'
import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [name, setName] = useState<string>("");
    const [cpf, setCpf] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [birthday, setBirthday] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    
    function handleCpfChange(event: ChangeEvent<HTMLInputElement>) {
        const numericCpf = event.target.value.replace(/\D/g, "");
        setCpf(numericCpf);
    }

    async function handleSubmit() {
        setError(null);
        setIsLoading(true);
        
        if (!name) {
            setError("Nome inválido.");
            setIsLoading(false);
            return;
        }
        
        if (cpf.length != 11) {
            setError("CPF deve conter 11 dígitos.");
            setIsLoading(false);
            return;
        }

        if (!email) {
            setError("E-Mail inválido.");
            setIsLoading(false);
            return;
        }
        
        if (!birthday) {
            setError("Data de nascimento não informada");
            setIsLoading(false);
            return;
        }
        const date = new Date(birthday);
        if (Number.isNaN(date.getTime())) {
            setError("Data de nascimento inválida.");
            setIsLoading(false);
            return;
        }
        
        if (!gender) {
            setError("Gênero inválido.");
            setIsLoading(false);
            return;
        }

        try {
            const body = {
                name,
                cpf,
                email,
                password: cpf,
                role: 'cliente',
                birthday,
                gender
            }
            const response = await fetch("http://localhost:8000/auth/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                const message = Array.isArray(data.detail) ? data.detail.map((error: {msg: string}) => error.msg).join(", ") : data.detail ?? "Erro desconhecido ao cadastrar cliente";
                throw new Error(message)
            }

            router.push('/menu/dietitians')
        } catch(err) {
            if (err instanceof Error) setError(err.message);
            setIsLoading(false)
        }
    }

    return (
        <main className={styles.newClientPage}>
            <section className={styles.newClientCard}>
                <h1 className={styles.newClientTitle}>Novo Cliente</h1>

                <form className={styles.newClientForm} onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>
                    <label className={styles.newClientLabel}>
                        Nome
                        <input className={styles.newClientInput} value={name} onChange={(event => {setName(event.target.value)})}/>
                    </label>
                    <label className={styles.newClientLabel}>
                        CPF
                        <input className={styles.newClientInput} type='text' inputMode='numeric' maxLength={11} value={cpf} onChange={handleCpfChange}/>
                    </label>
                    <label className={styles.newClientLabel}>
                        E-Mail
                        <input className={styles.newClientInput} value={email} onChange={(event => {setEmail(event.target.value)})}/>
                    </label>
                    <label className={styles.newClientLabel}>
                        Data Nascimento
                        <input className={styles.newClientInput} type='date' value={birthday} onChange={(event => {setBirthday(event.target.value)})}/>
                    </label>
                    <fieldset>
                        <legend>Gênero</legend>
                        <div className={styles.newClientRadio}>
                            <label className={styles.newClientRadioLabel}>
                                <input type='radio' name='gender' value='male' checked={gender === "male"} onChange={(event) => {setGender(event.target.value)}}/>
                                Masculino
                            </label>
                            <label className={styles.newClientRadioLabel}>
                                <input type='radio' name='gender' value='female' checked={gender === "female"} onChange={(event) => {setGender(event.target.value)}}/>
                                Feminino
                            </label>
                        </div>
                    </fieldset>

                    {error && <p className={styles.loginError}>{error}</p>}

                    <div className={styles.divButtons}>
                        <button type='button' className={styles.newClientButton} onClick={() => {router.push("/menu")}}>
                            Cancelar
                        </button>

                        <button type='submit' className={styles.newClientButton}>
                            {isLoading? 'Cadastrando...' : 'Cadastrar'}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    )
}