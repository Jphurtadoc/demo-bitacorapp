import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Plus, X, Pencil, Trash2, ChevronRight } from 'lucide-react';

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

const priorityConfig: Record<Priority, { label: string; bg: string; text: string; dot: string }> = {
  alta:   { label: 'Alta',   bg: '#fff1f2', text: '#e11d48', dot: '#f43f5e' },
  media:  { label: 'Media',  bg: '#fff7ed', text: '#ea580c', dot: '#f97316' },
  baja:   { label: 'Baja',   bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e' },
};

const columns: { id: Status; label: string; color: string; bg: string }[] = [
  { id: 'pendiente',   label: 'Pendiente',    color: '#94a3b8', bg: '#f8fafc' },
  { id: 'en_progreso', label: 'En Progreso',  color: '#2563eb', bg: '#eff6ff' },
  { id: 'completado',  label: 'Completado',   color: '#16a34a', bg: '#f0fdf4' },
];

const initialTasks: Task[] = [
  { id: 1, title: 'Revisar bitácoras del turno', description: 'Verificar registros de operación del turno de la mañana.', priority: 'alta', assignee: 'Juan P.', status: 'pendiente' },
  { id: 2, title: 'Actualizar configuración de kits', description: 'Añadir nuevos kits al listado de operaciones.', priority: 'media', assignee: 'Maria G.', status: 'pendiente' },
  { id: 3, title: 'Generar reporte semanal', description: 'Compilar métricas de la semana y enviar a gerencia.', priority: 'alta', assignee: 'Carlos R.', status: 'en_progreso' },
  { id: 4, title: 'Supervisar ruta norte', description: 'Chequeo periódico de la flota en la ruta norte.', priority: 'baja', assignee: 'Ana L.', status: 'en_progreso' },
  { id: 5, title: 'Capacitación nuevo personal', description: 'Sesión introductoria al sistema Bitacorapp.', priority: 'media', assignee: 'Pedro M.', status: 'completado' },
];

const emptyForm: Omit<Task, 'id'> = {
  title: '', description: '', priority: 'media', assignee: '', status: 'pendiente'
};

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
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...form, id: editingTask.id } : t));
    } else {
      const newId = Math.max(0, ...tasks.map(t => t.id)) + 1;
      setTasks(prev => [...prev, { ...form, id: newId }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => setTasks(prev => prev.filter(t => t.id !== id));

  const moveTask = (id: number, newStatus: Status) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const onDragStart = (id: number) => setDraggedId(id);
  const onDrop = (status: Status) => {
    if (draggedId !== null) { moveTask(draggedId, status); setDraggedId(null); }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#272b60', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              Tablero de Tareas
            </h1>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
              {tasks.length} tareas en total · {tasks.filter(t => t.status === 'completado').length} completadas
            </p>
          </div>
          <button
            onClick={openCreate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#272b60',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13.5px',
              fontWeight: '600',
              padding: '10px 20px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(39,43,96,0.2)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <Plus size={16} />
            Nueva Tarea
          </button>
        </div>

        {/* Kanban Board */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', alignItems: 'start' }}>
          {columns.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <div
                key={col.id}
                onDragOver={e => e.preventDefault()}
                onDrop={() => onDrop(col.id)}
                style={{
                  backgroundColor: col.bg,
                  borderRadius: '18px',
                  padding: '16px',
                  minHeight: '200px',
                  border: `1px solid ${col.color}18`,
                  transition: 'box-shadow 0.2s',
                }}
              >
                {/* Column header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: col.color, display: 'inline-block' }}></span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                      {col.label}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: col.color,
                    backgroundColor: `${col.color}18`,
                    padding: '3px 9px',
                    borderRadius: '20px',
                  }}>
                    {colTasks.length}
                  </span>
                </div>

                {/* Task cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {colTasks.map(task => {
                    const pc = priorityConfig[task.priority];
                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => onDragStart(task.id)}
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '14px',
                          padding: '16px',
                          border: '1px solid #f1f5f9',
                          boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                          cursor: 'grab',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.04)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {/* Priority badge */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '11px',
                            fontWeight: '600',
                            color: pc.text,
                            backgroundColor: pc.bg,
                            padding: '3px 8px',
                            borderRadius: '6px',
                          }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: pc.dot, display: 'inline-block' }}></span>
                            {pc.label}
                          </span>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={() => openEdit(task)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '6px', color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#272b60'; }}
                              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '6px', color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fff1f2'; e.currentTarget.style.color = '#e11d48'; }}
                              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#272b60', margin: '0 0 6px 0', lineHeight: '1.4' }}>
                          {task.title}
                        </p>
                        {/* Description */}
                        {task.description && (
                          <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                            {task.description}
                          </p>
                        )}
                        {/* Footer */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #f8fafc' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '8px', backgroundColor: 'rgba(39,43,96,0.08)', color: '#272b60', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700' }}>
                              {task.assignee[0]}
                            </div>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>{task.assignee}</span>
                          </div>
                          {/* Move arrows */}
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {col.id !== 'pendiente' && (
                              <button
                                onClick={() => moveTask(task.id, col.id === 'completado' ? 'en_progreso' : 'pendiente')}
                                title="Mover atrás"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '3px', color: '#cbd5e1', display: 'flex', alignItems: 'center', transform: 'rotate(180deg)', borderRadius: '4px' }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                              >
                                <ChevronRight size={14} />
                              </button>
                            )}
                            {col.id !== 'completado' && (
                              <button
                                onClick={() => moveTask(task.id, col.id === 'pendiente' ? 'en_progreso' : 'completado')}
                                title="Mover adelante"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '3px', color: '#cbd5e1', display: 'flex', alignItems: 'center', borderRadius: '4px' }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                              >
                                <ChevronRight size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {colTasks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 20px', color: '#cbd5e1' }}>
                      <p style={{ fontSize: '13px', margin: 0 }}>Sin tareas</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: 'rgba(15,23,42,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            padding: '20px'
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '32px',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.15)',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#272b60', margin: 0 }}>
                {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#272b60'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Title */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                  Título *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Nombre de la tarea..."
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '12px',
                    border: '1px solid #e2e8f0', fontSize: '14px', color: '#272b60',
                    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#ff761c')}
                  onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                />
              </div>
              {/* Description */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                  Descripción
                </label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Descripción de la tarea..."
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '12px',
                    border: '1px solid #e2e8f0', fontSize: '14px', color: '#272b60',
                    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                    resize: 'none', lineHeight: '1.5', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#ff761c')}
                  onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                />
              </div>
              {/* Row: Priority + Assignee */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                    Prioridad
                  </label>
                  <select
                    value={form.priority}
                    onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '12px',
                      border: '1px solid #e2e8f0', fontSize: '14px', color: '#272b60',
                      outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                      appearance: 'none', cursor: 'pointer', backgroundColor: 'white',
                    }}
                  >
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                    Asignado a
                  </label>
                  <input
                    type="text"
                    value={form.assignee}
                    onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))}
                    placeholder="Nombre..."
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '12px',
                      border: '1px solid #e2e8f0', fontSize: '14px', color: '#272b60',
                      outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#ff761c')}
                    onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                  />
                </div>
              </div>
              {/* Status */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                  Estado
                </label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as Status }))}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '12px',
                    border: '1px solid #e2e8f0', fontSize: '14px', color: '#272b60',
                    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                    appearance: 'none', cursor: 'pointer', backgroundColor: 'white',
                  }}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="completado">Completado</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '28px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1, padding: '11px 20px', borderRadius: '12px',
                  border: '1px solid #e2e8f0', backgroundColor: 'white',
                  color: '#64748b', fontSize: '14px', fontWeight: '500',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title.trim()}
                style={{
                  flex: 1, padding: '11px 20px', borderRadius: '12px',
                  border: 'none',
                  backgroundColor: form.title.trim() ? '#272b60' : '#e2e8f0',
                  color: form.title.trim() ? 'white' : '#94a3b8',
                  fontSize: '14px', fontWeight: '600',
                  cursor: form.title.trim() ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit', transition: 'all 0.2s',
                  boxShadow: form.title.trim() ? '0 4px 12px rgba(39,43,96,0.25)' : 'none',
                }}
                onMouseEnter={e => { if (form.title.trim()) e.currentTarget.style.opacity = '0.9'; }}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {editingTask ? 'Guardar Cambios' : 'Crear Tarea'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TaskBoard;
