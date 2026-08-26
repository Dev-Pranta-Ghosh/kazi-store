import type { FaqCategory, Testimonial } from "@/lib/types";

/* ————————————————————————————————————————————————
   Editable site content for Kazi Store.
   Demo testimonials / policies are placeholders —
   replace with verified business content.
———————————————————————————————————————————————— */

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Nusrat J.",
    location: "Khulshi, Chattogram",
    quote:
      "Kazi Store has become my first stop for skincare. The range of Korean products is the best I've found in Chattogram, and the staff always help me pick what suits my skin.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Farhana A.",
    location: "GEC Circle, Chattogram",
    quote:
      "Ordered online and my parcel arrived within two days, beautifully packed. Cash on delivery made it so easy. The Romance lip tint shade they suggested is now my everyday favorite.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Tanvir H.",
    location: "Pahartali, Chattogram",
    quote:
      "Finally a proper men's grooming section. Good fragrance selection — I picked up a Lattafa oud at a fair price and the service at the Jubilee Road shop was excellent.",
    rating: 4.5,
  },
  {
    id: "t4",
    name: "Sharmin S.",
    location: "Dhaka (online order)",
    quote:
      "I order from Dhaka and they deliver nationwide now. Everything arrives sealed and well cushioned. Their WhatsApp responses are quick and genuinely helpful.",
    rating: 4.5,
  },
];

export const FAQS: FaqCategory[] = [
  {
    slug: "orders",
    title: "Orders",
    items: [
      {
        q: "How do I place an order?",
        a: "Browse the shop, add items to your bag and proceed to checkout. You can order as a guest or create an account. Choose your delivery area and payment method, then confirm — you'll receive an order number instantly.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "Contact us as soon as possible at 01815-115297. If your parcel hasn't been handed to the courier yet, we'll do our best to update or cancel it.",
      },
      {
        q: "Do I need an account to order?",
        a: "No — guest checkout is available. Creating an account simply lets you track orders, save addresses and check out faster next time.",
      },
      {
        q: "How do I use a coupon code?",
        a: "Enter your code in the coupon field in your shopping bag or at checkout and press Apply. The discount will appear in your order summary before you pay.",
      },
    ],
  },
  {
    slug: "delivery",
    title: "Delivery",
    items: [
      {
        q: "Which areas do you deliver to?",
        a: "We deliver inside Chattogram city, to Dhaka, and nationwide across Bangladesh through trusted courier partners. Delivery charges depend on your zone.",
      },
      {
        q: "How long does delivery take?",
        a: "Chattogram city typically takes 1–2 working days, Dhaka 2–3 working days, and other districts 3–5 working days. Timelines are estimates and may vary during campaigns or holidays.",
      },
      {
        q: "How much is the delivery charge?",
        a: "Chattogram city ৳60, Dhaka ৳120, nationwide ৳150. Orders over ৳2,500 qualify for free delivery.",
      },
      {
        q: "Can I pick up my order from the store?",
        a: "Yes. You're welcome to visit us at Sofina Bitan, Jubilee Road, Chattogram (located in Hotel Safina Ltd.) and collect your order or shop in person.",
      },
    ],
  },
  {
    slug: "payment",
    title: "Payment",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Cash on Delivery, bKash, Nagad and card payments (Visa / Mastercard) through our payment partners.",
      },
      {
        q: "How do I pay with bKash or Nagad?",
        a: "Choose bKash or Nagad at checkout and you'll receive the merchant number and reference instructions with your order confirmation. Send the amount and share the transaction ID — our team verifies and confirms your order.",
      },
      {
        q: "Is Cash on Delivery available everywhere?",
        a: "COD is available in Chattogram city and most courier-covered areas. For high-value orders outside the city, we may request a partial advance via bKash or Nagad.",
      },
      {
        q: "Is it safe to pay online?",
        a: "Card payments are processed by licensed payment gateway partners over encrypted connections. We never store your card details.",
      },
    ],
  },
  {
    slug: "returns",
    title: "Returns & Refunds",
    items: [
      {
        q: "Can I return a product?",
        a: "If a product arrives damaged, defective or incorrect, contact us within 48 hours of delivery with photos/video and your order number. Unopened items in original condition may be eligible for exchange or return.",
      },
      {
        q: "Which items can't be returned?",
        a: "For hygiene reasons, opened or used cosmetics, skincare and fragrances generally cannot be returned unless they are defective.",
      },
      {
        q: "How are refunds made?",
        a: "Approved refunds for COD orders are sent via bKash or Nagad. Online payments are refunded to the original payment method via the gateway. Processing usually takes 5–10 working days.",
      },
      {
        q: "Who pays return delivery?",
        a: "If we made a mistake (wrong or damaged item), we cover the return cost. For change-of-mind returns of eligible unopened items, the courier fee is borne by the customer.",
      },
    ],
  },
  {
    slug: "products",
    title: "Products",
    items: [
      {
        q: "How do I know which product suits my skin?",
        a: "Message us or visit the store — our team is happy to suggest a routine based on your skin type, concerns and budget.",
      },
      {
        q: "The product I want is out of stock. What now?",
        a: "Contact us with the product name and we'll let you know when it returns. New shipments arrive regularly, so popular items are usually restocked quickly.",
      },
      {
        q: "Do you sell gift sets?",
        a: "We can prepare custom beauty gift sets on request — perfect for weddings and occasions. Visit us in-store or call 01815-115297 to arrange one.",
      },
      {
        q: "Are prices negotiable?",
        a: "Our listed prices are fixed to keep things fair for everyone, but watch our offers and coupon codes for regular savings.",
      },
    ],
  },
  {
    slug: "account",
    title: "Account",
    items: [
      {
        q: "How do I reset my password?",
        a: "Open the login page and choose ‘Forgot password’. Enter your email and we'll send reset instructions.",
      },
      {
        q: "How do I track my order?",
        a: "Sign in and open My Account → Orders to see live statuses — Processing, Confirmed, Shipped or Delivered — for every order.",
      },
      {
        q: "Can I save multiple delivery addresses?",
        a: "Yes. Save home, office or family addresses under My Account → Addresses and pick one at checkout.",
      },
      {
        q: "How is my personal data handled?",
        a: "We only collect what's needed to fulfil your orders and never sell customer data. See our Privacy Policy for details.",
      },
    ],
  },
];

