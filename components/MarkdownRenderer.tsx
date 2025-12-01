import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Helper to format inline bold text (**text**)
  const formatInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-violet-200 bg-violet-500/10 px-1 rounded">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Main render logic
  const renderContent = () => {
    // 1. Split by Code Blocks
    const segments = content.split(/(```[\s\S]*?```)/g);
    
    return segments.map((segment, i) => {
      // Handle Code Blocks
      if (segment.startsWith('```') && segment.endsWith('```')) {
        const content = segment.slice(3, -3).replace(/^[a-z]+\n/, ''); 
        return (
          <div key={i} className="my-4 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shadow-inner" dir="ltr">
            <div className="bg-slate-900 px-3 py-1.5 text-[10px] text-slate-500 border-b border-slate-700 flex justify-between items-center uppercase tracking-wider font-mono">
              <span>Code / Text Snippet</span>
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed whitespace-pre">
              {content.trim()}
            </pre>
          </div>
        );
      }

      // Handle Standard Text Lines
      const lines = segment.split('\n');
      return (
        <div key={i} className="space-y-1">
          {lines.map((line, j) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={j} className="h-2"></div>;

            // Headings
            if (trimmed.startsWith('### ')) {
              return <h3 key={j} className="text-lg font-bold text-violet-300 mt-4 mb-2">{formatInline(trimmed.slice(4))}</h3>;
            }
            if (trimmed.startsWith('## ')) {
               return <h2 key={j} className="text-xl font-bold text-white mt-6 mb-3 pb-2 border-b border-slate-700/50">{formatInline(trimmed.slice(3))}</h2>;
            }
            if (trimmed.startsWith('# ')) {
               return <h1 key={j} className="text-2xl font-extrabold text-white mt-6 mb-4">{formatInline(trimmed.slice(2))}</h1>;
            }

            // Bullet Lists
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              return (
                <div key={j} className="flex gap-2 items-start ms-2 mb-1">
                  <span className="text-violet-500 mt-2 text-[6px] flex-shrink-0">●</span>
                  <span className="flex-1 text-slate-300 leading-relaxed">{formatInline(trimmed.slice(2))}</span>
                </div>
              );
            }
            
            // Numbered Lists
            const numMatch = trimmed.match(/^(\d+)\.\s/);
            if (numMatch) {
               return (
                 <div key={j} className="flex gap-2 items-start ms-2 mb-1">
                   <span className="text-violet-400 font-mono text-sm mt-0.5 font-bold flex-shrink-0">{numMatch[1]}.</span>
                   <span className="flex-1 text-slate-300 leading-relaxed">{formatInline(trimmed.slice(numMatch[0].length))}</span>
                 </div>
               );
            }

            // Blockquotes
            if (trimmed.startsWith('> ')) {
                return (
                    <div key={j} className="border-r-4 border-violet-500 bg-slate-800/30 p-3 my-2 rounded-l-lg italic text-slate-400">
                        {formatInline(trimmed.slice(2))}
                    </div>
                );
            }

            // Standard Paragraph
            return <p key={j} className="leading-7 text-slate-300 mb-1">{formatInline(line)}</p>;
          })}
        </div>
      );
    });
  };

  return <div className="prose-like w-full">{renderContent()}</div>;
};

export default MarkdownRenderer;