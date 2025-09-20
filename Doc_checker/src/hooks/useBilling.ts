import { useState, useEffect } from 'react';

interface Billing {
  credits: number;
  documentsAnalyzed: number;
  reportsGenerated: number;
  totalSpent: number;
  costPerDocument: number;
  costPerReport: number;
}

export const useBilling = () => {
  const [billing, setBilling] = useState<Billing>({
    credits: 100,
    documentsAnalyzed: 0,
    reportsGenerated: 0,
    totalSpent: 0,
    costPerDocument: 2.50,
    costPerReport: 1.00
  });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.email) {
      const userKey = currentUser.email;
      const storedBilling = localStorage.getItem('billing_' + userKey);
      
      if (storedBilling) {
        setBilling(JSON.parse(storedBilling));
      } else {
        // Initialize billing for new user
        const initialBilling = {
          credits: 100,
          documentsAnalyzed: 0,
          reportsGenerated: 0,
          totalSpent: 0,
          costPerDocument: 2.50,
          costPerReport: 1.00
        };
        localStorage.setItem('billing_' + userKey, JSON.stringify(initialBilling));
        setBilling(initialBilling);
      }
    }
  }, []);

  const chargeBilling = async (amount: number, type: 'document' | 'report') => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.email) return;

    const userKey = currentUser.email;
    const updatedBilling = {
      ...billing,
      credits: billing.credits - amount,
      documentsAnalyzed: type === 'document' ? billing.documentsAnalyzed + 1 : billing.documentsAnalyzed,
      reportsGenerated: type === 'report' ? billing.reportsGenerated + 1 : billing.reportsGenerated,
      totalSpent: billing.totalSpent + amount
    };

    setBilling(updatedBilling);
    localStorage.setItem('billing_' + userKey, JSON.stringify(updatedBilling));

    // Show billing notification
    showBillingNotification(amount, updatedBilling.credits);
  };

  const updateBilling = (updates: Partial<Billing>) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.email) return;

    const userKey = currentUser.email;
    const updatedBilling = { ...billing, ...updates };
    
    setBilling(updatedBilling);
    localStorage.setItem('billing_' + userKey, JSON.stringify(updatedBilling));
  };

  const showBillingNotification = (charged: number, remaining: number) => {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideInRight 0.5s ease;
      ">
        <strong>💳 Charged: $${charged.toFixed(2)}</strong><br>
        <small>Credits remaining: $${remaining.toFixed(2)}</small>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 4000);
  };

  return { billing, chargeBilling, updateBilling };
};