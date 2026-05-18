(function() {
    // UPI Configuration
    const upiId = "Q546877063@ybl";
    const payeeName = "Raj Kishor Mahapatra";

    // Create Widget Styles
    const style = document.createElement('style');
    style.innerHTML = `
        .upi-widget-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #5f7fff;
            color: white;
            border: none;
            border-radius: 50px;
            padding: 12px 24px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            cursor: pointer;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: transform 0.2s;
        }
        .upi-widget-btn:hover { transform: scale(1.05); }
        .upi-modal {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .upi-modal-content {
            background: white;
            padding: 30px;
            border-radius: 20px;
            max-width: 400px;
            width: 100%;
            text-align: center;
            position: relative;
        }
        .upi-close {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #666;
        }
        .upi-input {
            width: 100%;
            padding: 12px;
            margin: 20px 0;
            border: 2px solid #eee;
            border-radius: 10px;
            font-size: 18px;
            text-align: center;
        }
        .upi-pay-btn {
            background: #28a745;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 10px;
            font-weight: bold;
            width: 100%;
            cursor: pointer;
        }
        #upi-qr-container {
            margin-top: 20px;
            display: flex;
            justify-content: center;
        }
        #upi-qr-container img {
            border: 10px solid white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .upi-info { font-size: 12px; color: #888; margin-top: 15px; }
    `;
    document.head.appendChild(style);

    // Create Widget Elements
    const widgetBtn = document.createElement('button');
    widgetBtn.className = 'upi-widget-btn';
    widgetBtn.innerHTML = '<span>☕</span> Donate via UPI';
    document.body.appendChild(widgetBtn);

    const modal = document.createElement('div');
    modal.className = 'upi-modal';
    modal.innerHTML = `
        <div class="upi-modal-content">
            <span class="upi-close">&times;</span>
            <h2 style="color:#333;margin:0;font-family:sans-serif">Support the Developer</h2>
            <p style="color:#666;margin:10px 0;font-family:sans-serif">Enter amount to donate via UPI</p>
            <input type="number" class="upi-input" placeholder="Amount (₹)" value="100">
            <button class="upi-pay-btn">Proceed to Pay</button>
            <div id="upi-qr-container"></div>
            <p class="upi-info" style="font-family:sans-serif">1000% Secure Payment Direct via UPI</p>
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
    };
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if(e.target == modal) modal.style.display = 'none'; };

    // Load QRCode Library
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    document.head.appendChild(script);

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
            qrContainer.innerHTML = '';
            new QRCode(qrContainer, {
                text: upiUri,
                width: 200,
                height: 200
            });
            payBtn.style.display = 'none';
        }
    };
})();
