
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Surface } from '@/components/UI/surface';
import { EmphasisIcon } from '@/components/UI/emphasis';
import { User, Mail, Shield, Key, Bell, Settings, ChevronRight } from 'lucide-react';

const UserProfile = () => {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1000px] pb-10">
        <h1 className="page-header-title page-header-title-md mb-2">Mi Perfil</h1>
        <p className="page-header-subtitle mb-8">Administra tu información personal y preferencias de cuenta</p>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="col-span-1">
            <Surface padding="lg" radius="xl">
               <div className="mb-6 flex flex-col items-center">
                 <EmphasisIcon tone="info" size="lg" className="mb-4 !h-20 !w-20 !rounded-2xl">
                   <User size={36} />
                 </EmphasisIcon>
                 <h2 className="page-section-title m-0 text-lg">Administrador Demo</h2>
                 <p className="mt-1 text-sm text-subtle">Super Administrador</p>
               </div>
               
               <div className="flex flex-col gap-2">
                 <button type="button" className="flex items-center justify-between rounded-lg bg-muted px-4 py-3 font-semibold text-foreground">
                   <div className="flex items-center gap-3"><Settings size={18} className="text-subtle"/> Información Básica</div>
                   <ChevronRight size={16} className="text-subtle" />
                 </button>
                 <button type="button" className="flex items-center justify-between rounded-lg bg-transparent px-4 py-3 font-semibold text-subtle transition-colors hover:bg-muted hover:text-foreground">
                   <div className="flex items-center gap-3"><Key size={18}/> Seguridad</div>
                 </button>
                 <button type="button" className="flex items-center justify-between rounded-lg bg-transparent px-4 py-3 font-semibold text-subtle transition-colors hover:bg-muted hover:text-foreground">
                   <div className="flex items-center gap-3"><Bell size={18}/> Notificaciones</div>
                 </button>
               </div>
            </Surface>
          </div>
          
          <div className="col-span-1 flex flex-col gap-6 md:col-span-2">
            <Surface padding="xl" radius="xl">
               <h3 className="page-section-title mb-6 text-lg">Detalles de la Cuenta</h3>
               
               <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                 <div>
                   <label className="mb-2 block text-xs font-bold uppercase text-subtle">Nombres</label>
                   <input type="text" defaultValue="Administrador" className="w-full rounded-lg border border-border bg-surface px-4 py-3 font-medium text-foreground outline-none" />
                 </div>
                 <div>
                   <label className="mb-2 block text-xs font-bold uppercase text-subtle">Apellidos</label>
                   <input type="text" defaultValue="Demo" className="w-full rounded-lg border border-border bg-surface px-4 py-3 font-medium text-foreground outline-none" />
                 </div>
                 <div className="sm:col-span-2">
                   <label className="mb-2 block text-xs font-bold uppercase text-subtle">Correo Electrónico</label>
                   <div className="relative">
                     <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
                     <input type="email" defaultValue="admin.demo@bitacorapp.com" className="box-border w-full rounded-lg border border-border bg-surface py-3 pl-[42px] pr-4 font-medium text-foreground outline-none" />
                   </div>
                 </div>
                 <div className="sm:col-span-2">
                   <label className="mb-2 block text-xs font-bold uppercase text-subtle">Rol Asignado</label>
                   <div className="flex items-center gap-3 rounded-lg border border-border bg-muted px-4 py-3">
                     <Shield size={18} className="text-emerald-600 dark:text-emerald-400" />
                     <span className="font-semibold text-foreground">Super Administrador</span>
                     <span className="ml-auto rounded-lg bg-border px-2.5 py-1 text-xs text-subtle">Solo lectura</span>
                   </div>
                 </div>
               </div>
               
               <div className="mt-8">
                 <button type="button" className="rounded-lg bg-brand px-7 py-3.5 font-bold text-[#ffffff] transition-all hover:bg-brand-hover dark:bg-primary dark:hover:bg-primary-hover">
                   Guardar Cambios
                 </button>
               </div>
            </Surface>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
