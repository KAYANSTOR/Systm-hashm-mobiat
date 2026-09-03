const fs = require('fs');

let css = fs.readFileSync('src/components/StatementFilters.css', 'utf8');
css = css.replace(/\.wheel-column \{[\s\S]*?\}/, `.wheel-column {
  min-width: 0;
  display: flex;
  flex-direction: column;
  direction: rtl;
  height: 180px;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
}
.wheel-column::-webkit-scrollbar {
  display: none;
}`);

css = css.replace(/\.wheel-item \{[\s\S]*?\}/, `.wheel-item {
  height: 60px;
  min-height: 60px;
  border: 0;
  background: transparent;
  color: #2c2e30;
  font: inherit;
  font-size: 22px;
  font-weight: 800;
  cursor: pointer;
  scroll-snap-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}`);

fs.writeFileSync('src/components/StatementFilters.css', css);

let tsx = fs.readFileSync('src/components/StatementFilters.tsx', 'utf8');
const oldWheel = `function Wheel({
  values,
  labels,
  value,
  onChange,
}: {
  values: number[];
  labels?: string[];
  value: number;
  onChange: (value: number) => void;
}) {
  const index = Math.max(0, values.indexOf(value));

  const visible = [-1, 0, 1].map((offset) => {
    const i = index + offset;
    if (i < 0 || i >= values.length) return null;
    return values[i];
  });

  return (
    <div className="wheel-column">
      {visible.map((item, i) => (
        <button
          type="button"
          key={\`\${item}-\${i}\`}
          className={\`wheel-item \${i === 1 ? "current" : ""}\`}
          onClick={() => item != null && onChange(item)}
        >
          {item == null ? "" : labels ? labels[item] : item}
        </button>
      ))}
    </div>
  );
}`;

const newWheel = `function Wheel({
  values,
  labels,
  value,
  onChange,
}: {
  values: number[];
  labels?: string[];
  value: number;
  onChange: (value: number) => void;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const itemHeight = 60;
  
  // Use a ref to prevent onScroll from firing changes when we are auto-scrolling
  const isAutoScrolling = React.useRef(false);

  React.useEffect(() => {
    if (scrollRef.current) {
      const index = values.indexOf(value);
      if (index !== -1) {
        isAutoScrolling.current = true;
        scrollRef.current.scrollTo({ top: index * itemHeight, behavior: 'smooth' });
        setTimeout(() => { isAutoScrolling.current = false; }, 300);
      }
    }
  }, [value, values]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isAutoScrolling.current) return;
    const scrollTop = e.currentTarget.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    if (index >= 0 && index < values.length && values[index] !== value) {
      onChange(values[index]);
    }
  };

  return (
    <div className="wheel-column" ref={scrollRef} onScroll={handleScroll}>
      <div style={{ height: itemHeight, minHeight: itemHeight, flexShrink: 0 }} />
      {values.map((item, i) => (
        <button
          type="button"
          key={\`\${item}-\${i}\`}
          className={\`wheel-item \${value === item ? "current" : ""}\`}
          onClick={() => onChange(item)}
        >
          {labels ? labels[item] : item}
        </button>
      ))}
      <div style={{ height: itemHeight, minHeight: itemHeight, flexShrink: 0 }} />
    </div>
  );
}`;

tsx = tsx.replace(oldWheel, newWheel);
fs.writeFileSync('src/components/StatementFilters.tsx', tsx);
console.log('Filters patched');
