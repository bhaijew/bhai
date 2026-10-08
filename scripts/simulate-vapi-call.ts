/**
 * Dev / Testing CLI for Bhai Jeweller Vapi Integration
 *
 * Usage:
 *   npx -y tsx scripts/simulate-vapi-call.ts get_max_discount
 *   npx -y tsx scripts/simulate-vapi-call.ts get_checkout_link
 *   npx -y tsx scripts/simulate-vapi-call.ts send_checkout_link
 */
import { POST } from '../src/app/api/vapi/tools/route';
import { saveCart, CartRecord } from '../src/lib/cartService';

const toolName = process.argv[2] || 'get_max_discount';

async function main() {
  console.log(`\n--- Simulating Vapi Tool Call: ${toolName} ---`);

  // Ensure test cart exists in store
  const sampleCart: CartRecord = {
    id: 'cart-sim-123',
    customerId: 'usr-sim-client',
    customerEmail: 'simulated.client@bhaijeweller.co.uk',
    customerName: 'Simulated Client',
    customerPhone: '+447911123456',
    items: [
      {
        id: 'ring-diamond-18k',
        name: 'Diamond Solitaire Ring 18k Yellow Gold',
        variant: 'Size N',
        price: 349.99,
        quantity: 1,
      },
    ],
    subtotal: 349.99,
    currency: 'GBP',
    status: 'abandoned',
    recoveryStatus: 'abandoned',
    offeredDiscountPercent: 0,
    lastActivityAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  };

  await saveCart(sampleCart);

  let toolArgs: Record<string, any> = {
    customerId: sampleCart.customerId,
    cartId: sampleCart.id,
  };

  if (toolName === 'send_checkout_link') {
    toolArgs.checkoutUrl = `https://bhai-woad.vercel.app/checkout?cartId=${sampleCart.id}`;
  }

  const payload = {
    message: {
      type: 'tool-calls',
      toolCalls: [
        {
          id: `call_sim_${Date.now()}`,
          type: 'function',
          function: {
            name: toolName,
            arguments: toolArgs,
          },
        },
      ],
    },
  };

  const req = new Request('https://bhai-woad.vercel.app/api/vapi/tools', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const res = await POST(req);
  const data = await res.json();

  console.log('HTTP Status:', res.status);
  console.log('Response Payload:');
  console.log(JSON.stringify(data, null, 2));
  console.log('--------------------------------------------------\n');
}

main().catch(console.error);
