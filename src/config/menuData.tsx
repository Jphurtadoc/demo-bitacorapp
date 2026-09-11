import React from 'react';
import {
  Settings,
  BarChart3,
  FilePieChart,
  TrendingUp,
  Truck,
  Package,
  MapPin,
  Eye,
  ShieldAlert,
  Radio,
  MessageSquare,
  HelpCircle,
  Inbox,
  Award,
  CheckCircle2,
  FileText,
  LifeBuoy,
  Wrench,
  MessageCircle,
  Megaphone,
  UserCircle,
  Heart,
  PawPrint,
  GraduationCap,
  BarChart4,
  UserCheck,
  Box,
  Layers,
  ListTodo,
  Shield,
  UserRound,
  Globe,
  Users,
  ClipboardList,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export interface MenuLink {
  label: string;
  icon: React.ReactNode;
  path: string;
}

export interface MenuGroup {
  label: string;
  children: { label: string; path: string }[];
}

export type MenuEntry = MenuLink | MenuGroup;

export function isMenuGroup(entry: MenuEntry): entry is MenuGroup {
  return 'children' in entry;
}

export function flattenMenuEntries(entries: MenuEntry[]): MenuLink[] {
  return entries.flatMap((entry) =>
    isMenuGroup(entry)
      ? entry.children.map((child) => ({
          label: child.label,
          icon: <FileText size={20} />,
          path: child.path,
        }))
      : [entry],
  );
}

export const modules = [
  { id: 'administracion', label: 'Administración', icon: <Shield size={18} />, color: '#5b67c7' },
  { id: 'comercial', label: 'Comercial', icon: <FilePieChart size={18} />, color: '#ff8f47' },
  { id: 'tareas', label: 'Tareas', icon: <ListTodo size={18} />, color: '#7a84d8' },
  { id: 'reportes', label: 'Reportes', icon: <BarChart3 size={18} />, color: '#ffa566' },
  { id: 'logistica', label: 'Logística', icon: <Truck size={18} />, color: '#6b9be8' },
  { id: 'vigilancia', label: 'Vigilancia', icon: <Eye size={18} />, color: '#e88840' },
  { id: 'pqrs', label: 'PQRS', icon: <MessageSquare size={18} />, color: '#4f7cd1' },
  { id: 'calidad', label: 'Calidad', icon: <Award size={18} />, color: '#ffb07a' },
  { id: 'soporte', label: 'Soporte', icon: <LifeBuoy size={18} />, color: '#5a75d0' },
  { id: 'comunicaciones', label: 'Comunicaciones', icon: <Globe size={18} />, color: '#ff9a5c' },
  { id: 'gestion_humana', label: 'Gestión Humana', icon: <UserRound size={18} />, color: '#6a8fd8' },
] as const;

const pathPrefixToModuleId: Record<string, (typeof modules)[number]['id']> = {
  admin: 'administracion',
  oper: 'comercial',
  tasks: 'tareas',
  logistics: 'logistica',
  security: 'vigilancia',
  pqrs: 'pqrs',
  quality: 'calidad',
  support: 'soporte',
  comms: 'comunicaciones',
  hr: 'gestion_humana',
  reports: 'reportes',
};

export function getModuleIdFromPath(path: string): string | null {
  const fromMenu = Object.entries(menuData).find(([, items]) =>
    flattenMenuEntries(items).some(
      (item) => path === item.path || path.startsWith(`${item.path}/`),
    ),
  );

  if (fromMenu) return fromMenu[0];

  const segment = path.split('/').filter(Boolean)[0];
  if (segment && pathPrefixToModuleId[segment]) {
    return pathPrefixToModuleId[segment];
  }

  return null;
}

export function getModuleColorFromPath(path: string): string {
  const moduleId = getModuleIdFromPath(path);
  const mod = modules.find((item) => item.id === moduleId);
  return mod?.color ?? '#ff8f47';
}

export function getModuleColorById(moduleId: string): string {
  return modules.find((item) => item.id === moduleId)?.color ?? '#ff8f47';
}

export const menuData: Record<string, MenuEntry[]> = {
  administracion: [
    { label: 'Usuarios', icon: <Users size={20} />, path: '/admin/users' },
    { label: 'Personas', icon: <UserRound size={20} />, path: '/admin/people' },
    { label: 'Vehículos', icon: <Truck size={20} />, path: '/admin/vehicles' },
    { label: 'Mascotas', icon: <PawPrint size={20} />, path: '/admin/pets' },
    { label: 'Clientes', icon: <UserCheck size={20} />, path: '/admin/clients' },
    { label: 'Consignas', icon: <ClipboardList size={20} />, path: '/admin/consignas' },
    { label: 'Seguridad', icon: <ShieldCheck size={20} />, path: '/admin/security' },
    { label: 'KPIs', icon: <BarChart4 size={20} />, path: '/admin/kpis' },
    { label: 'Organización', icon: <Building2 size={20} />, path: '/admin/organization' },
  ],
  comercial: [
    { label: 'Items', icon: <Layers size={20} />, path: '/oper/items' },
    { label: 'Cotizaciones', icon: <FilePieChart size={20} />, path: '/oper/cotizaciones' },
    { label: 'Kits', icon: <Box size={20} />, path: '/oper/kits' },
    { label: 'Configuraciones', icon: <Settings size={20} />, path: '/oper/config' },
  ],
  tareas: [
    { label: 'Tareas', icon: <ListTodo size={20} />, path: '/tasks/list' },
  ],
  logistica: [
    { label: 'Flotas', icon: <Truck size={20} />, path: '/logistics/fleet' },
    { label: 'Inventario', icon: <Package size={20} />, path: '/logistics/inventory' },
    { label: 'Rutas', icon: <MapPin size={20} />, path: '/logistics/routes' },
  ],
  vigilancia: [
    { label: 'Operación', icon: <ClipboardList size={20} />, path: '/security/operacion' },
    { label: 'Parametrización', icon: <Settings size={20} />, path: '/security/parametrizacion' },
    { label: 'Monitoreo', icon: <Eye size={20} />, path: '/security/monitor' },
    { label: 'Alertas', icon: <ShieldAlert size={20} />, path: '/security/alerts' },
    { label: 'Radio', icon: <Radio size={20} />, path: '/security/radio' },
  ],
  pqrs: [
    { label: 'Recibidos', icon: <Inbox size={20} />, path: '/pqrs/inbox' },
    { label: 'Configuraciones', icon: <Settings size={20} />, path: '/pqrs/config' },
    { label: 'Chat', icon: <MessageSquare size={20} />, path: '/pqrs/chat' },
    { label: 'FAQs', icon: <HelpCircle size={20} />, path: '/pqrs/faqs' },
  ],
  calidad: [
    { label: 'Certificaciones', icon: <Award size={20} />, path: '/quality/certs' },
    { label: 'Auditoría', icon: <CheckCircle2 size={20} />, path: '/quality/audit' },
    { label: 'Documentación', icon: <FileText size={20} />, path: '/quality/docs' },
  ],
  soporte: [
    { label: 'Soporte IT', icon: <LifeBuoy size={20} />, path: '/support/it' },
    { label: 'Mantenimiento', icon: <Wrench size={20} />, path: '/support/mt' },
    { label: 'Ticket', icon: <MessageCircle size={20} />, path: '/support/tickets' },
  ],
  comunicaciones: [
    { label: 'Comunicaciones', icon: <Megaphone size={20} />, path: '/comms/comunicaciones' },
  ],
  gestion_humana: [
    { label: 'Empleados', icon: <UserCircle size={20} />, path: '/hr/employees' },
    { label: 'Beneficios', icon: <Heart size={20} />, path: '/hr/benefits' },
    { label: 'Formación', icon: <GraduationCap size={20} />, path: '/hr/training' },
  ],
  reportes: [
    { label: 'Resumen', icon: <BarChart3 size={20} />, path: '/reports/summary' },
    { label: 'Exportar', icon: <FilePieChart size={20} />, path: '/reports/export' },
    { label: 'Métricas', icon: <TrendingUp size={20} />, path: '/reports/metrics' },
  ],
};
