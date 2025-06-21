import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Type, Move } from 'lucide-react';
import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
}

interface TextToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTextElementsChange: (elements: TextElement[]) => void;
}

const TextToolsModal: React.FC<TextToolsModalProps> = ({ isOpen, onClose, onTextElementsChange }) => {
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [newText, setNewText] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const addTextElement = () => {
    if (!newText.trim()) return;

    const newElement: TextElement = {
      id: Date.now().toString(),
      text: newText.trim(),
      x: Math.random() * 0.6 + 0.2, // Random position between 20% and 80%
      y: Math.random() * 0.6 + 0.2,
      fontSize,
      color: textColor,
    };

    const updatedElements = [...textElements, newElement];
    setTextElements(updatedElements);
    onTextElementsChange(updatedElements);
    setNewText('');
    
    // Close modal after adding text
    onClose();
  };

  const removeTextElement = (id: string) => {
    const updatedElements = textElements.filter(el => el.id !== id);
    setTextElements(updatedElements);
    onTextElementsChange(updatedElements);
  };

  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    const updatedElements = textElements.map(el =>
      el.id === id ? { ...el, ...updates } : el
    );
    setTextElements(updatedElements);
    onTextElementsChange(updatedElements);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Type className="w-4 h-4 text-white" />
            </div>
            Text Tools
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add Text Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Add New Text</h3>
            
            {/* Text Input */}
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Enter text..."
              className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              onKeyPress={(e) => e.key === 'Enter' && addTextElement()}
            />

            {/* Font Size and Color Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Size</label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full px-2 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                >
                  <option value={12}>12px</option>
                  <option value={14}>14px</option>
                  <option value={16}>16px</option>
                  <option value={18}>18px</option>
                  <option value={20}>20px</option>
                  <option value={24}>24px</option>
                  <option value={28}>28px</option>
                  <option value={32}>32px</option>
                  <option value={36}>36px</option>
                  <option value={40}>40px</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Color</label>
                <div className="relative">
                  <button
                    className="w-full h-9 rounded-md border border-input flex-shrink-0 hover:border-ring transition-colors"
                    style={{ backgroundColor: textColor }}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  />
                  {showColorPicker && (
                    <div className="absolute z-20 mt-1 right-0">
                      <div className="p-3 bg-background rounded-lg shadow-lg border">
                        <div className="w-48">
                          <HexColorPicker color={textColor} onChange={setTextColor} />
                        </div>
                        <div className="mt-3">
                          <input
                            type="text"
                            value={textColor}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                                setTextColor(value);
                              }
                            }}
                            placeholder="#000000"
                            className="w-full px-2 py-1 text-xs border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring font-mono"
                            maxLength={7}
                          />
                        </div>
                        <button
                          className="w-full mt-2 px-2 py-1 text-xs bg-muted rounded-md hover:bg-muted/80 transition-colors"
                          onClick={() => setShowColorPicker(false)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Add Button */}
            <Button
              onClick={addTextElement}
              disabled={!newText.trim()}
              className="w-full"
            >
              <Plus size={16} className="mr-2" />
              Add Text
            </Button>
          </div>

          {/* Text Elements List */}
          {textElements.length > 0 && (
            <div className="space-y-3 pt-4 border-t">
              <h3 className="text-sm font-semibold">Added Text Elements</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {textElements.map((element) => (
                  <motion.div
                    key={element.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border"
                  >
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={element.text}
                        onChange={(e) => updateTextElement(element.id, { text: e.target.value })}
                        className="w-full bg-transparent text-sm font-medium focus:outline-none min-w-0 px-1 py-1 rounded border-0 focus:ring-1 focus:ring-ring"
                        style={{ color: element.color }}
                      />
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {element.fontSize}px
                        </span>
                        <div 
                          className="w-3 h-3 rounded border border-border"
                          style={{ backgroundColor: element.color }}
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTextElement(element.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold mb-2">Instructions</h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Text will appear randomly positioned on your character</p>
              <p>• Drag text elements on the character to reposition them</p>
              <p>• Edit text directly in the list above</p>
              <p>• Text will be included when downloading your character</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TextToolsModal;
export type { TextElement };