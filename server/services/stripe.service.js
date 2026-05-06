import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();


const stripeClient = Stripe(process.env.STRIPE_KEY_SECRET);

stripeClient.customers.create({
  email: 'customer@example.com',
})
  .then(customer => console.log(customer.id))
  .catch(error => console.error(error))


  export default stripe;