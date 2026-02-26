import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'
import type { Plan } from '@/types'

// Stripe requires the raw body to verify webhook signatures
export const runtime = 'nodejs'

const SUBSCRIPTION_PRICE_TO_PLAN: Record<string, Plan> = {
  [process.env.STRIPE_PRICE_PRO      ?? '']: 'pro',
  [process.env.STRIPE_PRICE_BUSINESS ?? '']: 'business',
  [process.env.STRIPE_PRICE_AGENCY   ?? '']: 'agency',
}

function getPlanFromSubscription(subscription: Stripe.Subscription): Plan {
  const priceId = subscription.items.data[0]?.price?.id ?? ''
  return SUBSCRIPTION_PRICE_TO_PLAN[priceId] ?? 'free'
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 400 })
  }

  const adminClient = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      const plan = session.metadata?.plan as Plan | undefined

      if (userId && plan && session.subscription) {
        await adminClient.from('users').update({
          plan,
          stripe_subscription_id: session.subscription as string,
        }).eq('id', userId)
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      const { data: userRow } = await adminClient
        .from('users')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (userRow) {
        const plan = getPlanFromSubscription(subscription)
        await adminClient.from('users').update({ plan }).eq('id', userRow.id)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      const { data: userRow } = await adminClient
        .from('users')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (userRow) {
        // Downgrade to free on cancellation
        await adminClient.from('users').update({ plan: 'free', stripe_subscription_id: null }).eq('id', userRow.id)
      }
      break
    }

    default:
      // Ignore unhandled event types
      break
  }

  return NextResponse.json({ received: true })
}
