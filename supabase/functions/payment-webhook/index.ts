import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const event = body.event || body.data?.event;
    const data = body.data || body;

    // Only process successful charges
    if (event !== "charge.success" && data?.status !== "success") {
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const reference = data.reference || data.data?.reference;
    const amount = data.amount || data.data?.amount;

    if (!reference || !amount) {
      return new Response(JSON.stringify({ error: "Missing reference or amount" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Idempotency: check if this reference was already processed
    const { data: existingTxn } = await supabase
      .from("wallet_transactions")
      .select("id")
      .eq("label", `KoraPay: ${reference}`)
      .limit(1);

    if (existingTxn && existingTxn.length > 0) {
      return new Response(JSON.stringify({ received: true, duplicate: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse reference format: "FUND-{userId}-{timestamp}"
    const parts = reference.split("-");
    if (parts.length < 2) {
      return new Response(JSON.stringify({ error: "Invalid reference format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract user_id (UUID format with dashes)
    const userId = parts.slice(1, -1).join("-");
    const amountNaira = Math.round(Number(amount));

    // Get wallet
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("id, balance")
      .eq("user_id", userId)
      .single();

    if (walletError || !wallet) {
      return new Response(JSON.stringify({ error: "Wallet not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Credit wallet
    await supabase
      .from("wallets")
      .update({ balance: wallet.balance + amountNaira })
      .eq("id", wallet.id);

    // Record transaction
    await supabase.from("wallet_transactions").insert({
      wallet_id: wallet.id,
      user_id: userId,
      amount: amountNaira,
      label: `KoraPay: ${reference}`,
      icon: "💳",
    });

    return new Response(JSON.stringify({ received: true, credited: amountNaira }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
