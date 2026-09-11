
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Surface } from '@/components/UI/surface';
import { EmphasisIcon } from '@/components/UI/emphasis';
import { BookOpen, PlayCircle, Image as ImageIcon } from 'lucide-react';

const Documentation = () => {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1000px] pb-10">
        <div className="mb-2 flex items-center gap-4">
          <EmphasisIcon tone="primary" size="lg" className="!h-14 !w-14 !rounded-xl">
            <BookOpen size={28} />
          </EmphasisIcon>
          <h1 className="page-header-title page-header-title-lg m-0">Manual de Uso</h1>
        </div>
        <p className="page-header-subtitle mb-10 ml-[72px]">Documentación interactiva y guías del sistema en general</p>
        
        <div className="flex flex-col gap-8">
          <Surface padding="xl" radius="xl">
            <h2 className="page-section-title mb-4 text-xl">¿Cómo crear un nuevo registro y gestionarlo?</h2>
            <p className="mb-6 leading-relaxed text-subtle">
              Para crear un nuevo registro, dirígete al módulo correspondiente y utiliza el botón de acción principal. A continuación, se muestra un video demostrativo del proceso paso a paso.
            </p>
            
            <div className="flex h-[360px] w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted">
              <PlayCircle size={48} className="text-subtle" />
              <span className="text-lg font-semibold text-foreground">Video Demo</span>
              <span className="text-sm text-subtle">El reproductor interactivo estará disponible en la versión final</span>
            </div>
          </Surface>

          <Surface padding="xl" radius="xl">
            <h2 className="page-section-title mb-4 text-xl">Estructura de Datos y Flujo de Estados</h2>
            <p className="mb-6 leading-relaxed text-subtle">
              Consulta el diagrama detallado para comprender el ciclo de vida de cada elemento dentro de la base de datos.
            </p>
            
            <div className="flex h-[360px] w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted">
              <ImageIcon size={48} className="text-subtle" />
              <span className="text-lg font-semibold text-foreground">Imagen Demo</span>
              <span className="text-sm text-subtle">Diagrama de flujo del sistema y mapa de calor</span>
            </div>
          </Surface>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Documentation;
