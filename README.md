## Next.js and Optimizely Feature Experimentation

This is a [Next.js](https://nextjs.org/) template that integrates with [Optimizely Feature Experimentation](https://www.optimizely.com/products/feature-experimentation/).

This project uses Next.js [App Router](https://nextjs.org/docs/app) and [Partial Prerendering (PPR)](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering) to combine the benefits of static and dynamic rendering. This enables fast page loads to users with dynamic content and experiments.
Optimizely experimentation data is saved to [Vercel Edge Config](https://vercel.com/docs/storage/edge-config) through [Optimizely webhooks](https://docs.developers.optimizely.com/feature-experimentation/docs/configure-webhooks) which allows [Edge Middleware](https://vercel.com/docs/functions/edge-middleware) and [React Server Components (RSC)](https://react.dev/reference/rsc/server-components) to perform decisions with minimal latency.

This project uses:

- Next.js App Router
- Partial Prerendering (PPR)
- Vercel Edge Config
- Edge Middleware
- Tailwind CSS & shadcn/ui
- Vercel Toolbar
- Vercel Feature Flags
- Optimizely Feature Experimentation

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnextjs-optimizely-experimentation&env=OPTIMIZELY_API_KEY,OPTIMIZELY_SDK_KEY,OPTIMIZELY_PROJECT_ID,OPTIMIZELY_WEBHOOK_SECRET,API_TOKEN,TEAM_ID,EDGE_CONFIG,FLAGS_SECRET&project-name=nextjs-optimizely-experimentation&repository-name=nextjs-optimizely-experimentation&demo-title=Next.js%20Optimizely%20Experimentation&demo-description=Fast%20and%20safe%20experimentation%20with%20Next.js%2C%20Vercel%2C%20and%20Optimizely%20Feature%20Experimentation&demo-url=https%3A%2F%2Fnextjs-optimizely-experimentation.vercel.app%2F&edge-config-stores=%7B%22EDGE_CONFIG%22%3A%7B%22stock%22%3A%7B%22cup%22%3A1%2C%22hat%22%3A4%2C%22mug%22%3A5%2C%22hoodie%22%3A4%7D%2C%22datafile%22%3A%7B%7D%7D%7D)

The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.

Check out our [Next.js deployment documentation](https://vercel.com/docs/frameworks/nextjs) for more details.

## Getting started

Sign up for a free [Optimizely Feature Flags account](https://www.optimizely.com/enhancements/free-feature-flagging) and create a new project.

You must set the following environment variables to run this application:

- `OPTIMIZELY_API_KEY`
- `OPTIMIZELY_SDK_KEY`
- `OPTIMIZELY_PROJECT_ID`
- `OPTIMIZELY_WEBHOOK_SECRET`
- `API_TOKEN`
- `TEAM_ID`
- `EDGE_CONFIG`
- `FLAGS_SECRET`
  Create via: `node -e "console.log(crypto.randomBytes(32).toString('base64url'))"`

The Optimizely API key, SDK key, and Project ID are retrieved from your [Optimizely Feature Experimentation](https://app.optimizely.com/) project and account settings. The Optimizely webhook secret is created upon webhook creation. See the "Integrating Optimizely Webhooks with Vercel Edge Config" section below and [Optimizely's Create Webhooks](https://docs.developers.optimizely.com/feature-experimentation/docs/configure-webhooks) documentation for more details.

A Vercel API Token, Team ID, and Edge Config are required for storing experiment data in Vercel Edge Config. Refer to [Creating an Access Token](https://vercel.com/docs/rest-api#creating-an-access-token) in Vercel's REST API documentation for creating your token, and [Vercel Edge Config documentation](https://vercel.com/docs/storage/edge-config) for creating your Edge Config store.

Run the development server locally:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Integrating Optimizely Webhooks with Vercel Edge Config

This experimentation template uses Optimizely webhooks to sync experiment data to Vercel Edge Config. This allows experiment decisions to run in Edge Middleware and React Server Components with minimal latency.

To configure your Optimizely webhook:

1. Navigate your browser to [app.optimizely.com](https://app.optimizely.com/).
2. Login and go to your Optimizely Feature Experimentation project settings.
3. Select the "Webhooks" tab.
4. Click "Create New Webhook".
5. Provide a name for your webhook.
6. Set the URL to the location of your Next.js Optimizely webhook route (`https://[project domain]/api/optimizely`).
7. Under events, ensure the following events are selected:
   1. Datafile: Updated
   2. Flag: Created, Updated, Archived, Deleted
   3. Event: Created, Updated, Archived, Deleted
   4. Variable: Created, Updated, Archived, Deleted
   5. Variation: Created, Updated, Archived, Deleted
8. Click "Save" and note the secret key generated for your webhook.
9. Set your Vercel environment variable, `OPTIMIZELY_WEBHOOK_SECRET`, to the secret key.
10. Once your webhook is created, create or update a flag in Optimizely to trigger the webhook and sync your experiment data to Vercel Edge Config.

## Important files and folders

| File(s)                                                | Description                                                                        |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `/app/[code]/page.tsx`                                 | Static homepage with dynamic segment for multiple variations                       |
| `/app/product/[slug]/page.tsx`                         | Product detail page                                                                |
| `/app/cart/page.tsx`                                   | Cart page                                                                          |
| `/app/.well-known/vercel/flags/route.ts`               | API route exposing flags to toolbar                                                |
| `/app/api/optimizely/route.ts`                         | API route called by optimizely to store experimentation data in Vercel Edge Config |
| `/lib/actions.ts`                                      | File containing server actions (e.g. track purchase event)                         |
| `/lib/flags.ts`                                        | Contains declared flags and precomputed flags                                      |
| `/middleware.ts`                                       | Evaluates precomputed flags, set new shopper cookie                                |
| `/lib/products.ts`                                     | A hardcoded set of products                                                        |

## Learn More

Take a look at the following resources to learn more:

- [Guide: How to Integrate Optimizely Feature Experimentation with Next.js and Vercel](https://vercel.com/guides/how-to-integrate-optimizely-feature-experimentation-next-vercel)
- [Workshop: Fast & Safe Experimentation with Next.js and Optimizely](https://vercel.com/resources/workshop-fast-and-safe-experimentation)
- [Vercel Feature Flags](https://vercel.com/docs/workflow-collaboration/feature-flags)
- [Precomputed Flags](https://vercel.com/docs/workflow-collaboration/feature-flags/flags-pattern-nextjs#precomputing-flags)
- [Vercel Toolbar](https://vercel.com/docs/workflow-collaboration/vercel-toolbar)
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