export type PolicyKey = "delivery" | "returns" | "privacy" | "terms";

export interface PolicyPage {
  key: PolicyKey;
  title: string;
  subtitle: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}

const EDIT_NOTE =
  "This page contains sample policy content prepared for Kazi Store. It should be reviewed and updated by the business before publication.";

export const POLICIES: Record<PolicyKey, PolicyPage> = {
  delivery: {
    key: "delivery",
    title: "Delivery Policy",
    subtitle: "How and when your beauty essentials reach you.",
    updated: "Last updated: February 2026",
    sections: [
      {
        heading: "Delivery coverage",
        body: [
          "Kazi Store delivers across Bangladesh. Orders inside Chattogram city are handled by our local delivery team, while nationwide orders are dispatched through trusted courier partners.",
          "You can also shop in person at Sofina Bitan, Jubilee Road, Chattogram (located in Hotel Safina Ltd.) or collect online orders from the shop.",
        ],
      },
      {
        heading: "Delivery charges & timelines",
        body: [
          "Chattogram City: ৳60 — typically 1–2 working days.",
          "Dhaka City: ৳120 — typically 2–3 working days.",
          "Nationwide: ৳150 — typically 3–5 working days.",
          "Orders over ৳2,500 qualify for free delivery. Timelines are estimates and may be affected by weather, holidays or courier capacity.",
        ],
      },
      {
        heading: "Order processing",
        body: [
          "Orders are usually confirmed the same working day. Once confirmed, you'll receive your order number and dispatch updates. Please keep your phone reachable — couriers may call before delivery.",
        ],
      },
      {
        heading: "Receiving your parcel",
        body: [
          "Please check your parcel at delivery time where possible. If anything is damaged or incorrect, contact us within 48 hours at 01815-115297 with your order number and photos so we can resolve it quickly.",
          EDIT_NOTE,
        ],
      },
    ],
  },
  returns: {
    key: "returns",
    title: "Return & Refund Policy",
    subtitle: "Fair, transparent handling when something isn't right.",
    updated: "Last updated: February 2026",
    sections: [
      {
        heading: "When you can return",
        body: [
          "We accept return requests when a product arrives damaged, defective, expired or incorrect. Please notify us within 48 hours of delivery with photo or video evidence and your order number.",
          "Unopened products in their original sealed condition may be eligible for exchange or return within 7 days of delivery, at our discretion.",
        ],
      },
      {
        heading: "Non-returnable items",
        body: [
          "For hygiene and safety reasons, opened or used cosmetics, skincare, fragrances, and personal-use items cannot be returned unless they are faulty.",
        ],
      },
      {
        heading: "Refund process",
        body: [
          "Approved refunds for Cash on Delivery orders are issued via bKash or Nagad. Card and wallet payments are refunded through the payment gateway to the original method.",
          "Refunds are typically processed within 5–10 working days after we receive and inspect the returned item.",
        ],
      },
      {
        heading: "Return delivery costs",
        body: [
          "If the return is due to our error, Kazi Store covers courier costs. For change-of-mind returns of eligible items, the customer arranges and pays the return courier.",
          EDIT_NOTE,
        ],
      },
    ],
  },
  privacy: {
    key: "privacy",
    title: "Privacy Policy",
    subtitle: "How we collect, use and protect your information.",
    updated: "Last updated: February 2026",
    sections: [
      {
        heading: "Information we collect",
        body: [
          "We collect the details needed to fulfil your orders: your name, contact number, email address and delivery address. If you create an account, we also store your order history and saved addresses.",
          "Payment card details are handled directly by licensed payment gateways and are never stored on our systems.",
        ],
      },
      {
        heading: "How we use your information",
        body: [
          "Your information is used to process and deliver orders, provide customer support, and — only with your consent — send offers and updates you can unsubscribe from at any time.",
        ],
      },
      {
        heading: "Data sharing & security",
        body: [
          "We share delivery details with courier partners solely to deliver your order. We never sell customer data to third parties. Access to customer information is restricted to authorized team members.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You may request a copy, correction or deletion of your personal data at any time by contacting us at 01815-115297.",
          EDIT_NOTE,
        ],
      },
    ],
  },
  terms: {
    key: "terms",
    title: "Terms & Conditions",
    subtitle: "The terms that govern shopping with Kazi Store.",
    updated: "Last updated: February 2026",
    sections: [
      {
        heading: "General",
        body: [
          "By using this website or purchasing from Kazi Store (কাজী স্টোর), you agree to these terms. Kazi Store operates from Sofina Bitan, Jubilee Road, Chattogram, Bangladesh.",
        ],
      },
      {
        heading: "Products & pricing",
        body: [
          "Product images and descriptions are for reference; packaging may occasionally differ as brands update designs. Prices are listed in Bangladeshi Taka (৳) and may change without notice, though confirmed orders are always honored at the confirmed price.",
        ],
      },
      {
        heading: "Orders & payment",
        body: [
          "An order is confirmed once verified by our team. We reserve the right to cancel orders in cases of stock unavailability, suspected fraud or pricing errors — any advance payment will be fully refunded in such cases.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "Kazi Store is not liable for indirect losses arising from use of this website. Nothing in these terms limits your rights under applicable Bangladeshi consumer law.",
          EDIT_NOTE,
        ],
      },
    ],
  },
};

