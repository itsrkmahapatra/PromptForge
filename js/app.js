document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- Cloudflare Proxy Configuration ---
    // If you experience rate limits (429 errors), deploy a free Cloudflare Worker using the provided code
    // and paste your Worker URL here (e.g., "https://your-proxy.workers.dev/").
    const PROXY_URL = ""; 

    // DOM Elements
    const form = document.getElementById('prompt-form');
    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const btnText = generateBtn.querySelector('span');
    
    const emptyState = document.getElementById('empty-state');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');
    const copyBtn = document.getElementById('copy-btn');
    const toastContainer = document.getElementById('toast-container');

    // Form Fields
    const fieldPromptType = document.getElementById('prompt-type');
    const fieldTopic = document.getElementById('topic');
    const fieldPersona = document.getElementById('persona');
    const fieldTone = document.getElementById('tone');
    const fieldAudience = document.getElementById('audience');
    const fieldLength = document.getElementById('length');
    const fieldContext = document.getElementById('context');

    // Store raw text for accurate copying
    let rawGeneratedText = "";

    // --- Utilities ---

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 animate-slide-up ${
            type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
            'bg-red-500/10 text-red-400 border border-red-500/20'
        }`;
        
        const icon = type === 'success' 
            ? `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`
            : `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
        
        toast.innerHTML = `${icon} ${message}`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.replace('animate-slide-up', 'opacity-0');
            toast.classList.add('transition-opacity', 'duration-300');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function setLoading(isLoading) {
        if (isLoading) {
            generateBtn.disabled = true;
            generateBtn.classList.add('cursor-not-allowed', 'opacity-80');
            btnText.classList.add('invisible');
            loadingSpinner.classList.remove('hidden');
        } else {
            generateBtn.disabled = false;
            generateBtn.classList.remove('cursor-not-allowed', 'opacity-80');
            btnText.classList.remove('invisible');
            loadingSpinner.classList.add('hidden');
        }
    }

    // --- Core Logic ---

    async function generatePrompt(e) {
        console.log("Generate button clicked");
        
        const pt = fieldPromptType.value;
        const t = fieldTopic.value.trim();
        const p = fieldPersona.value;
        const tn = fieldTone.value;
        const a = fieldAudience.value.trim();
        const l = fieldLength.value;
        const c = fieldContext.value.trim();

        let metaPrompt = `You are an expert Prompt Engineer. Generate a highly effective, ready-to-copy prompt for the user to paste into an AI model. `;
        
        let preferences = "Base the prompt on these exact parameters:\n";
        preferences += `- Target AI Output Type: ${pt}\n`;
        if (t) preferences += `- Topic/Task: ${t}\n`;
        if (p) preferences += `- AI Persona/Role to assume: ${p}\n`;
        if (tn) preferences += `- Tone of Voice: ${tn}\n`;
        if (a) preferences += `- Target Audience: ${a}\n`;
        if (l) preferences += `- Detail Level: ${l}\n`;
        if (c) preferences += `- Additional Context/Rules: ${c}\n`;

        metaPrompt += preferences;
        metaPrompt += `\nCRITICAL INSTRUCTIONS: 
        - Output ONLY the final generated prompt text.
        - Use markdown like **bolding** to highlight important instructions.
        - Do not include conversational filler like "Here is your prompt".`;

        setLoading(true);
        
        try {
            const baseUrl = PROXY_URL ? PROXY_URL.replace(/\/$/, '') : 'https://text.pollinations.ai';
            const endpoint = `${baseUrl}/`;
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'user',
                            content: metaPrompt
                        }
                    ],
                    model: 'openai'
                })
            });

            if (!response.ok) throw new Error(`API responded with status: ${response.status}`);

            let textResult = await response.text();
            textResult = textResult.trim();

            rawGeneratedText = textResult.replace(/pollinations/gi, 'Raj Kishor Mahapatra');

            const escapeHTML = str => str.replace(/[&<>'"]/g, 
                tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag])
            );
            
            let displayHtml = escapeHTML(rawGeneratedText);
            displayHtml = displayHtml.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-extrabold">$1</strong>');

            emptyState.classList.add('hidden');
            resultContainer.classList.remove('hidden');
            copyBtn.classList.remove('hidden');
            
            resultText.innerHTML = displayHtml;
            
            showToast('Prompt generated successfully!', 'success');

        } catch (error) {
            console.error("Generation Error:", error);
            showToast('Failed to generate prompt. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    }

    function copyToClipboard() {
        if (!rawGeneratedText) return;

        const textArea = document.createElement("textarea");
        textArea.value = rawGeneratedText;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast('Raw text copied to clipboard!');
        } catch (err) {
            showToast('Failed to copy', 'error');
        }
        document.body.removeChild(textArea);
    }

    function clearForm() {
        form.reset();
        emptyState.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        copyBtn.classList.add('hidden');
        resultText.innerHTML = '';
        rawGeneratedText = '';
    }

    // --- Event Listeners ---
    generateBtn.addEventListener('click', generatePrompt);
    copyBtn.addEventListener('click', copyToClipboard);
    clearBtn.addEventListener('click', clearForm);
});
