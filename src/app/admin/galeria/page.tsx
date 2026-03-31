export const dynamic = 'force-dynamic';

'use client';

import * as React from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Upload, Trash2, GripVertical, Images, Loader2, AlertCircle, Check } from 'lucide-react';
import { galeriaService } from '@/lib/firestore';
import { uploadToImgBB, validateImageFile } from '@/lib/imgbb';
import type { GaleriaFoto } from '@/types';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'done' | 'error';
  error?: string;
}

export default function GaleriaPage() {
  const [fotos, setFotos] = React.useState<GaleriaFoto[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState<UploadingFile[]>([]);
  const [isSavingOrder, setIsSavingOrder] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const unsub = galeriaService.subscribe((data) => {
      setFotos(data);
      setIsLoading(false);
    });
    return unsub;
  }, []);

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    const toUpload: UploadingFile[] = fileArray.map((f) => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      progress: 0,
      status: 'uploading',
    }));
    setUploading((prev) => [...prev, ...toUpload]);

    await Promise.all(
      fileArray.map(async (file, i) => {
        const uploadItem = toUpload[i];
        const validationError = validateImageFile(file);

        if (validationError) {
          setUploading((prev) =>
            prev.map((u) => u.id === uploadItem.id ? { ...u, status: 'error', error: validationError } : u)
          );
          return;
        }

        try {
          const result = await uploadToImgBB(file, (progress) => {
            setUploading((prev) =>
              prev.map((u) => u.id === uploadItem.id ? { ...u, progress } : u)
            );
          });

          const newFoto: Omit<GaleriaFoto, 'id'> = {
            url: result.url,
            thumb_url: result.thumb_url,
            titulo: file.name.replace(/\.[^.]+$/, ''),
            ordem: fotos.length + i,
            data_upload: new Date().toISOString(),
          };

          await galeriaService.add(newFoto);

          setUploading((prev) =>
            prev.map((u) => u.id === uploadItem.id ? { ...u, status: 'done', progress: 100 } : u)
          );
        } catch (err: any) {
          setUploading((prev) =>
            prev.map((u) => u.id === uploadItem.id ? { ...u, status: 'error', error: err.message } : u)
          );
        }
      })
    );

    // Clear completed after 2s
    setTimeout(() => {
      setUploading((prev) => prev.filter((u) => u.status !== 'done'));
    }, 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta foto da galeria?')) return;
    try {
      await galeriaService.delete(id);
      toast.success('Foto excluída.');
    } catch {
      toast.error('Erro ao excluir.');
    }
  };

  const handleReorder = (newOrder: GaleriaFoto[]) => {
    setFotos(newOrder);
  };

  const saveOrder = async () => {
    setIsSavingOrder(true);
    try {
      await galeriaService.updateOrdem(fotos);
      toast.success('Ordem salva!');
    } catch {
      toast.error('Erro ao salvar ordem.');
    } finally {
      setIsSavingOrder(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-brand-700 tracking-tighter">Galeria de Fotos</h1>
          <p className="text-brand-700/50 text-sm mt-1">{fotos.length} foto{fotos.length !== 1 ? 's' : ''} na galeria.</p>
        </div>
        {fotos.length > 1 && (
          <Button variant="outline" onClick={saveOrder} isLoading={isSavingOrder}>
            Salvar ordem
          </Button>
        )}
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-brand-700/20 rounded-3xl p-10 text-center bg-white hover:border-brand-700/40 hover:bg-cream/50 transition-all cursor-pointer group"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <Upload className="w-10 h-10 text-brand-700/30 group-hover:text-brand-700/60 transition-colors mx-auto mb-3" />
        <p className="font-bold text-brand-700/60 text-sm">Clique ou arraste fotos aqui</p>
        <p className="text-xs text-brand-700/30 mt-1">JPEG, PNG, WebP até 32MB. Múltiplas fotos suportadas.</p>
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploading.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {uploading.map((u) => (
              <div key={u.id} className="bg-white rounded-2xl p-4 border border-black/5 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium text-brand-700 truncate max-w-[240px]">{u.name}</p>
                    {u.status === 'done' && <Check className="w-4 h-4 text-accent shrink-0" />}
                    {u.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                    {u.status === 'uploading' && <Loader2 className="w-4 h-4 text-brand-700/40 animate-spin shrink-0" />}
                  </div>
                  {u.status === 'uploading' && (
                    <div className="w-full bg-cream rounded-full h-1.5">
                      <div
                        className="bg-brand-700 h-1.5 rounded-full transition-all"
                        style={{ width: `${u.progress}%` }}
                      />
                    </div>
                  )}
                  {u.status === 'error' && <p className="text-xs text-red-500">{u.error}</p>}
                  {u.status === 'done' && <p className="text-xs text-accent">Upload concluído!</p>}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-white animate-pulse border border-black/5" />
          ))}
        </div>
      ) : fotos.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-black/5">
          <Images className="w-12 h-12 text-brand-700/20 mx-auto mb-3" />
          <p className="text-brand-700/40 font-medium">Nenhuma foto na galeria ainda.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-brand-700/40 font-bold uppercase tracking-widest">
            Arraste para reordenar
          </p>
          <Reorder.Group axis="y" values={fotos} onReorder={handleReorder} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {fotos.map((foto) => (
              <Reorder.Item key={foto.id} value={foto} className="relative group aspect-square rounded-2xl overflow-hidden bg-cream cursor-grab active:cursor-grabbing border border-black/5">
                <img
                  src={foto.thumb_url || foto.url}
                  alt={foto.titulo || ''}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleDelete(foto.id!)}
                    className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center">
                    <GripVertical className="w-4 h-4" />
                  </div>
                </div>
                {foto.titulo && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium truncate">{foto.titulo}</p>
                  </div>
                )}
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </>
      )}
    </div>
  );
}