export const ROUTINES = [
  {
    slug: "morning",
    title: "Morning Ritual",
    tagline: "Protect — glow all day",
    steps: ["Cleanser", "Toner", "Vitamin C Serum", "Moisturizer", "Sunscreen"],
    blurb: "A five-step wake-up call for your skin: cleanse, brighten, hydrate and shield with SPF.",
  },
  {
    slug: "night",
    title: "Night Ritual",
    tagline: "Repair — while you sleep",
    steps: ["Double Cleanse", "Essence", "Retinol Serum", "Night Cream", "Lip Mask"],
    blurb: "Wind down with actives that work the night shift — repair, resurface, restore.",
  },
  {
    slug: "glow",
    title: "Glow Ritual",
    tagline: "The K-beauty glass skin edit",
    steps: ["Hydrating Toner", "Snail Essence", "Dewy Moisturizer", "Glow Sunscreen"],
    blurb: "Layer featherlight hydration for that lit-from-within, glass-skin finish.",
  },
];

export const GALLERY_IMAGES: { src: string; caption: string }[] = [
  { src: "https://images.pexels.com/photos/7038196/pexels-photo-7038196.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=700&h=900", caption: "Cream textures & quiet mornings" },
  { src: "https://images.pexels.com/photos/7256139/pexels-photo-7256139.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=700&h=900", caption: "Shade stories in rose" },
  { src: "https://images.pexels.com/photos/7691159/pexels-photo-7691159.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=700&h=900", caption: "The ritual shelf" },
  { src: "https://images.pexels.com/photos/22605374/pexels-photo-22605374.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=700&h=900", caption: "Brush work in motion" },
  { src: "https://images.pexels.com/photos/32645088/pexels-photo-32645088.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=700&h=900", caption: "Golden hour fragrance" },
  { src: "https://images.pexels.com/photos/4857799/pexels-photo-4857799.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=700&h=900", caption: "Marble, glass & glow" },
];

export const POPULAR_SEARCHES = [
  "Sunscreen",
  "Niacinamide",
  "Snail Mucin",
  "Lipstick",
  "Hair Oil",
  "Oud",
  "COSRX",
  "Foundation",
];
