"use client";

import { HeartOff, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { IDashboardActionResult, IDashboardFavoriteKind } from "@/interfaces/dashboard";

export interface LDCFavoriteRemoveButtonProps {
  kindKey: IDashboardFavoriteKind;
  targetId: string;
  /** Título del favorito, para el nombre accesible y el toast */
  title: string;
  /** Server action que lo quita */
  onRemove: (kind: IDashboardFavoriteKind, targetId: string) => Promise<IDashboardActionResult>;
}

/**
 * LDCFavoriteRemoveButton - Botón de ícono para quitar un favorito
 *
 * Llama a la server action y avisa con un toast; la lista se refresca desde la acción.
 *
 * @example
 * <LDCFavoriteRemoveButton kindKey="LISTING" targetId={id} title="DJ Eventos" onRemove={removeFavoriteAction} />
 */
export function LDCFavoriteRemoveButton({
  kindKey,
  targetId,
  title,
  onRemove,
}: LDCFavoriteRemoveButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await onRemove(kindKey, targetId);
      if (result.ok) toast.success(`Quitaste «${title}» de tus favoritos`);
      else toast.error(result.message);
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={pending}
      aria-label={`Quitar «${title}» de favoritos`}
      title="Quitar de favoritos"
      className="shrink-0"
    >
      {pending ? <Loader2 className="animate-spin" /> : <HeartOff />}
    </Button>
  );
}
