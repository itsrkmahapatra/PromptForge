(function() {
    // UPI Configuration
    const upiId = "Q546877063@ybl";
    const payeeName = "Raj Kishor Mahapatra";

    function initWidget() {
        console.log("PromptForge UPI Widget Initializing...");
        
        // Create Widget Styles
        const style = document.createElement('style');
        style.innerHTML = `
            .upi-widget-btn {
                position: fixed;
                bottom: 24px;
                right: 24px;
                background: #14b8a6;
                color: white;
                border: none;
                border-radius: 16px;
                padding: 14px 24px;
                font-weight: 600;
                box-shadow: 0 10px 25px -5px rgba(20, 184, 166, 0.4);
                cursor: pointer;
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                font-family: 'Inter', sans-serif;
            }
            .upi-widget-btn:hover { 
                transform: translateY(-4px);
                background: #0d9488;
                box-shadow: 0 20px 25px -5px rgba(20, 184, 166, 0.5);
            }
            .upi-modal {
                display: none;
                position: fixed;
                inset: 0;
                background: rgba(2, 6, 23, 0.85);
                backdrop-filter: blur(8px);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                padding: 20px;
                font-family: 'Inter', sans-serif;
            }
            .upi-modal-content {
                background: #0f172a;
                padding: 32px;
                border-radius: 24px;
                max-width: 400px;
                width: 100%;
                text-align: center;
                position: relative;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                animation: upiFadeUp 0.4s ease-out;
            }
            @keyframes upiFadeUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .upi-close {
                position: absolute;
                top: 20px;
                right: 20px;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                cursor: pointer;
                color: #94a3b8;
                transition: all 0.2s;
                background: rgba(255, 255, 255, 0.05);
            }
            .upi-close:hover {
                color: white;
                background: rgba(255, 255, 255, 0.1);
            }
            .upi-input-group {
                position: relative;
                margin: 24px 0;
            }
            .upi-input {
                width: 100%;
                padding: 16px;
                background: #020617;
                border: 2px solid #1e293b;
                border-radius: 12px;
                font-size: 20px;
                font-weight: 700;
                text-align: center;
                color: #14b8a6;
                transition: border-color 0.2s;
                outline: none;
            }
            .upi-input:focus {
                border-color: #14b8a6;
            }
            .upi-pay-btn {
                background: #14b8a6;
                color: white;
                border: none;
                padding: 16px 32px;
                border-radius: 12px;
                font-weight: 700;
                font-size: 16px;
                width: 100%;
                cursor: pointer;
                transition: all 0.2s;
                box-shadow: 0 4px 12px rgba(20, 184, 166, 0.2);
            }
            .upi-pay-btn:hover {
                background: #0d9488;
                transform: scale(1.02);
            }
            #upi-qr-container {
                margin-top: 24px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 16px;
            }
            #upi-qr-container img {
                border: 12px solid white;
                border-radius: 16px;
                background: white;
            }
            .upi-info { 
                font-size: 13px; 
                color: #64748b; 
                margin-top: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }
        `;
        document.head.appendChild(style);

        // Create Widget Elements
        const widgetBtn = document.createElement('button');
        widgetBtn.className = 'upi-widget-btn';
        widgetBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
            Donate via UPI
        `;
        document.body.appendChild(widgetBtn);

        const modal = document.createElement('div');
        modal.className = 'upi-modal';
        modal.innerHTML = `
            <div class="upi-modal-content">
                <div class="upi-close">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </div>
                <div style="background: rgba(20, 184, 166, 0.1); width: 64px; height: 64px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path></svg>
                </div>
                <h2 style="color:white;margin:0;font-size:24px;font-weight:800">Support Project</h2>
                <p style="color:#94a3b8;margin:8px 0 0;font-size:15px">Every contribution helps us build more.</p>
                
                <div class="upi-input-group">
                    <input type="number" class="upi-input" placeholder="Amount (₹)" value="100">
                    <div style="position:absolute;top:-10px;left:20px;background:#0f172a;padding:0 8px;color:#14b8a6;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px">Amount (INR)</div>
                </div>

                <button class="upi-pay-btn">Proceed to Pay</button>
                <div id="upi-qr-container"></div>
                
                <div class="upi-info">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    Secure UPI Payment
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const input = modal.querySelector('.upi-input');
        const payBtn = modal.querySelector('.upi-pay-btn');
        const qrContainer = modal.querySelector('#upi-qr-container');
        const closeBtn = modal.querySelector('.upi-close');

        // Handle Open/Close
        widgetBtn.onclick = () => {
            modal.style.display = 'flex';
            qrContainer.innerHTML = '';
            payBtn.style.display = 'block';
            input.parentElement.style.display = 'block';
        };
        closeBtn.onclick = () => modal.style.display = 'none';
        window.onclick = (e) => { if(e.target == modal) modal.style.display = 'none'; };

        // Load QRCode Library if not already loaded
        if (typeof QRCode === 'undefined') {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
            document.head.appendChild(script);
        }

        // Handle Payment
        payBtn.onclick = () => {
            const amount = input.value;
            if(!amount || amount <= 0) return alert("Please enter a valid amount");

            const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
            
            // Detect Mobile
            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

            if (isMobile) {
                window.location.href = upiUri;
            } else {
                // Show QR Code for Desktop
                qrContainer.innerHTML = ' <p style="color:#94a3b8;font-size:14px;margin-bottom:10px">Scan QR with any UPI App</p> ';
                const qrDiv = document.createElement('div');
                qrContainer.appendChild(qrDiv);
                
                new QRCode(qrDiv, {
                    text: upiUri,
                    width: 180,
                    height: 180,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
                
                payBtn.style.display = 'none';
                input.parentElement.style.display = 'none';

                // Add back button
                const backBtn = document.createElement('button');
                backBtn.className = 'upi-info';
                backBtn.style.cssText = "background:none;border:none;color:#14b8a6;cursor:pointer;margin-top:15px;font-weight:600;text-decoration:underline";
                backBtn.textContent = "Change Amount";
                backBtn.onclick = () => {
                    qrContainer.innerHTML = '';
                    payBtn.style.display = 'block';
                    input.parentElement.style.display = 'block';
                };
                qrContainer.appendChild(backBtn);
            }
        };
        console.log("PromptForge UPI Widget Ready.");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }
})();