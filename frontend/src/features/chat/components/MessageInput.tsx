'use client';

import { useState, useRef, KeyboardEvent } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isSending: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageInput = ({ 
  onSendMessage, 
  isSending, 
  disabled = false,
  placeholder = "Escribe tu mensaje..."
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isSending && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (value: string) => {
    setMessage(value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const isDisabled = disabled || isSending;
  const canSend = message.trim().length > 0 && !isDisabled;

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="flex items-end space-x-3">
        {/* Textarea para el mensaje */}
        <div className="flex-1">
          <label htmlFor="message-input" className="sr-only">
            Mensaje
          </label>
          <textarea
            ref={textareaRef}
            id="message-input"
            rows={1}
            value={message}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isDisabled}
            placeholder={placeholder}
            className="block w-full resize-none border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm min-h-[40px] max-h-32 overflow-y-auto disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              minHeight: '40px',
              maxHeight: '128px'
            }}
          />
          
          {/* Contador de caracteres */}
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Presiona Enter para enviar, Shift+Enter para nueva línea
            </p>
            {(() => {
              let colorClass = 'text-gray-400';
              if (message.length > 1000) {
                colorClass = 'text-red-500';
              } else if (message.length > 800) {
                colorClass = 'text-yellow-500';
              }
              return (
                <span className={`text-xs ${colorClass}`}>
                  {message.length}/1000
                </span>
              );
            })()}
          </div>
        </div>

        {/* Botón de enviar */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
            canSend
              ? 'text-white bg-blue-600 hover:bg-blue-700'
              : 'text-gray-400 bg-gray-200 dark:bg-gray-600 cursor-not-allowed'
          }`}
        >
          {isSending ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando...
            </>
          ) : (
            <>
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Enviar
            </>
          )}
        </button>
      </div>

      {/* Mensaje de error o límite de caracteres */}
      {message.length > 1000 && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400">
          ⚠️ El mensaje excede el límite de 1000 caracteres
        </div>
      )}
    </div>
  );
};
