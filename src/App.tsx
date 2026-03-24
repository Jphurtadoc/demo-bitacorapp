import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "@/modules/auth/login/adapters/ui/Login";
import AdminDashboard from "@/modules/admin/dashboard/adapters/ui/AdminDashboard";
import UserDashboard from "@/modules/user/dashboard/adapters/ui/UserDashboard";
import { AuthRepository } from "@/modules/auth/login/infrastructure/AuthRepository";
import ModuleDashboard from "@/components/shared/ModuleDashboard";
import TaskBoard from "@/modules/tasks/TaskBoard";
import ItemsList from "@/modules/operations/items/adapters/ui/ItemsList";
import CotizacionesList from "@/modules/operations/cotizaciones/adapters/ui/CotizacionesList";
import UserProfile from "@/pages/UserProfile";
import SystemSettings from "@/pages/SystemSettings";
import Documentation from "@/components/shared/Documentation";
import { 
  BarChart, Users, MessageSquare, Clock, ShieldCheck, FileText, 
  ThumbsUp, LineChart, TrendingUp, Inbox,
  Layers, ShieldAlert, Activity, ListTodo
} from 'lucide-react';
import { menuData } from '@/config/menuData';

const DynamicBlockedDashboard = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  let dynamicTitle = "Esta Sección";
  for (const items of Object.values(menuData)) {
    const match = items.find(item => item.path === currentPath);
    if (match) {
      dynamicTitle = match.label;
      break;
    }
  }

  return (
    <ModuleDashboard 
      moduleName={dynamicTitle} 
      description="Funcionalidad restringida en versión de prueba."
      stats={[]}
      isDemoBlocked={true}
    />
  );
};

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
          moduleName="Operación" 
          description="Gestión principal de recursos y proyectos operativos."
          stats={[
            { label: 'Proyectos Activos', value: '18', color: '#16a34a', icon: <Activity size={20} /> },
            { label: 'Items Críticos', value: '4', color: '#dc2626', icon: <ShieldAlert size={20} /> },
            { label: 'Entregas', value: '12', color: '#2563eb', icon: <Layers size={20} /> },
            { label: 'Tareas Pendientes', value: '35', color: '#ea580c', icon: <ListTodo size={20} /> },
          ]}
        />
      } />

      <Route path="/oper/items" element={<ItemsList />} />
      <Route path="/oper/cotizaciones" element={<CotizacionesList />} />

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

      {/* Logistics Module Routes */}
      <Route path="/logistics/dashboard" element={
        <ModuleDashboard 
          moduleName="Logística" 
          description="Gestión de despachos, rutas y flotas de transporte."
          stats={[
            { label: 'Flota Activa', value: '18', color: '#2563eb', icon: <Activity size={20} /> },
            { label: 'Rutas Completadas', value: '45', color: '#16a34a', icon: <ThumbsUp size={20} /> },
            { label: 'Entregas Pendientes', value: '08', color: '#ea580c', icon: <Clock size={20} /> },
            { label: 'Incidencias Ruta', value: '02', color: '#dc2626', icon: <ShieldAlert size={20} /> },
          ]}
        />
      } />

      {/* Security Module Routes */}
      <Route path="/security/dashboard" element={
        <ModuleDashboard 
          moduleName="Vigilancia" 
          description="Monitoreo de seguridad y control de acceso."
          stats={[
            { label: 'Cámaras Activas', value: '128', color: '#2563eb', icon: <Activity size={20} /> },
            { label: 'Rondas Completadas', value: '24', color: '#16a34a', icon: <ShieldCheck size={20} /> },
            { label: 'Alertas Seguridad', value: '03', color: '#dc2626', icon: <ShieldAlert size={20} /> },
            { label: 'Novedades', value: '05', color: '#ea580c', icon: <MessageSquare size={20} /> },
          ]}
        />
      } />

      {/* PQRS Module Routes */}
      <Route path="/pqrs/dashboard" element={
        <ModuleDashboard 
          moduleName="PQRS Operativo" 
          description="Centro de Peticiones, Quejas, Reclamos y Sugerencias."
          stats={[
            { label: 'Tickets Abiertos', value: '15', color: '#dc2626', icon: <Inbox size={20} /> },
            { label: 'En Proceso', value: '08', color: '#ea580c', icon: <Clock size={20} /> },
            { label: 'Cerrados Hoy', value: '32', color: '#16a34a', icon: <ThumbsUp size={20} /> },
            { label: 'Tiempo Promedio', value: '6h', color: '#2563eb', icon: <LineChart size={20} /> },
          ]}
        />
      } />

      {/* Quality Module Routes */}
      <Route path="/quality/dashboard" element={
        <ModuleDashboard 
          moduleName="Calidad" 
          description="Auditorías, cumplimiento y certificaciones de procesos."
          stats={[
            { label: 'Auditorías Activas', value: '04', color: '#2563eb', icon: <Activity size={20} /> },
            { label: 'No Conformidades', value: '02', color: '#dc2626', icon: <ShieldAlert size={20} /> },
            { label: 'Certificaciones', value: '14', color: '#16a34a', icon: <ShieldCheck size={20} /> },
            { label: 'Docs. Revisados', value: '56', color: '#7c3aed', icon: <FileText size={20} /> },
          ]}
        />
      } />

      {/* Support Module Routes */}
      <Route path="/support/dashboard" element={
        <ModuleDashboard 
          moduleName="Soporte IT" 
          description="Gestión de tickets de mesa de ayuda y mantenimiento."
          stats={[
            { label: 'Tickets Activos', value: '23', color: '#ea580c', icon: <Inbox size={20} /> },
            { label: 'Resueltos', value: '18', color: '#16a34a', icon: <ThumbsUp size={20} /> },
            { label: 'SLA Cumplido', value: '92%', color: '#2563eb', icon: <TrendingUp size={20} /> },
            { label: 'Mantenimientos', value: '04', color: '#dc2626', icon: <Activity size={20} /> },
          ]}
        />
      } />

      {/* Comms Module Routes */}
      <Route path="/comms/dashboard" element={
        <ModuleDashboard 
          moduleName="Comunicaciones" 
          description="Anuncios corporativos y directorio de contactos."
          stats={[
            { label: 'Anuncios Activos', value: '05', color: '#2563eb', icon: <MessageSquare size={20} /> },
            { label: 'Usuarios Alcance', value: '1.2k', color: '#16a34a', icon: <Users size={20} /> },
            { label: 'Lectura Promedio', value: '88%', color: '#ea580c', icon: <BarChart size={20} /> },
            { label: 'Campañas Hoy', value: '02', color: '#7c3aed', icon: <Activity size={20} /> },
          ]}
        />
      } />

      {/* HR Module Routes */}
      <Route path="/hr/dashboard" element={
        <ModuleDashboard 
          moduleName="Gestión Humana" 
          description="Administración de personal, beneficios y talento."
          stats={[
            { label: 'Planilla Activa', value: '245', color: '#2563eb', icon: <Users size={20} /> },
            { label: 'Permisos Pend.', value: '12', color: '#ea580c', icon: <Clock size={20} /> },
            { label: 'Capacitaciones', value: '03', color: '#7c3aed', icon: <Activity size={20} /> },
            { label: 'Clima Laboral', value: '91%', color: '#16a34a', icon: <ThumbsUp size={20} /> },
          ]}
        />
      } />

      {/* Reports Module Routes */}
      <Route path="/reports/dashboard" element={
        <ModuleDashboard 
          moduleName="Reportes Globales" 
          description="Generador de informes y extracción centralizada de datos."
          stats={[
            { label: 'Informes Hoy', value: '156', color: '#16a34a', icon: <FileText size={20} /> },
            { label: 'Descargas', value: '43', color: '#2563eb', icon: <Inbox size={20} /> },
            { label: 'Procesos Lotes', value: '02', color: '#ea580c', icon: <Clock size={20} /> },
            { label: 'Consultas (ms)', value: '120', color: '#7c3aed', icon: <LineChart size={20} /> },
          ]}
        />
      } />

      {/* Settings & Profile */}
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/settings" element={<SystemSettings />} />

      {/* Explicit Feature Overrides to bypass catch-all */}
      <Route path="/admin/docs" element={<Documentation />} />
      <Route path="/oper/docs" element={<Documentation />} />
      <Route path="/tasks/docs" element={<Documentation />} />
      <Route path="/quality/docs" element={<Documentation />} />
      
      {/* Catch-all for submodules */}
      <Route path="/:module/*" element={<DynamicBlockedDashboard />} />

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
