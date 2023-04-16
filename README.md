# Hypnotes-PDF

A React library for creating and filling PDF forms. This library includes two components: `FormCreate` and `FormFill`.

## Installation

To install the `hypnotes-pdf` package, run the following command:

```bash
npm install hypnotes-pdf
```

After installation cp the pdf.worker to your public folder.

```bash
cp node_modules/hypnotes-pdf/dist/lib/pdf.worker.min.js ./public/
```
## Usage

To use the FormCreate and FormFill components, you should import them as dynamic components with Next.js. This is necessary because these components use browser-specific APIs and should not be server-side rendered.

```jsx
import dynamic from "next/dynamic";

const FormCreate = dynamic(
  import("hypnotes-pdf/dist").then((module) => module.FormCreate),
  { loading: () => <p>Loading...</p>, ssr: false }
);

const FormFill = dynamic(
  import("hypnotes-pdf/dist").then((module) => module.FormFill),
  { loading: () => <p>Loading...</p>, ssr: false }
);

```

## Example Implementation

Below is an example implementation of how to use the FormCreate and FormFill components in a Next.js application:

```jsx

import dynamic from "next/dynamic";
import { useState } from "react";

const FormCreate = dynamic(
  // ... your dynamic import here
);

const FormFill = dynamic(
  // ... your dynamic import here
);

export default function Home() {
  // ... your component state and functions here

  return (
    <div style={{ height: "90vh" }}>
      {/* Your file input, buttons, and conditional rendering */}
    </div>
  );
}


```