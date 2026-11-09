/**
 * UTSAVO - Modular Nepal Payment Integration Gateway
 * Section 11: Real simulated eSewa, Khalti, Fonepay QR, and Bank Wire reconciliation
 */

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  X,
  ShieldCheck,
  CheckCircle,
  Loader2,
  Lock,
  QrCode,
  Building,
  Smartphone,
  AlertCircle,
} from 'lucide-react';

export const PaymentModal: React.FC = () => {
  const { language, t } = useLanguage();
  const {
    activeModal,
    setActiveModal,
    activeBookingId,
    bookings,
    processPayment,
  } = useMarketplace();

  if (activeModal !== 'PAYMENT' || !activeBookingId) return null;

  const currentBooking = bookings.find((b) => b.id === activeBookingId);
  if (!currentBooking) return null;

  const [paymentProvider, setPaymentProvider] = useState<'ESEWA' | 'KHALTI' | 'FONEPAY' | 'BANK_TRANSFER'>('ESEWA');
  const [esewaId, setEsewaId] = useState('9851098421');
  const [esewaPin, setEsewaPin] = useState('1234');
  const [khaltiMobile, setKhaltiMobile] = useState('9851098421');
  const [khaltiOtp, setKhaltiOtp] = useState('5544');
  const [bankRefNo, setBankRefNo] = useState('TXN-NABIL-892104');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const amountToPay = currentBooking.depositRequiredNpr;

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const generatedTxnId = `${paymentProvider}-${Date.now().toString().slice(-8)}`;

    const success = await processPayment({
      bookingId: currentBooking.id,
      paymentMethod: paymentProvider,
      amountNpr: amountToPay,
      transactionId: generatedTxnId,
    });

    setIsProcessing(false);
    if (success) {
      setIsSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nepal Payment Gateway · 256-Bit SSL Encrypted</span>
            </div>
            <h3 className="font-display text-xl font-bold">
              Complete Booking Deposit
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Booking Ref: <strong>{currentBooking.bookingRef}</strong> · {currentBooking.venueName}
            </p>
          </div>

          <button
            onClick={() => setActiveModal('NONE')}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Pill */}
        <div className="p-4 bg-amber-50/70 border-b border-amber-200/50 flex items-center justify-between text-xs">
          <div>
            <span className="text-stone-500 block text-[11px]">Payable Deposit (25%):</span>
            <span className="font-bold text-amber-950 text-lg font-display tabular-nums">
              NPR {amountToPay.toLocaleString()}
            </span>
          </div>
          <div className="text-right text-[11px] text-stone-500">
            Total Event Value: <strong>NPR {currentBooking.totalAmountNpr.toLocaleString()}</strong>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-stone-900">
                  Payment Verified & Booking Confirmed!
                </h4>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Your deposit of NPR {amountToPay.toLocaleString()} has been securely settled. Official confirmation voucher and tax invoice are now generated.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-left max-w-sm mx-auto space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-400">Booking Ref:</span>
                  <strong className="text-stone-900">{currentBooking.bookingRef}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Provider:</span>
                  <strong className="text-stone-900">{paymentProvider}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Inventory Status:</span>
                  <span className="text-emerald-700 font-bold">LOCKED & RESERVED</span>
                </div>
              </div>

              <button
                onClick={() => setActiveModal('NONE')}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-xl transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitPayment} className="space-y-4">
              
              {/* Payment Methods Tabs */}
              <div>
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
                  Select Nepal Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('ESEWA')}
                    className={`p-3 rounded-xl border font-semibold flex items-center gap-2 transition-all ${
                      paymentProvider === 'ESEWA'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                        : 'border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-emerald-600" />
                    <span>eSewa Wallet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentProvider('KHALTI')}
                    className={`p-3 rounded-xl border font-semibold flex items-center gap-2 transition-all ${
                      paymentProvider === 'KHALTI'
                        ? 'border-purple-600 bg-purple-50 text-purple-950 ring-1 ring-purple-600'
                        : 'border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-purple-600" />
                    <span>Khalti Wallet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentProvider('FONEPAY')}
                    className={`p-3 rounded-xl border font-semibold flex items-center gap-2 transition-all ${
                      paymentProvider === 'FONEPAY'
                        ? 'border-red-600 bg-red-50 text-red-950 ring-1 ring-red-600'
                        : 'border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-red-600" />
                    <span>Fonepay QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentProvider('BANK_TRANSFER')}
                    className={`p-3 rounded-xl border font-semibold flex items-center gap-2 transition-all ${
                      paymentProvider === 'BANK_TRANSFER'
                        ? 'border-blue-600 bg-blue-50 text-blue-950 ring-1 ring-blue-600'
                        : 'border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <Building className="w-4 h-4 text-blue-600" />
                    <span>Bank Transfer</span>
                  </button>
                </div>
              </div>

              {/* Provider Specific Input Forms */}
              {paymentProvider === 'ESEWA' && (
                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3 text-xs">
                  <div className="text-emerald-950 font-bold">eSewa Mobile Wallet Direct Checkout</div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">eSewa ID / Mobile Number</label>
                    <input
                      type="text"
                      value={esewaId}
                      onChange={(e) => setEsewaId(e.target.value)}
                      className="w-full text-xs bg-white border border-stone-200 rounded-lg p-2 font-semibold text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">eSewa MPIN / Password</label>
                    <input
                      type="password"
                      value={esewaPin}
                      onChange={(e) => setEsewaPin(e.target.value)}
                      className="w-full text-xs bg-white border border-stone-200 rounded-lg p-2 font-semibold text-stone-900"
                    />
                  </div>
                </div>
              )}

              {paymentProvider === 'KHALTI' && (
                <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200 space-y-3 text-xs">
                  <div className="text-purple-950 font-bold">Khalti Digital Payment Flow</div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">Khalti Registered Number</label>
                    <input
                      type="text"
                      value={khaltiMobile}
                      onChange={(e) => setKhaltiMobile(e.target.value)}
                      className="w-full text-xs bg-white border border-stone-200 rounded-lg p-2 font-semibold text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">Transaction OTP</label>
                    <input
                      type="text"
                      value={khaltiOtp}
                      onChange={(e) => setKhaltiOtp(e.target.value)}
                      className="w-full text-xs bg-white border border-stone-200 rounded-lg p-2 font-semibold text-stone-900"
                    />
                  </div>
                </div>
              )}

              {paymentProvider === 'FONEPAY' && (
                <div className="p-4 bg-red-50/50 rounded-2xl border border-red-200 space-y-3 text-center text-xs">
                  <div className="text-red-950 font-bold">Fonepay Dynamic QR Code</div>
                  <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-stone-200 flex items-center justify-center">
                    <QrCode className="w-28 h-28 text-stone-800" />
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Scan with any mobile banking app (NIC Asia, Nabil, Global IME, Kumari, etc.)
                  </p>
                </div>
              )}

              {paymentProvider === 'BANK_TRANSFER' && (
                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-2 text-xs">
                  <div className="text-blue-950 font-bold">Direct Corporate Bank Transfer</div>
                  <div className="p-2.5 bg-white rounded-lg border border-stone-200 text-[11px] space-y-1">
                    <div>Bank: <strong>Nabil Bank Limited (Durbarmarg Branch)</strong></div>
                    <div>Account Name: <strong>UTSAVO CELEBRATIONS PVT. LTD.</strong></div>
                    <div>Account No: <strong>01001017502948</strong></div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">Bank Reference / Voucher Slip No.</label>
                    <input
                      type="text"
                      value={bankRefNo}
                      onChange={(e) => setBankRefNo(e.target.value)}
                      className="w-full text-xs bg-white border border-stone-200 rounded-lg p-2 font-semibold text-stone-900"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 disabled:opacity-50 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Server-Side Transaction...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Authorize Deposit Payment of NPR {amountToPay.toLocaleString()}</span>
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
