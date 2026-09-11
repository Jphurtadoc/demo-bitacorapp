import { useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import {
  Archive,
  Building2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  ImagePlus,
  Images,
  Megaphone,
  Newspaper,
  Paperclip,
  Pencil,
  Plus,
  Radio,
  Trash2,
  UserRound,
  Users,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Drawer } from '@/components/UI/drawer';
import { ModalDrawer } from '@/components/UI/modal-drawer';
import { SearchableSelect } from '@/components/UI/searchable-select';
import { Surface } from '@/components/UI/surface';
import { Switch } from '@/components/UI/switch';
import { EmphasisIcon } from '@/components/UI/emphasis';
import {
  DataTable,
  TableActions,
  TableBadge,
  TableRowActions,
  type TableBadgeTone,
  type TableColumn,
  type TableSortDirection,
} from '@/components/UI/table';
import mockCommunicationsData from '@/data/mockCommunications.json';
import mockRoundsData from '@/data/mockSecurityRounds.json';
import mockUsersData from '@/data/mockUsers.json';
import type { AdminUser } from '@/types/adminUser';
import type {
  Communication,
  CommunicationAudience,
  CommunicationMediaKind,
  CommunicationPriority,
  CommunicationStatus,
  CommunicationType,
} from '@/types/communication';
import {
  COMMUNICATION_AUDIENCE_LABEL,
  COMMUNICATION_MEDIA_LABEL,
  COMMUNICATION_PRIORITY_LABEL,
  COMMUNICATION_SCOPE_LABEL,
  COMMUNICATION_STATUS_LABEL,
  COMMUNICATION_TYPE_LABEL,
  formatCommunicationDate,
  getCommunicationCover,
  getCommunicationDirectedTo,
} from '@/types/communication';
import type { SecurityRound } from '@/types/securityParametrization';
import {
  ConfirmModalContent,
  ConfirmModalFooter,
  PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  RegistryDetailField,
  RegistryFormField,
  inputClassName,
  inputErrorClassName,
  nextRecordId,
  type DrawerMode,
} from '@/pages/adminRegistryShared';

type TypeTab = 'all' | CommunicationType;

const AUDIENCE_OPTIONS: CommunicationAudience[] = ['todos', 'residentes', 'personal', 'administracion'];
const INTERNAL_AUDIENCE_OPTIONS: CommunicationAudience[] = ['todos', 'personal', 'administracion'];
const PRIORITY_OPTIONS: CommunicationPriority[] = ['baja', 'media', 'alta'];
const STATUS_OPTIONS: CommunicationStatus[] = ['borrador', 'publicado', 'archivado'];

const typeToneMap: Record<CommunicationType, TableBadgeTone> = {
  noticia: 'info',
  mensaje_puesto: 'warning',
  mensaje_usuario: 'primary',
};

const priorityToneMap: Record<CommunicationPriority, TableBadgeTone> = {
  baja: 'neutral',
  media: 'info',
  alta: 'danger',
};

const statusToneMap: Record<CommunicationStatus, TableBadgeTone> = {
  borrador: 'neutral',
  publicado: 'success',
  archivado: 'warning',
};

function nowTimestamp() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function createEmptyCommunication(): Communication {
  return {
    id: '',
    tipo: 'noticia',
    titulo: '',
    contenido: '',
    autor: '',
    alcance: 'cliente',
    cliente: '',
    sede: '',
    audiencia: 'todos',
    puestos: [],
    destinatarioId: '',
    destinatarioNombre: '',
    prioridad: 'media',
    estado: 'borrador',
    requiereAcuse: false,
    publishedAt: '',
    mediaKind: 'ninguna',
    banner: '',
    carrusel: [],
    archivos: [],
  };
}

function validateCommunication(draft: Communication): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!draft.titulo.trim()) errors.titulo = 'Este campo es requerido';
  if (!draft.contenido.trim()) errors.contenido = 'Este campo es requerido';
  if (!draft.autor.trim()) errors.autor = 'Este campo es requerido';
  if (draft.alcance === 'cliente' && !draft.cliente.trim()) {
    errors.cliente = 'Seleccione un cliente';
  }
  if (draft.tipo === 'mensaje_puesto' && draft.puestos.length === 0) {
    errors.puestos = 'Seleccione al menos un puesto';
  }
  if (draft.tipo === 'mensaje_usuario' && !draft.destinatarioId) {
    errors.destinatarioId = 'Seleccione un usuario';
  }
  if (draft.mediaKind === 'banner' && !draft.banner) {
    errors.banner = 'Cargue una imagen de banner';
  }
  if (draft.mediaKind === 'carrusel' && draft.carrusel.length === 0) {
    errors.carrusel = 'Cargue al menos una imagen para el carrusel';
  }

  return errors;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function CommunicationCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  if (images.length === 0) return null;

  const current = Math.min(index, images.length - 1);
  const goPrev = () => setIndex((value) => (value === 0 ? images.length - 1 : value - 1));
  const goNext = () => setIndex((value) => (value === images.length - 1 ? 0 : value + 1));

  return (
    <div className="relative overflow-hidden rounded-xl border border-border">
      <img src={images[current]} alt={`Imagen ${current + 1}`} className="h-48 w-full object-cover" />
      {images.length > 1 ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            aria-label="Imagen siguiente"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                onClick={() => setIndex(dotIndex)}
                className={`h-1.5 rounded-full transition-all ${
                  dotIndex === current ? 'w-5 bg-white' : 'w-1.5 bg-white/60'
                }`}
                aria-label={`Ir a imagen ${dotIndex + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function CommunicationFilesList({
  files,
  editing,
  onRemove,
}: {
  files: Communication['archivos'];
  editing?: boolean;
  onRemove?: (id: string) => void;
}) {
  if (files.length === 0) {
    return <p className="text-sm text-subtle">Sin archivos adjuntos</p>;
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 py-2"
        >
          <div className="flex min-w-0 items-center gap-2">
            <FileText size={16} className="shrink-0 text-subtle" />
            <span className="truncate text-sm font-medium text-foreground">{file.nombre}</span>
          </div>
          {editing && onRemove ? (
            <button
              type="button"
              onClick={() => onRemove(file.id)}
              className="rounded-lg p-1.5 text-subtle hover:bg-muted hover:text-red-500"
              title="Quitar archivo"
            >
              <Trash2 size={14} />
            </button>
          ) : file.url ? (
            <a
              href={file.url}
              download={file.nombre}
              className="rounded-lg p-1.5 text-subtle hover:bg-muted hover:text-foreground"
              title="Descargar"
            >
              <Download size={14} />
            </a>
          ) : (
            <span className="text-[11px] font-medium text-subtle">Adjunto</span>
          )}
        </div>
      ))}
    </div>
  );
}

function OptionCard({
  selected,
  title,
  description,
  icon,
  onClick,
}: {
  selected: boolean;
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${
        selected
          ? 'border-brand bg-brand/5 ring-2 ring-brand/10'
          : 'border-border bg-surface hover:bg-muted'
      }`}
    >
      <EmphasisIcon tone={selected ? 'brand' : 'neutral'} size="sm">
        {icon}
      </EmphasisIcon>
      <span>
        <span className="block text-sm font-semibold text-foreground">{title}</span>
        <span className="mt-0.5 block text-xs text-subtle">{description}</span>
      </span>
    </button>
  );
}

