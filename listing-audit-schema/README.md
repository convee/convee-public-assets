# @convee/listing-audit-schema

A small, transparent checklist schema for tools that review an Amazon product listing before edits are made. It contains identifiers, review areas, and severity only; it does not scrape pages, make marketplace claims, or include proprietary scoring logic.

```bash
npm install @convee/listing-audit-schema
```

```js
import { auditChecks, getChecks, groupChecks } from '@convee/listing-audit-schema';

getChecks('images');
// [{ id: 'image_coverage', area: 'images', severity: 'high' }]
```

Use the live [Listvaro Amazon Listing Audit](https://listvaro.com/?utm_source=npm&utm_medium=package&utm_campaign=listing-audit-schema) for an evidence-based report. Marketplace policies and seller evidence remain authoritative.
