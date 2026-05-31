const fs = require('fs');

let content = fs.readFileSync('src/db/schema/index.ts', 'utf8');

// Fix created_at - add default sql
content = content.replace(/: integer\("created_at"\),/g, ': integer("created_at").default(sql`strftime(\'%s\', \'now\')`),\n');

// Fix updated_at - add default sql
content = content.replace(/: integer\("updated_at"\),/g, ': integer("updated_at").default(sql`strftime(\'%s\', \'now\')`),\n');

fs.writeFileSync('src/db/schema/index.ts', content);

console.log('Fixed timestamps in schema');
const count = (content.match(/default\(sql`strftime/g) || []).length;
console.log('Fixed', count, 'timestamp fields');