function CommunicationDetailsContent({
  item,
  editing,
  draft,
  errors,
  creating = false,
  clienteOptions,
  sedeOptions,
  puestoOptions,
  users,
  onDraftChange,
}: {
  item: Communication;
  editing: boolean;
  draft: Communication;
  errors: Record<string, string>;
  creating?: boolean;
  clienteOptions: string[];
  sedeOptions: string[];
  puestoOptions: string[];
  users: AdminUser[];
  onDraftChange: (draft: Communication) => void;
}) {
  const display = editing ? draft : item;
  const selectedUser = users.find((user) => user.id === draft.destinatarioId) ?? null;
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const carouselInputRef = useRef<HTMLInputElement>(null);
  const filesInputRef = useRef<HTMLInputElement>(null);

  const updateDraft = (patch: Partial<Communication>) => {
    const next = { ...draft, ...patch };
    if (patch.tipo === 'noticia') {
      next.puestos = [];
      next.destinatarioId = '';
      next.destinatarioNombre = '';
      next.requiereAcuse = false;
    }
    if (patch.tipo === 'mensaje_puesto') {
      next.audiencia = 'personal';
      next.destinatarioId = '';
      next.destinatarioNombre = '';
      next.requiereAcuse = true;
    }
    if (patch.tipo === 'mensaje_usuario') {
      next.puestos = [];
      next.audiencia = 'personal';
      next.requiereAcuse = true;
    }
    if (patch.alcance === 'interno') {
      next.cliente = '';
      if (next.audiencia === 'residentes') next.audiencia = 'personal';
    }
    onDraftChange(next);
  };

  const selectUser = (userId: string) => {
    const user = users.find((itemUser) => itemUser.id === userId);
    updateDraft({
      destinatarioId: userId,
      destinatarioNombre: user?.nombre ?? '',
      cliente: draft.alcance === 'cliente' ? user?.cliente || draft.cliente : '',
      sede: user?.sede || user?.estructura || draft.sede,
    });
  };

  const togglePuesto = (puesto: string) => {
    const selected = draft.puestos.includes(puesto)
      ? draft.puestos.filter((itemName) => itemName !== puesto)
      : [...draft.puestos, puesto];
    updateDraft({ puestos: selected });
  };

  const handleBannerChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;
    const url = await readFileAsDataUrl(file);
    updateDraft({ banner: url, mediaKind: 'banner' });
  };

  const handleCarouselChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith('image/'));
    event.target.value = '';
    if (files.length === 0) return;
    const urls = await Promise.all(files.map((file) => readFileAsDataUrl(file)));
    updateDraft({ carrusel: [...draft.carrusel, ...urls], mediaKind: 'carrusel' });
  };

  const handleFilesChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;
    const startId = draft.archivos.reduce(
      (max, file) => Math.max(max, Number.parseInt(file.id, 10) || 0),
      0,
    );
    const nextFiles = await Promise.all(
      files.map(async (file, index) => ({
        id: String(startId + index + 1),
        nombre: file.name,
        url: await readFileAsDataUrl(file),
        tipo: file.type || 'application/octet-stream',
      })),
    );
    updateDraft({ archivos: [...draft.archivos, ...nextFiles] });
  };

  return (
    <div className="space-y-5">
      {editing ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <OptionCard
            selected={draft.tipo === 'noticia'}
            title="Noticia"
            description="Comunicado general para residentes o personal"
            icon={<Newspaper size={15} />}
            onClick={() => updateDraft({ tipo: 'noticia' })}
          />
          <OptionCard
            selected={draft.tipo === 'mensaje_puesto'}
            title="Mensaje a puestos"
            description="Instrucción operativa para puestos de vigilancia"
            icon={<Radio size={15} />}
            onClick={() => updateDraft({ tipo: 'mensaje_puesto' })}
          />
          <OptionCard
            selected={draft.tipo === 'mensaje_usuario'}
            title="Mensaje directo"
            description="Mensaje privado a un usuario específico"
            icon={<UserRound size={15} />}
            onClick={() => updateDraft({ tipo: 'mensaje_usuario' })}
          />
        </div>
      ) : (
        <Surface variant="muted" padding="lg">
          <div className="flex flex-wrap items-center gap-2">
            {creating ? <TableBadge tone="primary">Nuevo</TableBadge> : null}
            <TableBadge tone={typeToneMap[display.tipo]}>{COMMUNICATION_TYPE_LABEL[display.tipo]}</TableBadge>
            <TableBadge tone={priorityToneMap[display.prioridad]}>
              {COMMUNICATION_PRIORITY_LABEL[display.prioridad]}
            </TableBadge>
            <TableBadge tone={display.alcance === 'interno' ? 'primary' : 'info'}>
              {COMMUNICATION_SCOPE_LABEL[display.alcance]}
            </TableBadge>
            <TableBadge tone={statusToneMap[display.estado]}>
              {COMMUNICATION_STATUS_LABEL[display.estado]}
            </TableBadge>
          </div>
          <p className="mt-3 text-sm font-semibold text-foreground">{display.titulo}</p>
          <p className="mt-1 text-sm text-subtle">
            {getCommunicationDirectedTo(display)}
            {display.sede ? ` · ${display.sede}` : ''}
          </p>
        </Surface>
      )}

      {editing ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RegistryFormField label="Título" required error={errors.titulo} className="sm:col-span-2">
            <input
              type="text"
              value={draft.titulo}
              onChange={(event) => updateDraft({ titulo: event.target.value })}
              className={errors.titulo ? inputErrorClassName : inputClassName}
              placeholder={
                draft.tipo === 'noticia'
                  ? 'Título de la noticia'
                  : draft.tipo === 'mensaje_usuario'
                    ? 'Asunto del mensaje directo'
                    : 'Asunto del mensaje a puestos'
              }
            />
          </RegistryFormField>
          <RegistryFormField label="Contenido" required error={errors.contenido} className="sm:col-span-2">
            <textarea
              value={draft.contenido}
              onChange={(event) => updateDraft({ contenido: event.target.value })}
              rows={4}
              className={`${errors.contenido ? inputErrorClassName : inputClassName} resize-none`}
              placeholder="Escriba el comunicado..."
            />
          </RegistryFormField>
          <RegistryFormField label="Autor" required error={errors.autor}>
            <input
              type="text"
              value={draft.autor}
              onChange={(event) => updateDraft({ autor: event.target.value })}
              className={errors.autor ? inputErrorClassName : inputClassName}
            />
          </RegistryFormField>
          <div className="sm:col-span-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <OptionCard
              selected={draft.alcance === 'interno'}
              title="Equipo interno"
              description="Comunicado para el personal de la empresa"
              icon={<Users size={15} />}
              onClick={() => updateDraft({ alcance: 'interno' })}
            />
            <OptionCard
              selected={draft.alcance === 'cliente'}
              title="Cliente"
              description="Comunicado para un cliente o su sede"
              icon={<Building2 size={15} />}
              onClick={() => updateDraft({ alcance: 'cliente' })}
            />
          </div>
          {draft.alcance === 'cliente' ? (
            <RegistryFormField label="Cliente" required error={errors.cliente}>
              <SearchableSelect
                value={draft.cliente}
                options={clienteOptions.map((cliente) => ({ label: cliente, value: cliente }))}
                placeholder="Seleccionar cliente"
                searchPlaceholder="Buscar cliente..."
                emptyOptionLabel="Seleccionar"
                onChange={(value) => updateDraft({ cliente: value })}
              />
            </RegistryFormField>
          ) : (
            <RegistryFormField label="Dirigido a">
              <div className={`${inputClassName} flex items-center text-subtle`}>Equipo interno</div>
            </RegistryFormField>
          )}
          <RegistryFormField label="Sede">
            <SearchableSelect
              value={draft.sede}
              options={sedeOptions.map((sede) => ({ label: sede, value: sede }))}
              placeholder="Seleccionar sede"
              searchPlaceholder="Buscar sede..."
              emptyOptionLabel="Sin sede"
              onChange={(value) => updateDraft({ sede: value })}
            />
          </RegistryFormField>
          <RegistryFormField label="Prioridad">
            <SearchableSelect
              value={draft.prioridad}
              options={PRIORITY_OPTIONS.map((priority) => ({
                label: COMMUNICATION_PRIORITY_LABEL[priority],
                value: priority,
              }))}
              placeholder="Seleccionar prioridad"
              searchPlaceholder="Buscar..."
              emptyOptionLabel="Seleccionar"
              onChange={(value) => updateDraft({ prioridad: value as CommunicationPriority })}
            />
          </RegistryFormField>
          {draft.tipo === 'noticia' ? (
            <RegistryFormField label="Audiencia" className="sm:col-span-2">
              <SearchableSelect
                value={draft.audiencia}
                options={(draft.alcance === 'interno' ? INTERNAL_AUDIENCE_OPTIONS : AUDIENCE_OPTIONS).map(
                  (audience) => ({
                    label: COMMUNICATION_AUDIENCE_LABEL[audience],
                    value: audience,
                  }),
                )}
                placeholder="Seleccionar audiencia"
                searchPlaceholder="Buscar..."
                emptyOptionLabel="Seleccionar"
                onChange={(value) => updateDraft({ audiencia: value as CommunicationAudience })}
              />
            </RegistryFormField>
          ) : null}
          {draft.tipo === 'mensaje_puesto' ? (
            <RegistryFormField label="Puestos destino" required error={errors.puestos} className="sm:col-span-2">
              <div className="flex flex-wrap gap-2">
                {puestoOptions.map((puesto) => {
                  const selected = draft.puestos.includes(puesto);
                  return (
                    <button
                      key={puesto}
                      type="button"
                      onClick={() => togglePuesto(puesto)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        selected
                          ? 'border-brand bg-brand/10 text-brand'
                          : 'border-border bg-surface text-subtle hover:bg-muted'
                      }`}
                    >
                      {puesto}
                    </button>
                  );
                })}
              </div>
            </RegistryFormField>
          ) : null}
          {draft.tipo === 'mensaje_usuario' ? (
            <RegistryFormField label="Usuario destino" required error={errors.destinatarioId} className="sm:col-span-2">
              <SearchableSelect
                value={draft.destinatarioId}
                options={users
                  .filter((user) => user.activo || user.id === draft.destinatarioId)
                  .map((user) => ({
                    label: `${user.nombre} · ${user.perfil}`,
                    value: user.id,
                  }))}
                placeholder="Seleccionar usuario"
                searchPlaceholder="Buscar por nombre o perfil..."
                emptyOptionLabel="Seleccionar"
                onChange={selectUser}
              />
              {selectedUser ? (
                <p className="mt-2 text-xs text-subtle">
                  {selectedUser.cargo} · {selectedUser.cliente} · {selectedUser.email}
                </p>
              ) : null}
            </RegistryFormField>
          ) : null}
          <RegistryFormField label="Estado">
            <SearchableSelect
              value={draft.estado}
              options={STATUS_OPTIONS.map((status) => ({
                label: COMMUNICATION_STATUS_LABEL[status],
                value: status,
              }))}
              placeholder="Seleccionar estado"
              searchPlaceholder="Buscar..."
              emptyOptionLabel="Seleccionar"
              onChange={(value) => updateDraft({ estado: value as CommunicationStatus })}
            />
          </RegistryFormField>
          {draft.tipo === 'mensaje_puesto' || draft.tipo === 'mensaje_usuario' ? (
            <RegistryFormField label="Requiere acuse de recibo">
              <div className="flex h-[42px] items-center">
                <Switch
                  checked={draft.requiereAcuse}
                  onChange={(checked) => updateDraft({ requiereAcuse: checked })}
                  aria-label="Requiere acuse de recibo"
                />
              </div>
            </RegistryFormField>
          ) : null}

          <div className="sm:col-span-2 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-subtle">Imagen</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <OptionCard
                selected={draft.mediaKind === 'ninguna'}
                title="Sin imagen"
                description="Solo texto y archivos"
                icon={<FileText size={15} />}
                onClick={() => updateDraft({ mediaKind: 'ninguna' })}
              />
              <OptionCard
                selected={draft.mediaKind === 'banner'}
                title="Banner"
                description="Una imagen horizontal"
                icon={<ImagePlus size={15} />}
                onClick={() => updateDraft({ mediaKind: 'banner' })}
              />
              <OptionCard
                selected={draft.mediaKind === 'carrusel'}
                title="Carrusel"
                description="Varias imágenes deslizables"
                icon={<Images size={15} />}
                onClick={() => updateDraft({ mediaKind: 'carrusel' })}
              />
            </div>
          </div>

          {draft.mediaKind === 'banner' ? (
            <RegistryFormField label="Banner" required error={errors.banner} className="sm:col-span-2">
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={handleBannerChange}
              />
              {draft.banner ? (
                <div className="relative overflow-hidden rounded-xl border border-border">
                  <img src={draft.banner} alt="Banner" className="h-40 w-full object-cover" />
                  <div className="absolute right-2 top-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      className="rounded-lg bg-black/55 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black/70"
                    >
                      Cambiar
                    </button>
                    <button
                      type="button"
                      onClick={() => updateDraft({ banner: '' })}
                      className="rounded-lg bg-black/55 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black/70"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 text-subtle hover:bg-muted"
                >
                  <ImagePlus size={22} />
                  <span className="text-sm font-semibold">Cargar banner</span>
                  <span className="text-xs">PNG, JPG o WEBP</span>
                </button>
              )}
            </RegistryFormField>
          ) : null}

          {draft.mediaKind === 'carrusel' ? (
            <RegistryFormField label="Imágenes del carrusel" required error={errors.carrusel} className="sm:col-span-2">
              <input
                ref={carouselInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                multiple
                className="hidden"
                onChange={handleCarouselChange}
              />
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {draft.carrusel.map((image, imageIndex) => (
                  <div key={`${imageIndex}-${image.slice(-12)}`} className="relative overflow-hidden rounded-xl border border-border">
                    <img src={image} alt={`Carrusel ${imageIndex + 1}`} className="h-24 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        updateDraft({
                          carrusel: draft.carrusel.filter((_, index) => index !== imageIndex),
                        })
                      }
                      className="absolute right-1.5 top-1.5 rounded-full bg-black/55 p-1 text-white hover:bg-black/70"
                      title="Quitar imagen"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => carouselInputRef.current?.click()}
                  className="flex h-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-muted/40 text-subtle hover:bg-muted"
                >
                  <Plus size={18} />
                  <span className="text-xs font-semibold">Agregar</span>
                </button>
              </div>
            </RegistryFormField>
          ) : null}

          <RegistryFormField label="Archivos adjuntos" className="sm:col-span-2">
            <input
              ref={filesInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFilesChange}
            />
            <CommunicationFilesList
              files={draft.archivos}
              editing
              onRemove={(id) => updateDraft({ archivos: draft.archivos.filter((file) => file.id !== id) })}
            />
            <button
              type="button"
              onClick={() => filesInputRef.current?.click()}
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              <Paperclip size={15} />
              Adjuntar archivos
            </button>
          </RegistryFormField>
        </div>
      ) : (
        <>
          {item.mediaKind === 'banner' && item.banner ? (
            <img src={item.banner} alt={item.titulo} className="h-44 w-full rounded-xl border border-border object-cover" />
          ) : null}
          {item.mediaKind === 'carrusel' && item.carrusel.length > 0 ? (
            <CommunicationCarousel images={item.carrusel} />
          ) : null}
          <Surface variant="muted" padding="lg">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-subtle">Contenido</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">{item.contenido}</p>
          </Surface>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <RegistryDetailField label="Autor" value={item.autor} />
            <RegistryDetailField label="Alcance" value={COMMUNICATION_SCOPE_LABEL[item.alcance]} />
            <RegistryDetailField
              label={item.alcance === 'interno' ? 'Dirigido a' : 'Cliente'}
              value={getCommunicationDirectedTo(item)}
            />
            <RegistryDetailField label="Sede" value={item.sede || '—'} />
            {item.tipo === 'noticia' ? (
              <RegistryDetailField label="Audiencia" value={COMMUNICATION_AUDIENCE_LABEL[item.audiencia]} />
            ) : null}
            {item.tipo === 'mensaje_puesto' ? (
              <RegistryDetailField
                label="Puestos"
                value={item.puestos.length ? item.puestos.join(' · ') : '—'}
              />
            ) : null}
            {item.tipo === 'mensaje_usuario' ? (
              <RegistryDetailField label="Usuario destino" value={item.destinatarioNombre || '—'} />
            ) : null}
            <RegistryDetailField label="Publicación" value={formatCommunicationDate(item.publishedAt)} />
            {item.tipo === 'mensaje_puesto' || item.tipo === 'mensaje_usuario' ? (
              <RegistryDetailField label="Acuse de recibo" value={item.requiereAcuse ? 'Requerido' : 'No requerido'} />
            ) : null}
            <RegistryDetailField label="Imagen" value={COMMUNICATION_MEDIA_LABEL[item.mediaKind]} />
          </div>
          <Surface variant="muted" padding="lg">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-subtle">Archivos</p>
            <CommunicationFilesList files={item.archivos} />
          </Surface>
        </>
      )}
    </div>
  );
}

export default function CommunicationsPage() {
  const rounds = mockRoundsData as SecurityRound[];
  const users = useMemo(() => mockUsersData as AdminUser[], []);
  const [items, setItems] = useState<Communication[]>(mockCommunicationsData as Communication[]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | null>('publishedAt');
  const [sortDirection, setSortDirection] = useState<TableSortDirection>('desc');
  const [typeTab, setTypeTab] = useState<TypeTab>('all');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [alcanceFilter, setAlcanceFilter] = useState('');
  const [clienteFilter, setClienteFilter] = useState('');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('detail');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Communication | null>(null);
  const [draft, setDraft] = useState<Communication | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState<Communication | null>(null);

  const clienteOptions = useMemo(
    () =>
      [...new Set([...items.map((item) => item.cliente).filter(Boolean), ...rounds.map((round) => round.cliente)])].sort(),
    [items, rounds],
  );
  const sedeOptions = useMemo(
    () => [...new Set([...items.map((item) => item.sede).filter(Boolean), ...rounds.map((round) => round.sede)])].sort(),
    [items, rounds],
  );
  const puestoOptions = useMemo(
    () => [...new Set(rounds.flatMap((round) => round.puntos))].sort(),
    [rounds],
  );

  const stats = useMemo(
    () => ({
      total: items.length,
      noticias: items.filter((item) => item.tipo === 'noticia').length,
      mensajes: items.filter((item) => item.tipo === 'mensaje_puesto').length,
      directos: items.filter((item) => item.tipo === 'mensaje_usuario').length,
    }),
    [items],
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesType = typeTab === 'all' || item.tipo === typeTab;
      const matchesStatus = !statusFilter || item.estado === statusFilter;
      const matchesPriority = !priorityFilter || item.prioridad === priorityFilter;
      const matchesAlcance = !alcanceFilter || item.alcance === alcanceFilter;
      const matchesCliente = !clienteFilter || item.cliente === clienteFilter;
      const matchesSearch =
        !query ||
        item.titulo.toLowerCase().includes(query) ||
        item.contenido.toLowerCase().includes(query) ||
        item.autor.toLowerCase().includes(query) ||
        item.destinatarioNombre.toLowerCase().includes(query) ||
        getCommunicationDirectedTo(item).toLowerCase().includes(query) ||
        item.puestos.some((puesto) => puesto.toLowerCase().includes(query));

      return matchesType && matchesStatus && matchesPriority && matchesAlcance && matchesCliente && matchesSearch;
    });
  }, [alcanceFilter, clienteFilter, items, priorityFilter, search, statusFilter, typeTab]);

  const sortedItems = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredItems;

    return [...filteredItems].sort((a, b) => {
      const left = String(a[sortKey as keyof Communication] ?? '').toLowerCase();
      const right = String(b[sortKey as keyof Communication] ?? '').toLowerCase();
      if (left < right) return sortDirection === 'asc' ? -1 : 1;
      if (left > right) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredItems, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedItems.slice(start, start + pageSize);
  }, [currentPage, pageSize, sortedItems]);

  const resetPage = () => setPage(1);

  const openDetailDrawer = (item: Communication) => {
    setDrawerMode('detail');
    setSelectedItem(item);
    setIsEditing(false);
    setDraft(null);
    setFormErrors({});
    setDrawerOpen(true);
  };

  const openCreateDrawer = () => {
    const next = createEmptyCommunication();
    if (typeTab === 'mensaje_puesto') {
      next.tipo = 'mensaje_puesto';
      next.audiencia = 'personal';
      next.requiereAcuse = true;
    }
    if (typeTab === 'mensaje_usuario') {
      next.tipo = 'mensaje_usuario';
      next.audiencia = 'personal';
      next.requiereAcuse = true;
    }
    setDrawerMode('create');
    setSelectedItem(null);
    setIsEditing(true);
    setDraft(next);
    setFormErrors({});
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerMode('detail');
    setSelectedItem(null);
    setIsEditing(false);
    setDraft(null);
    setFormErrors({});
  };

  const startEditing = () => {
    if (!selectedItem) return;
    setDraft({ ...selectedItem });
    setFormErrors({});
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setDraft(null);
    setFormErrors({});
  };

  const persistDraft = (currentDraft: Communication): Communication => {
    const publishedAt =
      currentDraft.estado === 'publicado'
        ? currentDraft.publishedAt || nowTimestamp()
        : currentDraft.publishedAt;

    return { ...currentDraft, publishedAt };
  };

  const saveEditing = () => {
    if (!draft || !selectedItem) return;
    const errors = validateCommunication(draft);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const updated = persistDraft(draft);
    setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    setSelectedItem(updated);
    setIsEditing(false);
    setDraft(null);
    setFormErrors({});
  };

  const saveCreate = () => {
    if (!draft || drawerMode !== 'create') return;
    const errors = validateCommunication(draft);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const created = persistDraft({
      ...draft,
      id: nextRecordId(items.map((item) => item.id)),
    });

    setItems((current) => [created, ...current]);
    closeDrawer();
    openDetailDrawer(created);
  };

  const confirmDeleteItem = () => {
    if (!confirmDelete) return;
    setItems((current) => current.filter((item) => item.id !== confirmDelete.id));
    if (selectedItem?.id === confirmDelete.id) closeDrawer();
    setConfirmDelete(null);
  };

  const columns: TableColumn<Communication>[] = [
    {
      key: 'cover',
      label: 'Imagen',
      width: '88px',
      render: (item) => {
        const cover = getCommunicationCover(item);
        if (!cover) {
          return (
            <div className="flex h-10 w-16 items-center justify-center rounded-lg border border-border bg-muted text-subtle">
              {item.archivos.length > 0 ? <Paperclip size={14} /> : <ImagePlus size={14} />}
            </div>
          );
        }
        return (
          <img
            src={cover}
            alt={item.titulo}
            className="h-10 w-16 rounded-lg border border-border object-cover"
          />
        );
      },
    },
    {
      key: 'tipo',
      label: 'Tipo',
      sortable: true,
      width: '160px',
      render: (item) => (
        <TableBadge tone={typeToneMap[item.tipo]}>{COMMUNICATION_TYPE_LABEL[item.tipo]}</TableBadge>
      ),
    },
    { key: 'titulo', label: 'Título', sortable: true, width: '240px' },
    {
      key: 'alcance',
      label: 'Alcance',
      sortable: true,
      width: '140px',
      render: (item) => (
        <TableBadge tone={item.alcance === 'interno' ? 'primary' : 'info'}>
          {COMMUNICATION_SCOPE_LABEL[item.alcance]}
        </TableBadge>
      ),
    },
    {
      key: 'cliente',
      label: 'Dirigido a',
      sortable: true,
      width: '180px',
      render: (item) => getCommunicationDirectedTo(item),
    },
    {
      key: 'destino',
      label: 'Destino',
      width: '200px',
      render: (item) => {
        if (item.tipo === 'mensaje_puesto') return item.puestos.join(' · ') || '—';
        if (item.tipo === 'mensaje_usuario') return item.destinatarioNombre || '—';
        return COMMUNICATION_AUDIENCE_LABEL[item.audiencia];
      },
    },
    {
      key: 'prioridad',
      label: 'Prioridad',
      sortable: true,
      width: '110px',
      render: (item) => (
        <TableBadge tone={priorityToneMap[item.prioridad]}>
          {COMMUNICATION_PRIORITY_LABEL[item.prioridad]}
        </TableBadge>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      sortable: true,
      width: '120px',
      render: (item) => (
        <TableBadge tone={statusToneMap[item.estado]}>
          {COMMUNICATION_STATUS_LABEL[item.estado]}
        </TableBadge>
      ),
    },
    { key: 'autor', label: 'Autor', sortable: true, width: '150px' },
    {
      key: 'publishedAt',
      label: 'Publicación',
      sortable: true,
      width: '150px',
      render: (item) => formatCommunicationDate(item.publishedAt),
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: '120px',
      align: 'right',
      render: (item) => (
        <TableRowActions
          items={[
            {
              label: 'Editar',
              icon: Pencil,
              tooltip: 'Editar comunicación',
              onClick: () => openDetailDrawer(item),
            },
            {
              label: 'Eliminar',
              icon: Trash2,
              tooltip: 'Eliminar comunicación',
              variant: 'danger',
              onClick: () => setConfirmDelete(item),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="page-shell pb-6">
        <DataTable
          title="Comunicaciones"
          subtitle="Comunicados para el equipo interno o para un cliente, con noticias, puestos y mensajes directos."
          columns={columns}
          data={paginatedItems}
          onRowClick={openDetailDrawer}
          tabs={[
            { id: 'all', label: 'Todas', count: stats.total, badgeTone: 'neutral' },
            { id: 'noticia', label: 'Noticias', count: stats.noticias, badgeTone: 'info' },
            { id: 'mensaje_puesto', label: 'Mensaje a puestos', count: stats.mensajes, badgeTone: 'warning' },
            { id: 'mensaje_usuario', label: 'Mensaje directo', count: stats.directos, badgeTone: 'primary' },
          ]}
          activeTab={typeTab}
          onTabChange={(tabId) => {
            setTypeTab(tabId as TypeTab);
            resetPage();
          }}
          headerSlot={
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Total', value: stats.total, icon: <Megaphone size={15} />, tone: 'brand' as const },
                { label: 'Noticias', value: stats.noticias, icon: <Newspaper size={15} />, tone: 'info' as const },
                {
                  label: 'Mensajes a puestos',
                  value: stats.mensajes,
                  icon: <Radio size={15} />,
                  tone: 'warning' as const,
                },
                {
                  label: 'Mensajes directos',
                  value: stats.directos,
                  icon: <UserRound size={15} />,
                  tone: 'primary' as const,
                },
              ].map((stat) => (
                <Surface key={stat.label} padding="sm" radius="lg" interactive className="flex items-center gap-3">
                  <EmphasisIcon tone={stat.tone} size="sm">
                    {stat.icon}
                  </EmphasisIcon>
                  <div className="min-w-0">
                    <p className="text-lg font-bold leading-none text-foreground">{stat.value}</p>
                    <p className="mt-1 text-[11px] font-medium text-subtle">{stat.label}</p>
                  </div>
                </Surface>
              ))}
            </div>
          }
          searchValue={search}
          searchPlaceholder="Buscar por título, usuario, autor o puesto..."
          onSearchChange={(value) => {
            setSearch(value);
            resetPage();
          }}
          filters={[
            {
              id: 'estado',
              label: 'Estado',
              type: 'select',
              value: statusFilter,
              options: STATUS_OPTIONS.map((status) => ({
                label: COMMUNICATION_STATUS_LABEL[status],
                value: status,
              })),
              onChange: (value) => {
                setStatusFilter(value);
                resetPage();
              },
            },
            {
              id: 'prioridad',
              label: 'Prioridad',
              type: 'select',
              value: priorityFilter,
              options: PRIORITY_OPTIONS.map((priority) => ({
                label: COMMUNICATION_PRIORITY_LABEL[priority],
                value: priority,
              })),
              onChange: (value) => {
                setPriorityFilter(value);
                resetPage();
              },
            },
            {
              id: 'alcance',
              label: 'Alcance',
              type: 'select',
              value: alcanceFilter,
              options: [
                { label: COMMUNICATION_SCOPE_LABEL.interno, value: 'interno' },
                { label: COMMUNICATION_SCOPE_LABEL.cliente, value: 'cliente' },
              ],
              onChange: (value) => {
                setAlcanceFilter(value);
                if (value === 'interno') setClienteFilter('');
                resetPage();
              },
            },
            {
              id: 'cliente',
              label: 'Cliente',
              type: 'select',
              value: clienteFilter,
              options: clienteOptions.map((cliente) => ({ label: cliente, value: cliente })),
              onChange: (value) => {
                setClienteFilter(value);
                if (value) setAlcanceFilter('cliente');
                resetPage();
              },
            },
          ]}
          metaLabel={`Mostrando ${sortedItems.length} de ${items.length} comunicaciones`}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSortChange={(key, direction) => {
            setSortKey(direction ? key : null);
            setSortDirection(direction);
          }}
          actionItems={[
            {
              label: 'Exportar',
              icon: Download,
              tooltip: 'Exportar comunicaciones',
              onClick: () => undefined,
            },
            {
              label: 'Nueva comunicación',
              icon: Plus,
              tooltip: 'Crear noticia, mensaje a puestos o mensaje directo',
              variant: 'primary',
              showLabel: true,
              onClick: openCreateDrawer,
            },
          ]}
          pagination={{
            page: currentPage,
            pageSize,
            total: sortedItems.length,
            onPageChange: setPage,
            pageSizeOptions: [...PAGE_SIZE_OPTIONS],
            onPageSizeChange: (size: number) => {
              setPageSize(size);
              setPage(1);
            },
          }}
          emptyMessage="No hay comunicaciones con los filtros aplicados."
        />

        <Drawer
          open={drawerOpen}
          onClose={closeDrawer}
          title={drawerMode === 'create' ? 'Nueva comunicación' : 'Detalle de comunicación'}
          subtitle={
            drawerMode === 'create'
              ? 'Publique una noticia o un mensaje para el equipo interno o para un cliente.'
              : undefined
          }
          size="lg"
          footer={
            drawerMode === 'create' ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium text-subtle">Los campos marcados con * son obligatorios</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={saveCreate}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
                  >
                    <Plus size={16} />
                    Crear comunicación
                  </button>
                </div>
              </div>
            ) : selectedItem ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                {isEditing ? (
                  <>
                    <p className="text-sm font-medium text-subtle">Editando la comunicación</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={saveEditing}
                        className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
                      >
                        Guardar cambios
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <TableActions
                      items={[
                        { label: 'Editar', icon: Pencil, tooltip: 'Editar comunicación', onClick: startEditing },
                        {
                          label: 'Eliminar',
                          icon: Trash2,
                          tooltip: 'Eliminar comunicación',
                          variant: 'danger',
                          onClick: () => setConfirmDelete(selectedItem),
                        },
                      ]}
                    />
                    <button
                      type="button"
                      onClick={closeDrawer}
                      className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                    >
                      Cerrar
                    </button>
                  </>
                )}
              </div>
            ) : null
          }
        >
          {drawerMode === 'create' && draft ? (
            <CommunicationDetailsContent
              item={draft}
              editing
              creating
              draft={draft}
              errors={formErrors}
              clienteOptions={clienteOptions}
              sedeOptions={sedeOptions}
              puestoOptions={puestoOptions}
              users={users}
              onDraftChange={setDraft}
            />
          ) : selectedItem ? (
            <CommunicationDetailsContent
              item={selectedItem}
              editing={isEditing}
              draft={draft ?? selectedItem}
              errors={formErrors}
              clienteOptions={clienteOptions}
              sedeOptions={sedeOptions}
              puestoOptions={puestoOptions}
              users={users}
              onDraftChange={setDraft}
            />
          ) : null}
        </Drawer>

        <ModalDrawer
          open={Boolean(confirmDelete)}
          onClose={() => setConfirmDelete(null)}
          showCloseButton={false}
          size="sm"
          footer={
            <ConfirmModalFooter
              onCancel={() => setConfirmDelete(null)}
              onConfirm={confirmDeleteItem}
              confirmLabel="Eliminar"
              confirmIcon={<Trash2 size={18} />}
              confirmClassName="danger-confirm-btn"
            />
          }
        >
          {confirmDelete ? (
            <ConfirmModalContent
              icon={<Archive size={36} strokeWidth={1.75} />}
              iconClassName="danger-icon-badge"
            >
              <p className="text-base leading-relaxed text-subtle">
                ¿Está seguro de que desea eliminar{' '}
                <span className="font-semibold text-foreground">{confirmDelete.titulo}</span>? Esta acción no se
                puede deshacer.
              </p>
            </ConfirmModalContent>
          ) : null}
        </ModalDrawer>
      </div>
    </DashboardLayout>
  );
}
