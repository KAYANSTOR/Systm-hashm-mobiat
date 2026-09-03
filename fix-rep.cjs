const fs = require('fs');
let rep = fs.readFileSync('src/pages/Reports.tsx', 'utf8');

rep = rep.replace(`name: 'معامل هاشم الأحمدي للتصميم والتطريز الإلكتروني',
    location: 'صنعاء - شارع الزبيري - مقابل وزارة الدفاع',
    phone1: '770 447 441 - 730 447 441',
    logoSrc: '/logo.png'`, `name: 'معامل هاشم الأحمدي للتصميم والتطريز الإلكتروني',
    location: 'صنعاء - شارع الزبيري - مقابل وزارة الدفاع',
    phone1: '770 447 441',
    phone2: '730 447 441',
    logoSrc: '/logo.png'`);

fs.writeFileSync('src/pages/Reports.tsx', rep);
