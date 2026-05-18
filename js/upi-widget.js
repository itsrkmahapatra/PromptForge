document.addEventListener('DOMContentLoaded', () => {
  const upiId = 'Q546877063@ybl';
  const payUrl = 'upi://pay?pa=' + upiId + '&pn=Developer&tn=Donation&cu=INR';
  
  const button = document.createElement('button');
  button.innerText = 'Support Developer (UPI)';
  button.onclick = () => window.location.href = payUrl;
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.right = '20px';
  button.style.zIndex = '9999';
  document.body.appendChild(button);
});