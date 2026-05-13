document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const promptOutput = document.getElementById('prompt-output');
    const categorySelect = document.getElementById('category-select');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');

    const templates = {
        chatgpt: "Act as a professional [Expert]. Your task is to [Task]. Please ensure the tone is [Tone] and include [Context].\n\nInput: [Input]",
        midjourney: "/imagine prompt: [Input], high detail, 8k, cinematic lighting, photorealistic, --ar 16:9",
        claude: "I want you to help me with [Task]. Please follow these rules: [Rules].\n\nContent to process: [Input]",
        dalle: "A highly detailed digital art of [Input], vibrant colors, masterpiece style."
    };

    generateBtn.addEventListener('click', () => {
        const input = userInput.value.trim();
        if (!input) return alert('Please enter some details!');

        let template = templates[categorySelect.value];
        let prompt = template.replace('[Input]', input)
                             .replace('[Task]', 'process the provided information')
                             .replace('[Expert]', 'Software Engineer')
                             .replace('[Tone]', 'professional')
                             .replace('[Context]', 'technical background')
                             .replace('[Rules]', 'be concise and accurate');

        promptOutput.value = prompt;
    });

    copyBtn.addEventListener('click', () => {
        promptOutput.select();
        document.execCommand('copy');
        alert('Prompt copied to clipboard!');
    });
});
