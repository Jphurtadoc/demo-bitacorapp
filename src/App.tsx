import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/modules/auth/login/adapters/ui/Login";
import AdminDashboard from "@/modules/admin/dashboard/adapters/ui/AdminDashboard";
import UserDashboard from "@/modules/user/dashboard/adapters/ui/UserDashboard";
import { AuthRepository } from "@/modules/auth/login/infrastructure/AuthRepository";
import ModuleDashboard from "@/components/shared/ModuleDashboard";
import TaskBoard from "@/modules/tasks/TaskBoard";
import ItemsList from "@/modules/operations/items/adapters/ui/ItemsList";
import { 
  BarChart, Users, MessageSquare, Clock, ShieldCheck, FileText, 
  ThumbsUp, LineChart, TrendingUp, Inbox,
  Layers, ShieldAlert, Activity, ListTodo
} from 'lucide-react';

function App() {
  const authRepository = new AuthRepository();

  return (
    <Routes>
      <Route path="/login" element={<Login authRepository={authRepository} />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Administration Module Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/ind-gerenciales" element={
        <ModuleDashboard 
          moduleName="Indicadores Gerenciales" 
          description="Monitoreo crítico de KPIs corporativos."
          stats={[
            { label: 'Ingresos', value: '$45M', color: '#16a34a', icon: <TrendingUp size={20} /> },
            { label: 'Gastos', value: '$12M', color: '#dc2626', icon: <Activity size={20} /> },
            { label: 'Eficiencia', value: '92%', color: '#2563eb', icon: <ShieldCheck size={20} /> },
            { label: 'Meta Anual', value: '85%', color: '#ea580c', icon: <BarChart size={20} /> },
          ]}
        />
      } />
      <Route path="/admin/ind-pqrs" element={
        <ModuleDashboard 
          moduleName="Indicadores de PQRS" 
          description="Gestión y análisis de satisfacción."
          stats={[
            { label: 'Nuevos', value: '15', color: '#2563eb', icon: <Inbox size={20} /> },
            { label: 'En Proceso', value: '08', color: '#ea580c', icon: <Clock size={20} /> },
            { label: 'Cerrados', value: '124', color: '#16a34a', icon: <ThumbsUp size={20} /> },
            { label: 'Tasa Respuesta', value: '1.2 d', color: '#7c3aed', icon: <MessageSquare size={20} /> },
          ]}
        />
      } />
      <Route path="/admin/ind-uso" element={
        <ModuleDashboard 
          moduleName="Indicadores de Uso" 
          description="Adopción y uso del sistema por parte de empleados."
          stats={[
            { label: 'Usuarios Activos', value: '456', color: '#2563eb', icon: <Users size={20} /> },
            { label: 'Nuevos Registros', value: '1.2k', color: '#16a34a', icon: <FileText size={20} /> },
            { label: 'Sesiones Promedio', value: '25 m', color: '#ea580c', icon: <Clock size={20} /> },
            { label: 'Picos de Uso', value: '10 AM', color: '#7c3aed', icon: <LineChart size={20} /> },
          ]}
        />
      } />

      {/* Operations Module Routes */}
      <Route path="/oper/dashboard" element={
        <ModuleDashboard 
          moduleName="Operaciones" 
          description="Visualiza el estado operativo actual."
          stats={[
            { label: 'Items Activos', value: '234', color: '#2563eb', icon: <Layers size={20} /> },
            { label: 'Cotizaciones', value: '18', color: '#ea580c', icon: <Activity size={20} /> },
            { label: 'Kits Disponibles', value: '45', color: '#16a34a', icon: <Activity size={20} /> },
            { label: 'Incidencias', value: '02', color: '#dc2626', icon: <ShieldAlert size={20} /> },
          ]}
        />
      } />
      <Route path="/oper/items" element={<ItemsList />} />
      <Route path="/oper/cotizaciones" element={<ModuleDashboard moduleName="Cotizaciones" description="Gestión de cotizaciones y presupuestos." stats={[]} />} />
      <Route path="/oper/kits" element={<ModuleDashboard moduleName="Kits" description="Configuración y control de kits." stats={[]} />} />
      <Route path="/oper/config" element={<ModuleDashboard moduleName="Configuraciones" description="Parámetros del módulo de operaciones." stats={[]} />} />
      <Route path="/oper/docs" element={<ModuleDashboard moduleName="Documentación" description="Biblioteca de recursos de operaciones." stats={[]} />} />

      {/* Generic route for other submodules (ModuleDashboard template) */}
      <Route path="/admin/gestion-clientes" element={<ModuleDashboard moduleName="Gestión Clientes" description="Administración de carteras y clientes." stats={[]} />} />
      <Route path="/admin/reporte-gestion" element={<ModuleDashboard moduleName="Reporte Gestión" description="Generador de reportes administrativos." stats={[]} />} />
      <Route path="/admin/supervision" element={<ModuleDashboard moduleName="Supervisión" description="Módulo de control de supervisores." stats={[]} />} />
      <Route path="/admin/recom" element={<ModuleDashboard moduleName="Recomendaciones" description="Seguimiento de mejora continua." stats={[]} />} />
      <Route path="/admin/satisfaccion" element={<ModuleDashboard moduleName="Satisfacción" description="Encuestas y feedback." stats={[]} />} />
      <Route path="/admin/docs" element={<ModuleDashboard moduleName="Documentación" description="Biblioteca de recursos." stats={[]} />} />

      {/* Task Module Routes */}
      <Route path="/tasks/dashboard" element={
        <ModuleDashboard 
          moduleName="Tareas" 
          description="Gestión integral de actividades registradas."
          stats={[
            { label: 'Asignadas', value: '45', color: '#2563eb', icon: <ListTodo size={20} /> },
            { label: 'Pendientes', value: '12', color: '#ea580c', icon: <Clock size={20} /> },
            { label: 'Vencidas', value: '03', color: '#dc2626', icon: <ShieldAlert size={20} /> },
            { label: 'Completadas', value: '128', color: '#16a34a', icon: <ThumbsUp size={20} /> },
          ]}
        />
      } />
      <Route path="/tasks/list" element={<TaskBoard />} />
      <Route path="/tasks/docs" element={<ModuleDashboard moduleName="Documentación de Tareas" description="Recursos y guías del módulo de tareas." stats={[]} />} />

      {/* Catch-all for submodules */}
      <Route path="/:module/*" element={
        <ModuleDashboard 
          moduleName="Módulo Activo" 
          description="Utilice el menú lateral para navegar."
          stats={[]}
        />
      } />

      <Route
        path="*"
        element={
          <div style={{ padding: "2rem", textAlign: "center" }}>
            404 - Página no encontrada
          </div>
        }
      />
    </Routes>
  );
}

export default App;
