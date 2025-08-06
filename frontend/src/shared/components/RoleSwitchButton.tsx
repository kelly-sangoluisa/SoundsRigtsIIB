import React from 'react';

interface RoleSwitchButtonProps {
  currentMode: 'artist' | 'buyer';
  onModeChange: (mode: 'artist' | 'buyer') => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RoleSwitchButton: React.FC<RoleSwitchButtonProps> = ({
  currentMode,
  onModeChange,
  disabled = false,
  size = 'md'
}) => {
  const handleSwitch = () => {
    const newMode = currentMode === 'artist' ? 'buyer' : 'artist';
    onModeChange(newMode);
  };

  const sizeClasses = {
    sm: 'h-6 w-11',
    md: 'h-7 w-12',
    lg: 'h-8 w-14'
  };

  const toggleSizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-5 w-5', 
    lg: 'h-6 w-6'
  };

  const translateClasses = {
    sm: currentMode === 'artist' ? 'translate-x-0' : 'translate-x-5',
    md: currentMode === 'artist' ? 'translate-x-0' : 'translate-x-5',
    lg: currentMode === 'artist' ? 'translate-x-0' : 'translate-x-6'
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Label del modo actual */}
      <span className="text-sm font-medium text-gray-700">
        {currentMode === 'artist' ? '🎤 Artista' : '🛒 Comprador'}
      </span>

      {/* Switch toggle */}
      <button
        type="button"
        onClick={handleSwitch}
        disabled={disabled}
        className={`
          relative inline-flex flex-shrink-0 border-2 border-transparent rounded-full cursor-pointer 
          transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
          focus:ring-blue-500 ${sizeClasses[size]}
          ${currentMode === 'artist' 
            ? 'bg-purple-600' 
            : 'bg-blue-600'
          }
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:opacity-80'
          }
        `}
        role="switch"
        aria-checked={currentMode === 'buyer'}
        aria-label={`Cambiar a modo ${currentMode === 'artist' ? 'comprador' : 'artista'}`}
      >
        <span
          className={`
            ${translateClasses[size]}
            pointer-events-none relative inline-block ${toggleSizeClasses[size]} rounded-full bg-white 
            shadow transform ring-0 transition ease-in-out duration-200
          `}
        >
          <span
            className={`
              absolute inset-0 h-full w-full flex items-center justify-center transition-opacity 
              ease-in duration-200 text-xs
              ${currentMode === 'artist' ? 'opacity-100' : 'opacity-0'}
            `}
            aria-hidden="true"
          >
            🎤
          </span>
          <span
            className={`
              absolute inset-0 h-full w-full flex items-center justify-center transition-opacity 
              ease-in duration-200 text-xs
              ${currentMode === 'buyer' ? 'opacity-100' : 'opacity-0'}
            `}
            aria-hidden="true"
          >
            🛒
          </span>
        </span>
      </button>

      {/* Indicador de estado */}
      <div className="flex flex-col">
        <span className="text-xs text-gray-500">
          Modo actual
        </span>
        <span className={`text-xs font-semibold ${
          currentMode === 'artist' ? 'text-purple-600' : 'text-blue-600'
        }`}>
          {currentMode === 'artist' ? 'Artista' : 'Comprador'}
        </span>
      </div>
    </div>
  );
};
