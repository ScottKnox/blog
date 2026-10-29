---
title: 'Sample: Writing small functions'
description: 'A placeholder post showing code highlighting, lists, and quotes. Replace or delete it.'
pubDate: 2026-10-20
category: engineering
featured: true
---

This is a **sample post** to show how articles render. Replace it with your own writing, or delete the file.

## Why small functions

Small functions are easier to name, test, and delete. When a function does one thing, its name can describe that thing exactly.

> If you can't name it, you probably don't understand it yet.

### An example

```ts
type User = { name: string; active: boolean };

export function activeNames(users: User[]): string[] {
  return users.filter((u) => u.active).map((u) => u.name);
}
```

A few rules of thumb:

1. Prefer pure functions where you can.
2. Keep side effects at the edges.
3. Use `const` by default and reach for `let` only when needed.

---

That's it. Headings get anchor links, so you can link straight to [why small functions](#why-small-functions).
