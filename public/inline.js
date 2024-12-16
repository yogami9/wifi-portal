let selectedAmount = 0;
let selectedPlanName = '';
let paystackPublicKey = '';

function fetchPaystackKey() {
  fetch('/api/paystack-key')
    .then(response => response.json())
    .then(data => {
      paystackPublicKey = data.publicKey; // Store the public key
    });
}

function selectPlan(amount, planName) {
  selectedAmount = amount;
  selectedPlanName = planName;
  document.getElementById('selected-plan').value = planName;
  document.getElementById('subscription').style.display = 'block'; // Show the subscription form
}

document.getElementById('subscription-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  // Payment processing with Paystack
  payWithPaystack(selectedAmount, selectedPlanName, name, email);
});

function payWithPaystack(amount, plan, name, email) {
  var handler = PaystackPop.setup({
    key: paystackPublicKey,  // Use the fetched Paystack public key
    email: email,
    amount: amount , // Convert to kobo
    currency: 'KES',
    ref: 'WI-FI_' + Math.floor((Math.random() * 1000000000) + 1),
    metadata: {
      custom_fields: [
        {
          display_name: "Plan",
          variable_name: "plan",
          value: plan
        },
        {
          display_name: "User Name",
          variable_name: "name",
          value: name
        }
      ]
    },
    callback: function(response) {
      // Call your backend to create user in MikroTik after successful payment
      fetch('/api/create-user', {
        method: 'POST',
        body: JSON.stringify({ 
          email: email, 
          plan: plan, 
          paymentReference: response.reference 
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => alert(data.message))
      .catch(err => console.error(err));
    },
    onClose: function() {
      alert('Payment process cancelled.');
    }
  });
  handler.openIframe();
}

// Fetch the Paystack public key when the script loads
fetchPaystackKey();