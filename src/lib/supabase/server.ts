// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Define a function to create a Supabase client for Server Components and Server Actions
export function createClient() {
  const cookieStore = cookies()

  // Create a Supabase client with the service role key for server-side operations
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for admin operations
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // This can be ignored if you have middleware refreshing user sessions
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // This can be ignored if you have middleware refreshing user sessions
          }
        },
      },
    }
  )
}
