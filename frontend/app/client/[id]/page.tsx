"use client"

import { useParams } from "next/navigation";

export default function Home() {
    const params = useParams();
    const id = params.id;

    return (
        <p>id {id}</p>
    )
}