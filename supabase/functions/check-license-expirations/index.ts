
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { format } from "https://esm.sh/date-fns@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRule {
  type: string;
  days_before: number;
  level: "info" | "warning" | "critical";
}

interface License {
  id: string;
  contractor_id: string;
  license_no: string;
  expiry_date: string;
  agency: string;
  notification_sent_at: string | null;
}

interface NotificationPreference {
  contractor_id: string;
  email_enabled: boolean;
  in_app_enabled: boolean;
  sms_enabled: boolean;
  timezone: string;
}

async function checkLicenses() {
  console.log("Starting license expiration check...");
  
  // Get notification rules
  const { data: notificationRules, error: rulesError } = await supabase
    .from("notification_rules")
    .select("*");

  if (rulesError) {
    console.error("Failed to fetch notification rules:", rulesError);
    return { success: false, error: rulesError.message };
  }

  const today = new Date();
  let totalNotificationsSent = 0;
  
  // Process each rule
  for (const rule of notificationRules as NotificationRule[]) {
    console.log(`Processing rule: ${rule.type} with ${rule.days_before} days before...`);
    
    // Calculate the target date for this rule
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + rule.days_before);
    const targetDateString = format(targetDate, 'yyyy-MM-dd');
    
    // Find licenses that expire on the target date
    const { data: licenses, error: licensesError } = await supabase
      .from("contractor_licenses")
      .select("*")
      .eq("expiry_date", targetDateString)
      .is("notification_sent_at", null);
    
    if (licensesError) {
      console.error(`Failed to fetch licenses for rule ${rule.type}:`, licensesError);
      continue;
    }
    
    console.log(`Found ${licenses?.length || 0} licenses expiring in ${rule.days_before} days`);
    
    // Process each license
    for (const license of (licenses || []) as License[]) {
      try {
        // Get notification preferences for this contractor
        const { data: preferences, error: prefsError } = await supabase
          .from("notification_preferences")
          .select("*")
          .eq("contractor_id", license.contractor_id)
          .single();
        
        if (prefsError) {
          console.error(`Failed to fetch preferences for contractor ${license.contractor_id}:`, prefsError);
          continue;
        }
        
        const prefs = preferences as NotificationPreference;
        
        // Create notification
        if (prefs.in_app_enabled) {
          const { error: notificationError } = await supabase
            .from("notifications")
            .insert({
              contractor_id: license.contractor_id,
              license_id: license.id,
              type: `warn${rule.days_before}`,
              level: rule.level,
              payload: { 
                expiry_date: license.expiry_date,
                license_no: license.license_no,
                agency: license.agency
              }
            });
          
          if (notificationError) {
            console.error(`Failed to create notification for license ${license.id}:`, notificationError);
            continue;
          }
          
          totalNotificationsSent++;
        }
        
        // Mark license as notified
        await supabase
          .from("contractor_licenses")
          .update({ 
            notification_sent_at: new Date().toISOString(),
            notification_status: 'sent'
          })
          .eq("id", license.id);
        
      } catch (err) {
        console.error(`Error processing license ${license.id}:`, err);
      }
    }
  }
  
  return { 
    success: true, 
    notificationsSent: totalNotificationsSent
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const result = await checkLicenses();
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("Error in check-license-expirations function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
