import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Type, X } from 'lucide-react';
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
      <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Type className="w-4 h-4 text-white" />
              </div>
              Text Tools
            </DialogTitle>
            <button
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {/* Add Text Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center">
                <Plus className="w-3 h-3 text-white" />
              </div>
              <h3 className="text-base font-semibold">Add New Text</h3>
            </div>
            
            {/* Text Input */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Text Content</label>
              <input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Enter text..."
                className="w-full px-3 py-2.5 text-sm border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                onKeyPress={(e) => e.key === 'Enter' && addTextElement()}
              />
            </div>

            {/* Font Size and Color Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Font Size</label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full px-3 py-2.5 text-sm border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background transition-all"
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
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Text Color</label>
                <div className="relative">
                  <button
                    className="w-full h-10 rounded-lg border border-input flex-shrink-0 hover:border-ring transition-colors shadow-sm"
                    style={{ backgroundColor: textColor }}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  />
                  {showColorPicker && (
                    <div className="absolute z-30 mt-2 right-0">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="p-4 bg-background rounded-xl shadow-xl border border-border/50 backdrop-blur-sm"
                      >
                        <div className="w-52">
                          <HexColorPicker color={textColor} onChange={setTextColor} />
                        </div>
                        <div className="mt-4">
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Hex Value</label>
                          <input
                            type="text"
                            value={textColor}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                                setTextColor(value);
                              }
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                              const pastedText = e.clipboardData.getData('text');
                              let cleanHex = pastedText.trim();
                              if (!cleanHex.startsWith('#')) {
                                cleanHex = '#' + cleanHex;
                              }
                              if (cleanHex.match(/^#[0-9A-Fa-f]{6}$/)) {
                                setTextColor(cleanHex);
                              }
                            }}
                            placeholder="#000000"
                            className="w-full px-3 py-2 text-xs border border-input rounded-lg focus:outline-none focus:ring-1 focus:ring-ring font-mono transition-all"
                            maxLength={7}
                          />
                        </div>
                        <button
                          className="w-full mt-3 px-3 py-2 text-sm bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                          onClick={() => setShowColorPicker(false)}
                        >
                          Close
                        </button>
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Add Button */}
            <Button
              onClick={addTextElement}
              disabled={!newText.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-medium py-2.5"
            >
              <Plus size={16} className="mr-2" />
              Add Text
            </Button>
          </div>

          {/* Text Elements List */}
          {textElements.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-md flex items-center justify-center">
                  <Type className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-base font-semibold">Added Text Elements</h3>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <AnimatePresence>
                {textElements.map((element) => (
                  <motion.div
                    key={element.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-muted/40 to-muted/20 rounded-lg border border-border/50 hover:border-border transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={element.text}
                        onChange={(e) => updateTextElement(element.id, { text: e.target.value })}
                        className="w-full bg-transparent text-sm font-medium focus:outline-none min-w-0 px-2 py-1 rounded-md border border-transparent focus:border-ring focus:ring-1 focus:ring-ring transition-all"
                        style={{ color: element.color }}
                      />
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-muted-foreground font-medium">
                          {element.fontSize}px
                        </span>
                        <div 
                          className="w-4 h-4 rounded-md border border-border shadow-sm"
                          style={{ backgroundColor: element.color }}
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTextElement(element.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0 rounded-md"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </motion.div>
                ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="pt-6 border-t border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-md flex items-center justify-center">
                <Move className="w-3 h-3 text-white" />
              </div>
              <h3 className="text-base font-semibold">How to Use</h3>
            </div>
            <div className="text-sm text-muted-foreground space-y-2 bg-muted/30 p-3 rounded-lg">
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