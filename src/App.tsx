import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "@/modules/auth/login/adapters/ui/Login";
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
  Activity
} from 'lucide-react';
import { menuData, flattenMenuEntries, getModuleColorFromPath } from '@/config/menuData';

import DashboardPage from "@/pages/DashboardPage";
import AdminUsersPage from "@/pages/AdminUsersPage";
import AdminVehiclesPage from "@/pages/AdminVehiclesPage";
import AdminPetsPage from "@/pages/AdminPetsPage";
import AdminPeoplePage from "@/pages/AdminPeoplePage";
import SecurityOperationPage from "@/pages/SecurityOperationPage";
import SecurityParametrizationPage from "@/pages/SecurityParametrizationPage";
import CommunicationsPage from "@/pages/CommunicationsPage";
import PqrsInboxPage from "@/pages/PqrsInboxPage";
import PqrsSettingsPage from "@/pages/PqrsSettingsPage";

const DynamicBlockedDashboard = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  let dynamicTitle = "Esta Sección";
  for (const items of Object.values(menuData)) {
    const match = flattenMenuEntries(items).find(
      (item) => item.path === currentPath,
    );
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
      accentColor={getModuleColorFromPath(currentPath)}
    />
  );
};

function App() {
  const authRepository = new AuthRepository();

  return (
    <Routes>
      <Route path="/login" element={<Login authRepository={authRepository} />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* Administration Module Routes */}
      <Route path="/admin/dashboard" element={<DashboardPage />} />
      <Route path="/admin/users" element={<AdminUsersPage />} />
      <Route path="/admin/people" element={<AdminPeoplePage />} />
      <Route path="/admin/vehicles" element={<AdminVehiclesPage />} />
      <Route path="/admin/pets" element={<AdminPetsPage />} />
      <Route path="/admin/ind-gerenciales" element={
        <ModuleDashboard 
          moduleName="Indicadores Gerenciales" 
          description="Monitoreo crítico de KPIs corporativos."
          stats={[
            { label: 'Ingresos', value: '$45M', color: '#5b67c7', icon: <TrendingUp size={20} /> },
            { label: 'Gastos', value: '$12M', color: '#ff8f47', icon: <Activity size={20} /> },
            { label: 'Eficiencia', value: '92%', color: '#6b9be8', icon: <ShieldCheck size={20} /> },
            { label: 'Meta Anual', value: '85%', color: '#ffa566', icon: <BarChart size={20} /> },
          ]}
        />
      } />
      <Route path="/admin/ind-pqrs" element={
        <ModuleDashboard 
          moduleName="Indicadores de PQRS" 
          description="Gestión y análisis de satisfacción."
          stats={[
            { label: 'Nuevos', value: '15', color: '#5b67c7', icon: <Inbox size={20} /> },
            { label: 'En Proceso', value: '08', color: '#ff8f47', icon: <Clock size={20} /> },
            { label: 'Cerrados', value: '124', color: '#6b9be8', icon: <ThumbsUp size={20} /> },
            { label: 'Tasa Respuesta', value: '1.2 d', color: '#ffa566', icon: <MessageSquare size={20} /> },
          ]}
        />
      } />
      <Route path="/admin/ind-uso" element={
        <ModuleDashboard 
          moduleName="Indicadores de Uso" 
          description="Adopción y uso del sistema por parte de empleados."
          stats={[
            { label: 'Usuarios Activos', value: '456', color: '#5b67c7', icon: <Users size={20} /> },
            { label: 'Nuevos Registros', value: '1.2k', color: '#6b9be8', icon: <FileText size={20} /> },
            { label: 'Sesiones Promedio', value: '25 m', color: '#ff8f47', icon: <Clock size={20} /> },
            { label: 'Picos de Uso', value: '10 AM', color: '#ffa566', icon: <LineChart size={20} /> },
          ]}
        />
      } />

      {/* Operations Module Routes */}
      {/* Operations Module Routes */}
      <Route path="/oper/dashboard" element={<DashboardPage />} />
      <Route path="/oper/items" element={<ItemsList />} />
      <Route path="/oper/cotizaciones" element={<CotizacionesList />} />

      {/* Task Module Routes */}
      <Route path="/tasks/dashboard" element={<DashboardPage />} />
      <Route path="/tasks/list" element={<TaskBoard />} />

      {/* Logistics Module Routes */}
      <Route path="/logistics/dashboard" element={<DashboardPage />} />

      {/* Security Module Routes */}
      <Route path="/security/dashboard" element={<DashboardPage />} />
      <Route path="/security/operacion" element={<SecurityOperationPage />} />
      <Route path="/security/parametrizacion" element={<SecurityParametrizationPage />} />

      {/* PQRS Module Routes */}
      <Route path="/pqrs/dashboard" element={<DashboardPage />} />
      <Route path="/pqrs/inbox" element={<PqrsInboxPage />} />
      <Route path="/pqrs/config" element={<PqrsSettingsPage />} />

      {/* Quality Module Routes */}
      <Route path="/quality/dashboard" element={<DashboardPage />} />

      {/* Support Module Routes */}
      <Route path="/support/dashboard" element={<DashboardPage />} />

      {/* Comms Module Routes */}
      <Route path="/comms/dashboard" element={<DashboardPage />} />
      <Route path="/comms/comunicaciones" element={<CommunicationsPage />} />

      {/* HR Module Routes */}
      <Route path="/hr/dashboard" element={<DashboardPage />} />

      {/* Reports Module Routes */}
      <Route path="/reports/dashboard" element={<DashboardPage />} />

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
