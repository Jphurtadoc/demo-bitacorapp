import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Surface } from '@/components/UI/surface';
import { ModalDrawer } from '@/components/UI/modal-drawer';
import { Plus, Pencil, Trash2, ChevronRight } from 'lucide-react';

type Priority = 'alta' | 'media' | 'baja';
type Status = 'pendiente' | 'en_progreso' | 'completado';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  assignee: string;
  status: Status;
}

const priorityConfig: Record<Priority, { label: string; className: string; dot: string }> = {
  alta: { label: 'Alta', className: 'bg-red-500/10 text-red-600 dark:text-red-300', dot: '#f43f5e' },
  media: { label: 'Media', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-300', dot: '#f97316' },
  baja: { label: 'Baja', className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300', dot: '#22c55e' },
};

const columns: { id: Status; label: string; color: string }[] = [
  { id: 'pendiente', label: 'Pendiente', color: '#94a3b8' },
  { id: 'en_progreso', label: 'En Progreso', color: '#5b67c7' },
  { id: 'completado', label: 'Completado', color: '#ff8f47' },
];

const initialTasks: Task[] = [
  { id: 1, title: 'Revisar bitácoras del turno', description: 'Verificar registros de operación del turno de la mañana.', priority: 'alta', assignee: 'Juan P.', status: 'pendiente' },
  { id: 2, title: 'Actualizar configuración de kits', description: 'Añadir nuevos kits al listado de operaciones.', priority: 'media', assignee: 'Maria G.', status: 'pendiente' },
  { id: 3, title: 'Generar reporte semanal', description: 'Compilar métricas de la semana y enviar a gerencia.', priority: 'alta', assignee: 'Carlos R.', status: 'en_progreso' },
  { id: 4, title: 'Supervisar ruta norte', description: 'Chequeo periódico de la flota en la ruta norte.', priority: 'baja', assignee: 'Ana L.', status: 'en_progreso' },
  { id: 5, title: 'Capacitación nuevo personal', description: 'Sesión introductoria al sistema Bitacorapp.', priority: 'media', assignee: 'Pedro M.', status: 'completado' },
];

const emptyForm: Omit<Task, 'id'> = {
  title: '', description: '', priority: 'media', assignee: '', status: 'pendiente',
};

const fieldClassName =
  'w-full rounded-lg border border-border bg-muted px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-subtle focus:border-border focus:bg-surface focus:ring-2 focus:ring-brand/10';

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState<Omit<Task, 'id'>>(emptyForm);
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const openCreate = () => {
    setEditingTask(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setForm({ title: task.title, description: task.description, priority: task.priority, assignee: task.assignee, status: task.status });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editingTask) {
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? { ...form, id: editingTask.id } : t)));
    } else {
      const newId = Math.max(0, ...tasks.map((t) => t.id)) + 1;
      setTasks((prev) => [...prev, { ...form, id: newId }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const moveTask = (id: number, newStatus: Status) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
  };

  const onDragStart = (id: number) => setDraggedId(id);
  const onDrop = (status: Status) => {
    if (draggedId !== null) {
      moveTask(draggedId, status);
      setDraggedId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-shell">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="page-header-title page-header-title-md mb-1.5">
              Tablero de Tareas
            </h1>
            <p className="page-header-subtitle text-sm">
              {tasks.length} tareas en total · {tasks.filter((t) => t.status === 'completado').length} completadas
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-[13.5px] font-semibold text-[#ffffff] transition-all hover:bg-brand-hover dark:bg-primary dark:hover:bg-primary-hover"
          >
            <Plus size={16} />
            Nueva Tarea
          </button>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-3">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return (
              <Surface
                key={col.id}
                padding="md"
                radius="xl"
                variant="muted"
                className="min-h-[200px]"
                style={{
                  backgroundColor: `color-mix(in srgb, ${col.color} 10%, var(--color-surface-muted))`,
                  borderColor: `color-mix(in srgb, ${col.color} 22%, var(--surface-border))`,
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(col.id)}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: col.color }} />
                    <span className="text-[13px] font-semibold text-foreground">{col.label}</span>
                  </div>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                    style={{
                      color: col.color,
                      backgroundColor: `color-mix(in srgb, ${col.color} 16%, transparent)`,
                    }}
                  >
                    {colTasks.length}
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {colTasks.map((task) => {
                    const pc = priorityConfig[task.priority];
                    return (
                      <Surface
                        key={task.id}
                        padding="md"
                        radius="lg"
                        interactive
                        className="cursor-grab"
                        draggable
                        onDragStart={() => onDragStart(task.id)}
                      >
                        <div className="mb-2.5 flex items-center justify-between">
                          <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold ${pc.className}`}>
                            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: pc.dot }} />
                            {pc.label}
                          </span>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => openEdit(task)}
                              className="rounded-md p-1 text-subtle transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(task.id)}
                              className="danger-action-btn flex cursor-pointer items-center rounded-md border-transparent bg-transparent p-1"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <p className="mb-1.5 text-sm font-semibold leading-snug text-foreground">{task.title}</p>
                        {task.description ? (
                          <p className="mb-3 text-[12.5px] leading-relaxed text-subtle">{task.description}</p>
                        ) : null}

                        <div className="flex items-center justify-between border-t border-border pt-2.5">
                          <div className="flex items-center gap-1.5">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/10 text-[10px] font-bold text-brand dark:bg-primary/15 dark:text-primary">
                              {task.assignee[0]}
                            </div>
                            <span className="text-xs text-subtle">{task.assignee}</span>
                          </div>
                          <div className="flex gap-0.5">
                            {col.id !== 'pendiente' && (
                              <button
                                type="button"
                                onClick={() => moveTask(task.id, col.id === 'completado' ? 'en_progreso' : 'pendiente')}
                                title="Mover atrás"
                                className="rounded p-0.5 text-subtle transition-colors hover:bg-muted hover:text-foreground"
                                style={{ transform: 'rotate(180deg)' }}
                              >
                                <ChevronRight size={14} />
                              </button>
                            )}
                            {col.id !== 'completado' && (
                              <button
                                type="button"
                                onClick={() => moveTask(task.id, col.id === 'pendiente' ? 'en_progreso' : 'completado')}
                                title="Mover adelante"
                                className="rounded p-0.5 text-subtle transition-colors hover:bg-muted hover:text-foreground"
                              >
                                <ChevronRight size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </Surface>
                    );
                  })}

                  {colTasks.length === 0 && (
                    <p className="px-5 py-8 text-center text-[13px] text-subtle">Sin tareas</p>
                  )}
                </div>
              </Surface>
            );
          })}
        </div>
      </div>

      <ModalDrawer
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
        size="md"
        footer={
          <div className="flex w-full gap-2.5">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-subtle transition-colors hover:bg-muted hover:text-foreground"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!form.title.trim()}
              className="flex-1 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-[#ffffff] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-subtle dark:bg-primary dark:hover:bg-primary-hover"
            >
              {editingTask ? 'Guardar Cambios' : 'Crear Tarea'}
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-subtle">Título *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Nombre de la tarea..."
              className={fieldClassName}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-subtle">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Descripción de la tarea..."
              rows={3}
              className={`${fieldClassName} resize-none leading-relaxed`}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-subtle">Prioridad</label>
              <select
                value={form.priority}
                onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as Priority }))}
                className={fieldClassName}
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-subtle">Asignado a</label>
              <input
                type="text"
                value={form.assignee}
                onChange={(e) => setForm((f) => ({ ...f, assignee: e.target.value }))}
                placeholder="Nombre..."
                className={fieldClassName}
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-subtle">Estado</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Status }))}
              className={fieldClassName}
            >
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En Progreso</option>
              <option value="completado">Completado</option>
            </select>
          </div>
        </div>
      </ModalDrawer>
    </DashboardLayout>
  );
};

export default TaskBoard;
