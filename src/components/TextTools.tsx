import React, { useState } from 'react';
import { Type, Plus, Trash2 } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
}

interface TextToolsProps {
  onTextElementsChange: (elements: TextElement[]) => void;
}

const TextTools: React.FC<TextToolsProps> = ({ onTextElementsChange }) => {
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
    <Card className="w-full shadow-lg border-2 border-border/50 bg-gradient-to-br from-card to-card/95">
      <CardHeader className="pb-3 px-4 pt-4">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Type size={16} className="text-primary" />
          Text Tools
        </CardTitle>
      </CardHeader>
      
      <CardContent className="px-4 pb-4 space-y-3">
        {/* Compact Add Text Section */}
        <div className="space-y-2">
          {/* Text Input Row */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Text & Color</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Add text..."
                className="flex-1 px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring min-w-0"
                onKeyPress={(e) => e.key === 'Enter' && addTextElement()}
              />
              <div className="relative">
                <button
                  className="w-8 h-8 rounded-md border border-input flex-shrink-0 hover:border-ring transition-colors"
                  style={{ backgroundColor: textColor }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                />
                {showColorPicker && (
                  <div className="absolute z-20 mt-1 right-0">
                    <div className="p-2 bg-background rounded-lg shadow-lg border">
                      <div className="w-48">
                        <HexColorPicker color={textColor} onChange={setTextColor} />
                      </div>
                      <div className="mt-2">
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
          
          {/* Size and Add Button Row */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Size</label>
            <div className="flex gap-2">
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="flex-1 px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring bg-background"
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
              <Button
                onClick={addTextElement}
                disabled={!newText.trim()}
                size="sm"
                className="px-3 h-8 flex-shrink-0"
              >
                <Plus size={14} className="mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Text Elements List */}
        {textElements.length > 0 && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Added Text</label>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {textElements.map((element) => (
                <motion.div
                  key={element.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-2 p-1.5 bg-muted/30 rounded-md border"
                >
                  <input
                    type="text"
                    value={element.text}
                    onChange={(e) => updateTextElement(element.id, { text: e.target.value })}
                    className="flex-1 bg-transparent text-xs font-medium focus:outline-none min-w-0 px-1"
                    style={{ color: element.color }}
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {element.fontSize}px
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTextElement(element.id)}
                    className="h-5 w-5 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                  >
                    <Trash2 size={10} />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {textElements.length === 0 && (
          <div className="text-center py-2 text-muted-foreground">
            <p className="text-xs">Add text to customize your PING!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TextTools;
export type { TextElement };