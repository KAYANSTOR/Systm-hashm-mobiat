const fs = require('fs');
let code = fs.readFileSync('vite.config.ts', 'utf-8');

code = code.replace(/name: 'تطبيق الإدارة',/g, "name: 'معامل هاشم الأحمدي للتطريز',");
code = code.replace(/short_name: 'الإدارة',/g, "short_name: 'هاشم الأحمدي',");
code = code.replace(/description: 'نظام إدارة المبيعات والسندات والمخزون',/g, "description: 'نظام إدارة المبيعات، المشتريات، المخازن، حسابات العملاء والموردين',");

fs.writeFileSync('vite.config.ts', code);
