import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { BookOpen, PlayCircle, Image as ImageIcon } from 'lucide-react';

const Documentation = () => {
  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <div style={{ padding: '12px', backgroundColor: '#fff7ed', color: '#ea580c', borderRadius: '16px' }}>
            <BookOpen size={28} />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#272b60', margin: 0 }}>Manual de Uso</h1>
        </div>
        <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '40px', marginLeft: '68px' }}>Documentación interactiva y guías del sistema en general</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* FAQ 1 */}
          <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '40px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#272b60', marginBottom: '16px' }}>¿Cómo crear un nuevo registro y gestionarlo?</h2>
            <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '24px' }}>Para crear un nuevo registro, dirígete al módulo correspondiente y utiliza el botón de acción principal. A continuación, se muestra un video demostrativo del proceso paso a paso.</p>
            
            <div style={{ width: '100%', height: '360px', backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <PlayCircle size={48} style={{ color: '#94a3b8' }} />
              <span style={{ fontWeight: '600', color: '#64748b', fontSize: '18px' }}>Video Demo</span>
              <span style={{ fontSize: '14px', color: '#94a3b8' }}>El reproductor interactivo estará disponible en la versión final</span>
            </div>
          </div>

          {/* FAQ 2 */}
          <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '40px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#272b60', marginBottom: '16px' }}>Estructura de Datos y Flujo de Estados</h2>
            <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '24px' }}>Consulta el diagrama detallado para comprender el ciclo de vida de cada elemento dentro de la base de datos.</p>
            
            <div style={{ width: '100%', height: '360px', backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <ImageIcon size={48} style={{ color: '#94a3b8' }} />
              <span style={{ fontWeight: '600', color: '#64748b', fontSize: '18px' }}>Imagen Demo</span>
              <span style={{ fontSize: '14px', color: '#94a3b8' }}>Diagrama de flujo del sistema y mapa de calor</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Documentation;
