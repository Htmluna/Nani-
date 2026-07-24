import Link from "next/link";
import SettingsForm from "@/components/SettingsForm";
import { requireProfile } from "@/lib/auth";

export default async function ConfigPage() {
  // Garante que o usuário está logado (o provider já foi semeado no layout).
  await requireProfile();

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="text-2xl font-bold">Configurações</h1>
      <p className="mt-1 text-[var(--muted)]">
        Ajuste como as leituras aparecem no app. As mudanças valem na hora e
        ficam salvas na sua conta.
      </p>

      <div className="mt-6">
        <SettingsForm />
      </div>

      <div className="mt-6 text-sm text-[var(--muted)]">
        Quer controlar quais famílias de letras já foram ensinadas?{" "}
        <Link href="/praticar" className="text-[var(--primary)] hover:underline">
          Vá para Praticar
        </Link>
        .
      </div>
    </div>
  );
}
