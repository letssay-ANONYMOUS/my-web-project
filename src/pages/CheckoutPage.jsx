import React, { useContext, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { Button } from '../components/common/Button';

export function CheckoutPage({ navigate, user, orderService, isFirebaseEnabled }) {
  const { cart, total, clearCart } = useContext(CartContext);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isFirebaseEnabled) {
      clearCart();
      setStep(3);
      return;
    }

    if (!user || !orderService) return;
    setLoading(true);
    try {
      await orderService.placeOrder(user.uid, {
        items: cart,
        total,
        customer: formData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        userId: user.uid
      });
      clearCart();
      setStep(3);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="pt-40 text-center">
        <h2 className="font-serif text-4xl mb-6">Your bag is empty</h2>
        <Button onClick={() => navigate('menu')}>Return to Menu</Button>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-32 min-h-screen bg-[#F2F0E9] pb-20 fade-up-enter">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
        <aside className="md:col-span-4 md:order-2 bg-white p-6 border border-[#E5E0D8] h-fit md:sticky md:top-24">
          <h3 className="font-serif text-2xl mb-6">Summary</h3>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm mb-3">
              <span>{item.quantity}x {item.name}</span>
              <span>${(item.quantity * Number(item.price)).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-4 mt-4 flex justify-between font-serif text-xl">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </aside>

        <section className="md:col-span-8 md:order-1">
          {step === 1 && (
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              <h2 className="font-serif text-5xl">Details</h2>
              <input required placeholder="Name" className="w-full p-4 border border-[#E5E0D8]" onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} />
              <input required type="email" placeholder="Email" className="w-full p-4 border border-[#E5E0D8]" onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} />
              <Button type="submit">Continue to Payment</Button>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-6" onSubmit={handlePlaceOrder}>
              <h2 className="font-serif text-5xl">Payment</h2>
              <div className="bg-white border border-[#E5E0D8] p-6 space-y-4">
                <div className="flex items-center gap-2 text-[#3A4D39]"><CreditCard size={18} /> Credit Card (Secure)</div>
                <input className="w-full p-4 bg-[#F2F0E9]" placeholder="Card Number" />
                <div className="grid grid-cols-2 gap-3">
                  <input className="p-4 bg-[#F2F0E9]" placeholder="MM/YY" />
                  <input className="p-4 bg-[#F2F0E9]" placeholder="CVC" />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}</Button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-20">
              <h2 className="font-serif text-5xl mb-4">Confirmed</h2>
              <p className="mb-8 text-[#666]">Order placed successfully.</p>
              <Button onClick={() => navigate('home')}>Return Home</Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
