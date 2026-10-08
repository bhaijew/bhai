import assert from 'assert';
import { POST } from '../src/app/api/vapi/tools/route';
import {
  saveCart,
  _resetServerCartsDbForTests,
  CartRecord,
  signCheckoutToken,
} from '../src/lib/cartService';

const TEST_SECRET = 'test_vapi_secret_key_bradford_2026';

// Setup environment for testing
process.env.VAPI_SECRET_KEY = TEST_SECRET;
process.env.NEXT_PUBLIC_SITE_URL = 'https://bhai-woad.vercel.app';
process.env.MAX_DISCOUNT_PERCENT = '10';
process.env.MIN_CART_VALUE_FOR_DISCOUNT = '50';

function createVapiToolRequest(
  payload: any,
  authHeader: string | null = `Bearer ${TEST_SECRET}`
): Request {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };
  if (authHeader) {
    headers['authorization'] = authHeader;
  }
  return new Request('https://bhai-woad.vercel.app/api/vapi/tools', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
}

async function runTestSuite() {
  console.log('\n==================================================');
  console.log(' RUNNING BHAI JEWELLER - VAPI TOOLS TEST SUITE');
  console.log('==================================================\n');

  // Seed sample test carts and customers
  const sampleCart1: CartRecord = {
    id: 'cart-valid-101',
    customerId: 'usr-client-001',
    customerEmail: 'aisha.khan@example.com',
    customerName: 'Aisha Khan',
    customerPhone: '+447911123456',
    items: [
      {
        id: 'ring-diamond-18k',
        name: 'Diamond Solitaire Ring 18k Yellow Gold',
        variant: 'Size M',
        price: 299.99,
        quantity: 1,
      },
    ],
    subtotal: 299.99,
    currency: 'GBP',
    status: 'abandoned',
    recoveryStatus: 'abandoned',
    offeredDiscountPercent: 0,
    lastActivityAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mins ago
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  };

  const sampleCart2OtherCustomer: CartRecord = {
    id: 'cart-valid-102',
    customerId: 'usr-client-002',
    customerEmail: 'zayn.malik@example.com',
    customerName: 'Zayn Malik',
    customerPhone: '+447922234567',
    items: [
      {
        id: 'gold-chain-22k',
        name: '22k Solid Gold Rope Chain',
        variant: '20 inch',
        price: 850.0,
        quantity: 1,
      },
    ],
    subtotal: 850.0,
    currency: 'GBP',
    status: 'abandoned',
    recoveryStatus: 'abandoned',
    offeredDiscountPercent: 0,
    lastActivityAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  };

  const sampleCartConverted: CartRecord = {
    id: 'cart-converted-103',
    customerId: 'usr-client-001',
    customerEmail: 'aisha.khan@example.com',
    customerName: 'Aisha Khan',
    items: [
      {
        id: 'gold-bangle-22k',
        name: 'Handcrafted 22k Gold Bangle',
        price: 499.0,
        quantity: 1,
      },
    ],
    subtotal: 499.0,
    currency: 'GBP',
    status: 'converted',
    recoveryStatus: 'converted',
    offeredDiscountPercent: 10,
    lastActivityAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  _resetServerCartsDbForTests([
    sampleCart1,
    sampleCart2OtherCustomer,
    sampleCartConverted,
  ]);

  let passedCount = 0;

  // -------------------------------------------------------------
  // TEST 1: get_max_discount with valid customer/cart
  // -------------------------------------------------------------
  try {
    const req = createVapiToolRequest({
      message: {
        type: 'tool-calls',
        toolCalls: [
          {
            id: 'call_test_1',
            type: 'function',
            function: {
              name: 'get_max_discount',
              arguments: {
                customerId: 'usr-client-001',
                cartId: 'cart-valid-101',
              },
            },
          },
        ],
      },
    });

    const res = await POST(req);
    const data = await res.json();

    assert.strictEqual(res.status, 200, 'Expected 200 status');
    assert.strictEqual(data.results[0].result.success, true);
    assert.strictEqual(data.results[0].result.allowed, true);
    assert.strictEqual(data.results[0].result.customerId, 'usr-client-001');
    assert.strictEqual(data.results[0].result.cartId, 'cart-valid-101');
    assert.strictEqual(data.results[0].result.maxDiscountPercent, 10);
    assert.strictEqual(data.results[0].result.currency, 'GBP');
    assert.strictEqual(data.results[0].result.cartTotal, 299.99);

    console.log('✔ Test 1 Passed: get_max_discount with valid customer/cart');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 1 Failed:', err.message);
  }

  // -------------------------------------------------------------
  // TEST 2: get_max_discount with invalid customer
  // -------------------------------------------------------------
  try {
    const req = createVapiToolRequest({
      message: {
        type: 'tool-calls',
        toolCalls: [
          {
            id: 'call_test_2',
            type: 'function',
            function: {
              name: 'get_max_discount',
              arguments: {
                customerId: 'usr-nonexistent-999',
                cartId: 'cart-valid-101',
              },
            },
          },
        ],
      },
    });

    const res = await POST(req);
    const data = await res.json();

    assert.strictEqual(data.results[0].result.success, false);
    assert.strictEqual(data.results[0].result.code, 'CUSTOMER_NOT_FOUND');

    console.log('✔ Test 2 Passed: get_max_discount with invalid customer');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 2 Failed:', err.message);
  }

  // -------------------------------------------------------------
  // TEST 3: get_max_discount with another customer's cart (ownership violation)
  // -------------------------------------------------------------
  try {
    const req = createVapiToolRequest({
      message: {
        type: 'tool-calls',
        toolCalls: [
          {
            id: 'call_test_3',
            type: 'function',
            function: {
              name: 'get_max_discount',
              arguments: {
                customerId: 'usr-client-001',
                cartId: 'cart-valid-102', // belongs to usr-client-002
              },
            },
          },
        ],
      },
    });

    const res = await POST(req);
    const data = await res.json();

    assert.strictEqual(data.results[0].result.success, false);
    assert.strictEqual(data.results[0].result.code, 'CART_ACCESS_DENIED');

    console.log('✔ Test 3 Passed: get_max_discount with another customer\'s cart');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 3 Failed:', err.message);
  }

  // -------------------------------------------------------------
  // TEST 4: get_checkout_link with valid cart
  // -------------------------------------------------------------
  try {
    const req = createVapiToolRequest({
      message: {
        type: 'tool-calls',
        toolCalls: [
          {
            id: 'call_test_4',
            type: 'function',
            function: {
              name: 'get_checkout_link',
              arguments: {
                customerId: 'usr-client-001',
                cartId: 'cart-valid-101',
              },
            },
          },
        ],
      },
    });

    const res = await POST(req);
    const data = await res.json();

    assert.strictEqual(data.results[0].result.success, true);
    assert.ok(data.results[0].result.checkoutUrl.includes('cartId=cart-valid-101'));
    assert.ok(data.results[0].result.checkoutUrl.startsWith('https://bhai-woad.vercel.app/checkout'));

    console.log('✔ Test 4 Passed: get_checkout_link with valid cart');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 4 Failed:', err.message);
  }

  // -------------------------------------------------------------
  // TEST 5: get_checkout_link with invalid/already converted cart
  // -------------------------------------------------------------
  try {
    const req = createVapiToolRequest({
      message: {
        type: 'tool-calls',
        toolCalls: [
          {
            id: 'call_test_5',
            type: 'function',
            function: {
              name: 'get_checkout_link',
              arguments: {
                customerId: 'usr-client-001',
                cartId: 'cart-converted-103',
              },
            },
          },
        ],
      },
    });

    const res = await POST(req);
    const data = await res.json();

    assert.strictEqual(data.results[0].result.success, false);
    assert.strictEqual(data.results[0].result.code, 'CART_ALREADY_CONVERTED');

    console.log('✔ Test 5 Passed: get_checkout_link with invalid/converted cart');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 5 Failed:', err.message);
  }

  // -------------------------------------------------------------
  // TEST 6: send_checkout_link when provider is configured (simulated mock)
  // -------------------------------------------------------------
  try {
    // Temporarily configure simulated provider env
    process.env.WHATSAPP_ACCESS_TOKEN = 'mock_whatsapp_token_test';
    process.env.WHATSAPP_PHONE_NUMBER_ID = 'mock_phone_id_test';

    // Intercept global fetch for WhatsApp Graph API
    const originalFetch = global.fetch;
    global.fetch = async (url: any, init: any) => {
      if (typeof url === 'string' && url.includes('graph.facebook.com')) {
        return new Response(JSON.stringify({ messages: [{ id: 'wamid.12345' }] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return originalFetch(url, init);
    };

    const req = createVapiToolRequest({
      message: {
        type: 'tool-calls',
        toolCalls: [
          {
            id: 'call_test_6',
            type: 'function',
            function: {
              name: 'send_checkout_link',
              arguments: {
                customerId: 'usr-client-001',
                cartId: 'cart-valid-101',
                checkoutUrl: 'https://bhai-woad.vercel.app/checkout?cartId=cart-valid-101',
              },
            },
          },
        ],
      },
    });

    const res = await POST(req);
    const data = await res.json();

    assert.strictEqual(data.results[0].result.success, true);
    assert.strictEqual(data.results[0].result.channel, 'whatsapp');
    assert.strictEqual(data.results[0].result.message, 'Checkout link sent successfully');

    // Restore fetch and clean env
    global.fetch = originalFetch;
    delete process.env.WHATSAPP_ACCESS_TOKEN;
    delete process.env.WHATSAPP_PHONE_NUMBER_ID;

    console.log('✔ Test 6 Passed: send_checkout_link when provider is configured');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 6 Failed:', err.message);
  }

  // -------------------------------------------------------------
  // TEST 7: send_checkout_link when provider is NOT configured
  // -------------------------------------------------------------
  try {
    // Ensure no provider env vars are set
    delete process.env.WHATSAPP_ACCESS_TOKEN;
    delete process.env.TWILIO_ACCOUNT_SID;
    delete process.env.RESEND_API_KEY;

    const req = createVapiToolRequest({
      message: {
        type: 'tool-calls',
        toolCalls: [
          {
            id: 'call_test_7',
            type: 'function',
            function: {
              name: 'send_checkout_link',
              arguments: {
                customerId: 'usr-client-001',
                cartId: 'cart-valid-101',
                checkoutUrl: 'https://bhai-woad.vercel.app/checkout?cartId=cart-valid-101',
              },
            },
          },
        ],
      },
    });

    const res = await POST(req);
    const data = await res.json();

    assert.strictEqual(data.results[0].result.success, false);
    assert.strictEqual(data.results[0].result.code, 'MESSAGING_NOT_CONFIGURED');
    assert.strictEqual(data.results[0].result.message, 'No messaging provider is configured.');

    console.log('✔ Test 7 Passed: send_checkout_link when provider is not configured');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 7 Failed:', err.message);
  }

  // -------------------------------------------------------------
  // TEST 8: invalid Vapi request (malformed payload)
  // -------------------------------------------------------------
  try {
    const req = createVapiToolRequest({
      unrecognized: 'random data with no tool calls',
    });

    const res = await POST(req);
    const data = await res.json();

    assert.strictEqual(res.status, 400);
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.code, 'INVALID_REQUEST');

    console.log('✔ Test 8 Passed: invalid Vapi request handled');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 8 Failed:', err.message);
  }

  // -------------------------------------------------------------
  // TEST 9: unauthorized request (missing/wrong secret)
  // -------------------------------------------------------------
  try {
    const req = createVapiToolRequest(
      {
        message: {
          type: 'tool-calls',
          toolCalls: [
            {
              id: 'call_test_9',
              name: 'get_max_discount',
              arguments: { customerId: 'usr-1', cartId: 'cart-1' },
            },
          ],
        },
      },
      'Bearer wrong_secret_key'
    );

    const res = await POST(req);
    const data = await res.json();

    assert.strictEqual(res.status, 401);
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.code, 'UNAUTHORIZED');

    console.log('✔ Test 9 Passed: unauthorized request rejected with 401');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 9 Failed:', err.message);
  }

  // -------------------------------------------------------------
  // TEST 10: unsupported tool name
  // -------------------------------------------------------------
  try {
    const req = createVapiToolRequest({
      message: {
        type: 'tool-calls',
        toolCalls: [
          {
            id: 'call_test_10',
            type: 'function',
            function: {
              name: 'delete_customer_database',
              arguments: { customerId: 'usr-1', cartId: 'cart-1' },
            },
          },
        ],
      },
    });

    const res = await POST(req);
    const data = await res.json();

    assert.strictEqual(data.results[0].result.success, false);
    assert.strictEqual(data.results[0].result.code, 'UNSUPPORTED_TOOL');

    console.log('✔ Test 10 Passed: unsupported tool name rejected safely');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 10 Failed:', err.message);
  }

  console.log('\n==================================================');
  if (passedCount === 10) {
    console.log(` ALL ${passedCount}/10 TESTS PASSED SUCCESSFULLY! 🚀`);
  } else {
    console.log(` ${passedCount}/10 TESTS PASSED`);
    process.exit(1);
  }
  console.log('==================================================\n');
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
