document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();

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
    const fieldModel = document.getElementById('ai-model');
    const fieldTemperature = document.getElementById('temperature');

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
        const m = fieldModel.value;
        const temp = fieldTemperature.value;

        let metaPrompt = `You are an expert Prompt Engineer. Generate a highly effective, ready-to-copy prompt for the user to paste into an AI model. `;
        
        let preferences = "Base the prompt on these exact parameters:\n";
        preferences += `- Target AI Output Type: ${pt}\n`;
        if (m) {
            const modelName = fieldModel.options[fieldModel.selectedIndex].text;
            preferences += `- Target AI Model (Tailor formatting, styling, and syntax specifically for this model): ${modelName}\n`;
        }
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
        - Do not include conversational filler like "Here is your prompt".
        - Ensure structural formatting (e.g. system role tags, markdown tables, variables using brackets, or XML tags) is optimized for the selected Target AI Model.`;

        setLoading(true);
        
        try {
            if (!window.puter) throw new Error("Puter.js library not loaded.");
            
            const chatOptions = {};
            if (m) chatOptions.model = m;
            if (temp) chatOptions.temperature = parseFloat(temp);

            const puterResponse = await puter.ai.chat(metaPrompt, chatOptions);
            let text = "";
            if (puterResponse) {
                if (typeof puterResponse === 'string') {
                    text = puterResponse;
                } else if (puterResponse.message) {
                    const content = puterResponse.message.content;
                    if (typeof content === 'string') {
                        text = content;
                    } else if (Array.isArray(content)) {
                        text = content.map(item => {
                            if (typeof item === 'string') return item;
                            if (item && typeof item.text === 'string') return item.text;
                            return '';
                        }).join('');
                    } else if (content) {
                        text = String(content);
                    }
                } else if (typeof puterResponse.text === 'function') {
                    try {
                        text = await puterResponse.text();
                    } catch (e) {
                        text = String(puterResponse);
                    }
                } else {
                    text = String(puterResponse);
                }
            }
            if (typeof text !== 'string') {
                text = String(text);
            }
            rawGeneratedText = text.trim();

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
        const textToCopy = (resultText.innerText || resultText.textContent || rawGeneratedText || "").trim();
        if (!textToCopy) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => showToast('Text copied to clipboard!'))
                .catch(err => {
                    console.error("Clipboard API failed: ", err);
                    fallbackCopy(textToCopy);
                });
        } else {
            fallbackCopy(textToCopy);
        }
    }

    function fallbackCopy(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showToast('Text copied to clipboard!');
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

    async function populateModelDropdown() {
        if (!fieldModel) return;

        try {
            // Check if Puter SDK has loaded and has the listModels function
            if (window.puter && typeof puter.ai.listModels === 'function') {
                const models = await puter.ai.listModels();
                if (Array.isArray(models) && models.length > 0) {
                    const defaultOption = fieldModel.options[0];
                    fieldModel.innerHTML = '';
                    fieldModel.appendChild(defaultOption);

                    const groups = {};

                    models.forEach(model => {
                        const id = model.id || model.name || model.key || (typeof model === 'string' ? model : '');
                        if (!id) return;

                        let name = model.name || model.label || model.title || id;
                        let provider = model.provider || '';

                        if (!provider) {
                            if (id.includes('/')) {
                                provider = id.split('/')[0];
                            } else if (id.toLowerCase().includes('gpt') || id.toLowerCase().includes('openai')) {
                                provider = 'OpenAI';
                            } else if (id.toLowerCase().includes('claude') || id.toLowerCase().includes('anthropic')) {
                                provider = 'Anthropic';
                            } else if (id.toLowerCase().includes('gemini') || id.toLowerCase().includes('google')) {
                                provider = 'Google';
                            } else if (id.toLowerCase().includes('llama') || id.toLowerCase().includes('meta')) {
                                provider = 'Meta';
                            } else if (id.toLowerCase().includes('mistral')) {
                                provider = 'Mistral';
                            } else if (id.toLowerCase().includes('deepseek')) {
                                provider = 'DeepSeek';
                            } else {
                                provider = 'Other';
                            }
                        }

                        // Format provider string
                        provider = provider.charAt(0).toUpperCase() + provider.slice(1);

                        if (!groups[provider]) {
                            groups[provider] = [];
                        }

                        groups[provider].push({ id, name });
                    });

                    // Sort providers, putting major ones first
                    const priorityProviders = ['OpenAI', 'Anthropic', 'Google', 'Meta', 'Deepseek', 'Mistral'];
                    const sortedProviders = Object.keys(groups).sort((a, b) => {
                        const idxA = priorityProviders.indexOf(a);
                        const idxB = priorityProviders.indexOf(b);
                        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                        if (idxA !== -1) return -1;
                        if (idxB !== -1) return 1;
                        return a.localeCompare(b);
                    });

                    sortedProviders.forEach(provider => {
                        const optgroup = document.createElement('optgroup');
                        optgroup.label = provider;

                        groups[provider].sort((a, b) => a.name.localeCompare(b.name));

                        groups[provider].forEach(item => {
                            const option = document.createElement('option');
                            option.value = item.id;
                            option.textContent = item.name;
                            optgroup.appendChild(option);
                        });

                        fieldModel.appendChild(optgroup);
                    });
                }
            }
        } catch (err) {
            console.warn("Failed to dynamically fetch models from Puter:", err);
        }
    }

    // --- Event Listeners ---
    generateBtn.addEventListener('click', generatePrompt);
    copyBtn.addEventListener('click', copyToClipboard);
    clearBtn.addEventListener('click', clearForm);
    
    // Sync edits back to rawGeneratedText
    resultText.addEventListener('input', () => {
        rawGeneratedText = resultText.innerText;
    });

    // Populate models dropdown
    populateModelDropdown();
});
