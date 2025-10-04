import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// هنا بتحط بياناتك من PayMob
const API_KEY = "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRBME16WTVNaXdpYm1GdFpTSTZJbWx1YVhScFlXd2lmUS41NldrVHJPWjZKWmpLRnZQZUlubGx5akZfWXQ4c0tULU9yUC1MUWJ4OVAxSldzYlp4MTM0SGZOVmxwWUpyN1NOckFZNXI0NmhtMFZTRVFHZXZuM09wZw==";
const INTEGRATION_ID = "5087667";
const IFRAME_ID = "https://accept.paymob.com/api/acceptance/iframes/921196?payment_token={payment_key_obtained_previously}";

app.post("/getPaymentUrl", async (req, res) => {
  try {
    const authResponse = await fetch("https://accept.paymob.com/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: API_KEY }),
    });
    const { token } = await authResponse.json();

    const orderResponse = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: token,
        delivery_needed: "false",
        amount_cents: req.body.amount * 100,
        currency: "EGP",
        items: [],
      }),
    });
    const orderData = await orderResponse.json();

    const paymentResponse = await fetch("https://accept.paymob.com/api/acceptance/payment_keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: token,
        amount_cents: req.body.amount * 100,
        expiration: 3600,
        order_id: orderData.id,
        billing_data: {
          apartment: "NA",
          email: "ahmed@example.com",
          floor: "NA",
          first_name: "Ahmed",
          street: "NA",
          building: "NA",
          phone_number: "+201020693291",
          shipping_method: "NA",
          postal_code: "NA",
          city: "Cairo",
          country: "EG",
          last_name: "Elsaghier",
          state: "Cairo",
        },
        currency: "EGP",
        integration_id: INTEGRATION_ID,
      }),
    });
    const paymentData = await paymentResponse.json();

    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${IFRAME_ID}?payment_token=${paymentData.token}`;
    res.json({ iframeUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating payment link");
  }
});

app.listen(10000, () => console.log("Server is running on port 10000"));
