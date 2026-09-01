const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// replace the loading and user check
app = app.replace(/  if \(loading\) \{[\s\S]*?  if \(!user\) \{[\s\S]*?    \);\n  }/, "");
// also remove the loading state entirely
app = app.replace(/  const \[loading, setLoading\] = useState\(true\);\n/, "");
app = app.replace(/      setLoading\(false\);\n/, "");

fs.writeFileSync('src/App.tsx', app, 'utf8');
