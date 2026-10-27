import type { ReactNode } from "react";
import { LDCTaskItem } from "@/components/molecules/ldc-task-item";
import type { IDashboardTask } from "@/interfaces/dashboard";

export interface LDCTaskListProps {
  /** Tareas o avisos; sin elementos no se pinta nada */
  tasks: (IDashboardTask & { actionIcon?: ReactNode })[];
}

/**
 * LDCTaskList - Avisos y tareas al inicio del panel
 *
 * Pila de `LDCTaskItem` («Para hoy», avisos vencidos) bajo el encabezado de la página.
 *
 * @example
 * <LDCTaskList tasks={await getMyTasks()} />
 */
export function LDCTaskList({ tasks }: LDCTaskListProps) {
  if (tasks.length === 0) return null;
  return (
    <div className="space-y-3">
      {tasks.map(({ id, ...task }) => (
        <LDCTaskItem key={id} {...task} />
      ))}
    </div>
  );
}
