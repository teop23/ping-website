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
  fontWeight: string;
}

interface TextToolsProps {
  onTextElementsChange: (elements: TextElement[]) => void;
}

const TextTools: React.FC<TextToolsProps> = ({ onTextElementsChange }) => {
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [newText, setNewText] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState('#000000');
  const [fontWeight, setFontWeight] = useState('normal');
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
      fontWeight
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
    <Card className="w-full max-w-md mx-auto shadow-lg border-2 border-border/50 bg-gradient-to-br from-card to-card/95">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Type size={20} className="text-primary" />
          Text Tools
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Add Text Section */}
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Add Text</label>
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Enter your text..."
              className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addTextElement()}
            />
          </div>

          {/* Text Styling Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium">Size: {fontSize}px</label>
              <input
                type="range"
                min="12"
                max="48"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium">Weight</label>
              <select
                value={fontWeight}
                onChange={(e) => setFontWeight(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-input rounded"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="600">Semi Bold</option>
                <option value="300">Light</option>
              </select>
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-1">
            <label className="text-xs font-medium">Color</label>
            <div className="relative">
              <button
                className="w-full h-8 rounded border-2 border-input"
                style={{ backgroundColor: textColor }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              />
              {showColorPicker && (
                <div className="absolute z-10 mt-2 left-0">
                  <div className="p-3 bg-background rounded-lg shadow-lg border">
                    <HexColorPicker color={textColor} onChange={setTextColor} />
                    <div className="mt-3 mb-2">
                      <label className="block text-xs font-medium mb-1">Hex Color</label>
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
                        className="w-full px-2 py-1 text-xs border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring font-mono"
                        maxLength={7}
                      />
                    </div>
                    <button
                      className="mt-2 w-full px-3 py-1 text-sm bg-muted rounded hover:bg-muted/80"
                      onClick={() => setShowColorPicker(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button 
            onClick={addTextElement} 
            disabled={!newText.trim()}
            className="w-full"
            size="sm"
          >
            <Plus size={16} className="mr-2" />
            Add Text
          </Button>
        </div>

        {/* Text Elements List */}
        {textElements.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Text Elements ({textElements.length})</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {textElements.map((element) => (
                <motion.div
                  key={element.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded border"
                >
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={element.text}
                      onChange={(e) => updateTextElement(element.id, { text: e.target.value })}
                      className="w-full bg-transparent text-sm font-medium truncate focus:outline-none"
                      style={{ 
                        color: element.color,
                        fontSize: `${Math.min(element.fontSize, 14)}px`,
                        fontWeight: element.fontWeight
                      }}
                    />
                    <div className="text-xs text-muted-foreground">
                      {element.fontSize}px • {element.fontWeight}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTextElement(element.id)}
                    className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={12} />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {textElements.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <Type size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No text elements yet</p>
            <p className="text-xs">Add some text to customize your PING!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TextTools;
export type { TextElement };