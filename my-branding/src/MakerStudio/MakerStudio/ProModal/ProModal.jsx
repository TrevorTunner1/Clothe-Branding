import React, { useState } from 'react';
import styles from './ProModal.module.css';

const ProModal = ({ onClose, onUpgrade }) => {
  const [billingCycle, setBillingCycle] = useState('yearly');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Essential tools for launching your first collection.',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        'Up to 10 Products',
        'Basic Analytics Dashboard',
        'Standard Email Support',
        'Brutige Watermark Included',
        '2% Transaction Fee'
      ],
      cta: 'Upgrade to Starter',
      highlighted: false,
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro Studio',
      description: 'Advanced infrastructure for scaling brands.',
      monthlyPrice: 29,
      yearlyPrice: 24, 
      features: [
        'Unlimited Products & Collections',
        'Advanced Revenue Analytics',
        'Priority 24/7 Support',
        'No Brutige Watermark',
        '0% Transaction Fee',
        'Custom Domain Connection',
        'Staff Accounts (up to 3)'
      ],
      cta: 'Upgrade to Pro',
      highlighted: true,
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Dedicated infrastructure for high-volume houses.',
      monthlyPrice: 99,
      yearlyPrice: 79, 
      features: [
        'Everything in Pro Studio',
        'Dedicated Account Manager',
        'Custom API Access',
        'White-glove Onboarding',
        'SLA Guarantee',
        'Unlimited Staff Accounts',
        'Multi-location Inventory'
      ],
      cta: 'Upgrade to Enterprise',
      highlighted: false,
      popular: false
    }
  ];

  const handleUpgrade = (planId) => {
    if (planId === 'enterprise') {
      window.location.href = 'mailto:sales@brutige.studio';
      return;
    }
    onUpgrade(planId);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2>Choose Your Infrastructure</h2>
            <p>Select the plan that fits your production volume.</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Billing Toggle */}
        <div className={styles.billingSection}>
          <div className={styles.toggleWrapper}>
            <button 
              className={`${styles.toggleOption} ${billingCycle === 'monthly' ? styles.active : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`${styles.toggleOption} ${billingCycle === 'yearly' ? styles.active : ''}`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
              <span className={styles.saveBadge}>Save 20%</span>
            </button>
          </div>
          <p className={styles.billingNote}>
            {billingCycle === 'yearly' ? 'Billed annually. Cancel anytime.' : 'Billed monthly. Cancel anytime.'}
          </p>
        </div>

        {/* Plans Grid */}
        <div className={styles.plansGrid}>
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`${styles.planCard} ${plan.highlighted ? styles.highlighted : ''}`}
            >
              {plan.popular && (
                <div className={styles.popularBadge}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  Most Popular
                </div>
              )}
              
              <div className={styles.planHeader}>
                <h3>{plan.name}</h3>
                <p className={styles.planDesc}>{plan.description}</p>
              </div>

              <div className={styles.priceSection}>
                <span className={styles.currency}>$</span>
                <span className={styles.amount}>
                  {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                </span>
                <span className={styles.period}>/{billingCycle === 'monthly' ? 'mo' : 'mo'}</span>
              </div>
              {billingCycle === 'yearly' && plan.yearlyPrice > 0 && (
                <p className={styles.billedYearly}>billed yearly</p>
              )}

              <ul className={styles.featuresList}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.checkIcon}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                className={`${styles.ctaBtn} ${plan.highlighted ? styles.primaryBtn : styles.secondaryBtn}`}
                onClick={() => handleUpgrade(plan.id)}
                disabled={plan.id === 'starter'}
              >
                {plan.id === 'starter' ? 'Current Plan' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Footer Trust Signals */}
        <div className={styles.footer}>
          <div className={styles.trustItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>Secure Payment</span>
          </div>
          <div className={styles.trustItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>14-Day Free Trial</span>
          </div>
          <div className={styles.trustItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Cancel Anytime</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProModal;