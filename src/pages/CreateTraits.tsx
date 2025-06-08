I notice there are duplicate sections at the end of the file and some missing closing brackets. Here's the corrected ending of the file:

```typescript
interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const ToolButton: React.FC<ToolButtonProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all ${
        active
          ? 'border-blue-500 bg-blue-50 text-blue-700'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span className="text-[10px] mt-0.5 font-medium leading-tight">{label}</span>
    </button>
  );
};

export default CreateTraits;
```

I removed the duplicate sections and ensured all brackets are properly closed. The file should now be syntactically correct.