'use client';

import styles from "./page.module.css"
import { useState } from "react"
import { useRouter } from "next/navigation";

export default function Home() {
  const [cpf, setCpf] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", cpf);
      formData.append("password", password);

      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
        credentials: "include",
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail ?? "Erro ao validar usuário.")
      }

      router.push('/menu')
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard}>
        <h1 className={styles.loginTitle}>Login</h1>

        <form className={styles.loginForm} onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>
          <label className={styles.loginLabel}>
            CPF
            <input className={styles.loginInput} type="text" placeholder="Digite seu CPF" maxLength={11} value={cpf} onChange={(event) => setCpf(event.target.value)}/>
          </label>

          <label className={styles.loginLabel}>
            Senha
            <input className={styles.loginInput} type="password" placeholder="Digite sua senha" value={password} onChange={(event) => setPassword(event.target.value)}/>
          </label>

          {error && <p className={styles.loginError}>{error}</p>}

          <button className={styles.loginButton} type="submit">
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  );
}
