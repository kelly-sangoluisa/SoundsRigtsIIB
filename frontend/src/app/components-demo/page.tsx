'use client';

import React, { useState } from 'react';
import {
  DashboardLayout,
  Input,
  Button,
  Select,
  Textarea,
  Modal,
  ModalContent,
  ModalFooter,
  SongCard,
  SongCardData
} from '@/shared/components';

export default function ComponentsDemo() {
  const [currentMode, setCurrentMode] = useState<'artist' | 'buyer'>('artist');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    description: ''
  });

  // Datos de ejemplo para la SongCard
  const exampleSong: SongCardData = {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'Elena Rodriguez',
    genre: 'Electronic',
    duration: 180, // 3 minutos
    status: 'published',
    price: 29.99,
    description: 'Una pieza atmosférica que combina elementos electrónicos con melodías ambient.',
    tags: ['electronic', 'ambient', 'chill'],
    licenseType: 'standard'
  };

  const genreOptions = [
    { value: 'electronic', label: 'Electrónica' },
    { value: 'rock', label: 'Rock' },
    { value: 'pop', label: 'Pop' },
    { value: 'jazz', label: 'Jazz' },
    { value: 'classical', label: 'Clásica' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout
      currentMode={currentMode}
      onModeChange={setCurrentMode}
      title="Demo de Componentes"
    >
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Demo de Componentes Reutilizables
          </h1>
          <p className="text-gray-600">
            Ejemplos de uso de todos los componentes del sistema de diseño.
          </p>
        </div>

        {/* SongCard Examples */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            SongCard Component
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Vista Completa</h3>
              <SongCard
                song={exampleSong}
                mode={currentMode}
                onPlay={(id) => console.log('Play:', id)}
                onEdit={(id) => console.log('Edit:', id)}
                onPurchase={(id) => console.log('Purchase:', id)}
                onViewDetails={(id) => console.log('View details:', id)}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Vista Compacta</h3>
              <div className="space-y-3">
                <SongCard
                  song={exampleSong}
                  mode={currentMode}
                  compact={true}
                  onPlay={(id) => console.log('Play:', id)}
                  onEdit={(id) => console.log('Edit:', id)}
                  onPurchase={(id) => console.log('Purchase:', id)}
                />
                <SongCard
                  song={{...exampleSong, id: '2', title: 'Ocean Waves', status: 'available'}}
                  mode={currentMode}
                  compact={true}
                  onPlay={(id) => console.log('Play:', id)}
                  onPurchase={(id) => console.log('Purchase:', id)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Form Components */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Componentes de Formulario
          </h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Título de la canción"
                  placeholder="Ingresa el título..."
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  leftIcon="🎵"
                  required
                />
                
                <Select
                  label="Género musical"
                  placeholder="Selecciona un género"
                  options={genreOptions}
                  value={formData.genre}
                  onChange={(e) => handleInputChange('genre', e.target.value)}
                  required
                />
              </div>
              
              <Textarea
                label="Descripción"
                placeholder="Describe tu canción..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
              
              <div className="flex space-x-3">
                <Button type="submit" variant="primary">
                  Guardar
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsModalOpen(true)}
                >
                  Abrir Modal
                </Button>
                <Button type="button" variant="ghost">
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </section>

        {/* Button Variants */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Variantes de Botones
          </h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button size="sm" variant="primary">Small</Button>
                <Button size="md" variant="primary">Medium</Button>
                <Button size="lg" variant="primary">Large</Button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" leftIcon="💾">Con Icono</Button>
                <Button variant="outline" rightIcon="→">Siguiente</Button>
                <Button variant="primary" loading>Cargando...</Button>
                <Button variant="primary" disabled>Deshabilitado</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Input Variants */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Variantes de Inputs
          </h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Default"
                placeholder="Input default"
                variant="default"
              />
              <Input
                label="Filled"
                placeholder="Input filled"
                variant="filled"
              />
              <Input
                label="Outlined"
                placeholder="Input outlined"
                variant="outlined"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Input
                label="Con error"
                placeholder="Input con error"
                error="Este campo es requerido"
              />
              <Input
                label="Con ayuda"
                placeholder="Input con ayuda"
                helperText="Texto de ayuda"
              />
              <Input
                label="Deshabilitado"
                placeholder="Input deshabilitado"
                disabled
              />
            </div>
          </div>
        </section>
      </div>

      {/* Modal Example */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ejemplo de Modal"
        size="md"
      >
        <ModalContent>
          <p className="mb-4">
            Este es un ejemplo de modal usando nuestro componente base.
          </p>
          <Input
            label="Campo de ejemplo"
            placeholder="Escribe algo..."
          />
        </ModalContent>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(false)}>
            Confirmar
          </Button>
        </ModalFooter>
      </Modal>
    </DashboardLayout>
  );
}
