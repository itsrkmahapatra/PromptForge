# How I Built PromptForge: A Serverless AI Prompt Engineering IDE Using Puter.js

## The Problem
If you work with Generative AI, you probably have a collection of prompts scattered across text files, Notion pages, and chat histories. Testing these templates with different variables (like target tone, format, or role) usually involves tedious copy-pasting.

I wanted an IDE specifically designed for **prompt engineering** that:
1. Allows templating with dynamic variables.
2. Supports side-by-side prompt compilation.
3. Provides secure, cloud-synced storage without setting up complex backend servers.

This led me to build **PromptForge**.

## Architecture & Code Breakdown
PromptForge uses vanilla JavaScript, TailwindCSS, and the **Puter.js SDK** for its backend functionality.

By leveraging Puter.js, I avoided writing custom user authentication, databases, and hosting configs. The application reads and writes prompt configurations directly to Puter's cloud-hosted storage:

```javascript
// Fetch prompt templates from serverless cloud storage
async function loadPrompts() {
  if (puter.auth.isSignedIn()) {
    const prompts = await puter.kv.getJSON('user_prompts') || [];
    renderPromptList(prompts);
  } else {
    loadLocalPrompts();
  }
}
```

The template rendering engine compiles prompts dynamically by replacing user-defined curly brace placeholders:

```javascript
function compilePrompt(template, variables) {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match;
  });
}

// Example compilation
const result = compilePrompt("Act as a {role}. Explain {concept}.", {
  role: "React Architect",
  concept: "Server Components"
});
```

## Lessons Learned
1. **Serverless Speed:** Using Puter.js reduced development time significantly. I focused entirely on UI design and frontend compiler mechanics while Puter handled data persistence securely.
2. **UX is Key:** Prompt engineers need to compare compiled prompts rapidly. A split-screen playground layout with instant variable inputs made the tool much more engaging.

## Check It Out!
PromptForge is open-source and free. Star the repo or contribute here:
👉 [https://github.com/itsrkmahapatra/PromptForge](https://github.com/itsrkmahapatra/PromptForge)