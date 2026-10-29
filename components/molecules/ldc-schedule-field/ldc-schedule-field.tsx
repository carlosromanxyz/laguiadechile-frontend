"use client";

import { LDCSwitch } from "@/components/atoms/ldc-switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SCHEDULE_DAYS,
  type IScheduleDayValue,
  type IScheduleValue,
  type LDCScheduleDayKey,
} from "@/lib/format/schedule";
import { cn } from "@/lib/utils";

type DayErrors = Partial<Record<"from" | "to", { message?: string }>>;

export interface LDCScheduleFieldProps {
  /** Horario por día */
  value: IScheduleValue;
  onChange: (value: IScheduleValue) => void;
  /** Errores por día (de React Hook Form: `errors.schedule`) */
  errors?: Partial<Record<LDCScheduleDayKey, DayErrors>>;
  disabled?: boolean;
  /** Id base de los controles */
  id: string;
}

/**
 * LDCScheduleField - Horario semanal editable
 *
 * Una fila por día: nombre, interruptor `LDCSwitch` con «Abierto/Cerrado» escrito al lado (el
 * color solo no basta) y, si abre, la hora de apertura y de cierre (`<input type="time">`). Un día
 * con un texto propio (p. ej. «24 horas») lo muestra tal cual hasta que se cambian las horas.
 * Incluye «Copiar el horario del lunes a todos los días». A menos de 480 px las horas bajan a
 * su propia línea.
 */
export function LDCScheduleField({ value, onChange, errors, disabled, id }: LDCScheduleFieldProps) {
  const setDay = (key: LDCScheduleDayKey, next: Partial<IScheduleDayValue>) =>
    onChange({ ...value, [key]: { ...value[key], ...next } });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {SCHEDULE_DAYS.map(([key, name]) => {
          const day = value[key];
          const err = errors?.[key];
          const message = err?.from?.message ?? err?.to?.message;
          const errorId = `${id}-${key}-error`;
          return (
            <div key={key} className="flex flex-col gap-1">
              <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 min-[480px]:grid-cols-[84px_100px_minmax(0,1fr)]">
                <span className="text-sm font-bold">{name}</span>
                <span className="flex items-center gap-2 text-[13px]">
                  <LDCSwitch
                    id={`${id}-${key}`}
                    checked={day.open}
                    onCheckedChange={(open) => setDay(key, { open })}
                    aria-label={`${name} abierto`}
                    disabled={disabled}
                  />
                  {day.open ? "Abierto" : "Cerrado"}
                </span>
                <span className="col-span-2 flex min-w-0 items-center gap-1.5 min-[480px]:col-span-1">
                  {!day.open ? (
                    <span className="text-sm text-muted-foreground">Cerrado</span>
                  ) : day.label ? (
                    <>
                      <span className="text-sm">{day.label}</span>
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="h-auto px-1"
                        onClick={() => setDay(key, { label: undefined })}
                        disabled={disabled}
                      >
                        Cambiar horas
                      </Button>
                    </>
                  ) : (
                    <>
                      <Input
                        type="time"
                        value={day.from}
                        onChange={(e) => setDay(key, { from: e.target.value })}
                        aria-label={`${name}, abre`}
                        aria-invalid={!!err?.from || undefined}
                        aria-describedby={message ? errorId : undefined}
                        disabled={disabled}
                        className="h-9 min-w-0 flex-1 px-2"
                      />
                      <span className="text-sm text-muted-foreground">a</span>
                      <Input
                        type="time"
                        value={day.to}
                        onChange={(e) => setDay(key, { to: e.target.value })}
                        aria-label={`${name}, cierra`}
                        aria-invalid={!!err?.to || undefined}
                        aria-describedby={message ? errorId : undefined}
                        disabled={disabled}
                        className="h-9 min-w-0 flex-1 px-2"
                      />
                    </>
                  )}
                </span>
              </div>
              {message && (
                <p id={errorId} role="alert" className={cn("m-0 text-sm text-destructive min-[480px]:pl-[208px]")}>
                  {name}: {message.charAt(0).toLowerCase() + message.slice(1)}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() =>
            onChange(
              Object.fromEntries(SCHEDULE_DAYS.map(([key]) => [key, { ...value.monday }])) as IScheduleValue,
            )
          }
        >
          Copiar el horario del lunes a todos los días
        </Button>
      </div>
    </div>
  );
}
