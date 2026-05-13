# Zapier + GoHighLevel Integration Guide

This document provides step-by-step instructions for connecting the AI Case Calculator to GoHighLevel (GHL) via Zapier.

## Overview

```
Calculator → Cloudflare Worker → Zapier Webhook → GHL Contact + Opportunity
```

---

## Part 1: Zapier Webhook Setup

### Step 1: Create a New Zap

1. Log into [Zapier](https://zapier.com)
2. Click **Create Zap**
3. Name it: "AI Calculator Lead to GHL"

### Step 2: Configure Webhook Trigger

1. Search for **Webhooks by Zapier**
2. Select **Catch Hook**
3. Copy the webhook URL provided (e.g., `https://hooks.zapier.com/hooks/catch/123456/abcdef/`)
4. Save this URL securely

### Step 3: Test the Webhook

Send a test request to verify the connection:

```bash
curl -X POST https://hooks.zapier.com/hooks/catch/YOUR_HOOK_ID/ \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "phone": "(555) 555-5555",
    "accident_type": "car_accident",
    "injuries": "body_aches, broken_bones",
    "injury_severity": "substantial",
    "fault_status": "not_at_fault",
    "accident_timing": "less_than_30_days",
    "zip_code": "90210",
    "has_property_damage": true,
    "estimate_without_attorney_low": 7070,
    "estimate_without_attorney_high": 14139,
    "estimate_with_attorney_gross_low": 35347,
    "estimate_with_attorney_gross_high": 84834,
    "estimate_with_attorney_net_low": 23683,
    "estimate_with_attorney_net_high": 56839,
    "model_version": "1.0.0",
    "consent_timestamp": "2026-05-12T12:00:00.000Z",
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "pi_calculator",
    "submitted_at": "2026-05-12T12:00:00.000Z",
    "source": "ai_case_calculator"
  }'
```

---

## Part 2: Webhook Payload Schema

### Full JSON Schema

```json
{
  "first_name": "string (required)",
  "last_name": "string (required)",
  "email": "string (required, valid email)",
  "phone": "string (required, 10+ digits)",
  
  "accident_type": "car_accident | motorcycle_accident | truck_accident | bicycle_accident | other",
  "injuries": "string (comma-separated list or 'none')",
  "injury_severity": "none | soft_tissue | substantial | catastrophic",
  "fault_status": "not_at_fault | partial_fault | at_fault",
  "accident_timing": "less_than_30_days | one_to_three_months | three_to_six_months | six_to_twelve_months | one_to_two_years | more_than_two_years",
  "zip_code": "string (5 digits)",
  "has_property_damage": "boolean",
  "accident_description": "string (optional, max 2000 chars)",
  
  "estimate_without_attorney_low": "number (rounded up)",
  "estimate_without_attorney_high": "number (rounded up)",
  "estimate_with_attorney_gross_low": "number (rounded up)",
  "estimate_with_attorney_gross_high": "number (rounded up)",
  "estimate_with_attorney_net_low": "number (rounded up)",
  "estimate_with_attorney_net_high": "number (rounded up)",
  
  "model_version": "string (e.g., '1.0.0')",
  "consent_timestamp": "string (ISO 8601)",
  "consent_text": "string",
  
  "utm_source": "string (optional)",
  "utm_medium": "string (optional)",
  "utm_campaign": "string (optional)",
  "utm_content": "string (optional)",
  "utm_term": "string (optional)",
  
  "submitted_at": "string (ISO 8601)",
  "source": "ai_case_calculator"
}
```

---

## Part 3: GHL Custom Fields Setup

### Required Custom Fields in GHL

Create these custom fields in GHL before setting up the Zapier mapping:

| Field Name | Field ID (suggested) | Type | Description |
|------------|---------------------|------|-------------|
| Accident Type | `accident_type` | Dropdown | Type of accident |
| Injuries | `injuries` | Text | Comma-separated injury list |
| Injury Severity | `injury_severity` | Dropdown | none/soft_tissue/substantial/catastrophic |
| Fault Status | `fault_status` | Dropdown | not_at_fault/partial_fault/at_fault |
| Accident Timing | `accident_timing` | Dropdown | When accident occurred |
| Has Property Damage | `has_property_damage` | Checkbox | Vehicle damaged |
| Accident Description | `accident_description` | Long Text | User's description |
| Estimate Low (No Atty) | `estimate_no_atty_low` | Number | Without attorney low range |
| Estimate High (No Atty) | `estimate_no_atty_high` | Number | Without attorney high range |
| Estimate Low (With Atty) | `estimate_with_atty_low` | Number | With attorney net low |
| Estimate High (With Atty) | `estimate_with_atty_high` | Number | With attorney net high |
| Calculator Version | `calc_model_version` | Text | Model version for tracking |
| Consent Timestamp | `consent_timestamp` | Date/Time | When consent given |
| Lead Source | `lead_source` | Text | Always "ai_case_calculator" |

### Creating Custom Fields in GHL

1. Go to **Settings** → **Custom Fields**
2. Click **Add Field**
3. Select **Contact** as the field type
4. Enter field name and select appropriate data type
5. Save and repeat for all fields

---

## Part 4: Zapier Action Configuration

### Action 1: Create/Update GHL Contact

1. Add action: **GoHighLevel** → **Create or Update Contact**
2. Connect your GHL account
3. Map fields:

| GHL Field | Zapier Data |
|-----------|-------------|
| First Name | `first_name` |
| Last Name | `last_name` |
| Email | `email` |
| Phone | `phone` |
| Address - Postal Code | `zip_code` |
| Tags | See tagging logic below |
| Custom: accident_type | `accident_type` |
| Custom: injuries | `injuries` |
| Custom: injury_severity | `injury_severity` |
| Custom: fault_status | `fault_status` |
| Custom: accident_timing | `accident_timing` |
| Custom: has_property_damage | `has_property_damage` |
| Custom: accident_description | `accident_description` |
| Custom: estimate_no_atty_low | `estimate_without_attorney_low` |
| Custom: estimate_no_atty_high | `estimate_without_attorney_high` |
| Custom: estimate_with_atty_low | `estimate_with_attorney_net_low` |
| Custom: estimate_with_atty_high | `estimate_with_attorney_net_high` |
| Custom: calc_model_version | `model_version` |
| Custom: consent_timestamp | `consent_timestamp` |
| Custom: lead_source | `source` |

### Action 2: Add Tags (Optional Formatter Step)

Use a **Formatter** step to create dynamic tags:

**Tag Logic:**
- Always add: `ai_calculator_lead`
- Add based on severity: `severity_{{injury_severity}}`
- Add based on timing: `timing_{{accident_timing}}`
- Add based on fault: `fault_{{fault_status}}`
- If `estimate_with_attorney_net_high` > 50000: `high_value_lead`

### Action 3: Create Opportunity (Optional)

1. Add action: **GoHighLevel** → **Create Opportunity**
2. Map fields:

| GHL Field | Value |
|-----------|-------|
| Pipeline | Select your PI intake pipeline |
| Stage | "New Lead" or "Calculator Submission" |
| Name | `{{first_name}} {{last_name}} - {{accident_type}}` |
| Value | `{{estimate_with_attorney_net_high}}` |
| Contact | Use contact ID from previous step |

---

## Part 5: GHL Pipeline Setup

### Recommended Pipeline Stages

1. **New Lead** - Initial calculator submission
2. **Contacted** - First contact made
3. **Qualified** - Case meets criteria
4. **Consultation Scheduled** - Appointment set
5. **Retained** - Client signed
6. **Closed - Won** - Case accepted
7. **Closed - Lost** - Case declined

### Automation Triggers in GHL

Set up these automations in GHL:

1. **New Lead Notification**
   - Trigger: Contact created with tag `ai_calculator_lead`
   - Action: Send notification to intake team

2. **High Value Lead Alert**
   - Trigger: Contact created with tag `high_value_lead`
   - Action: Priority notification + assign to senior intake

3. **Statute Warning Follow-up**
   - Trigger: Contact with `timing_one_to_two_years` or `timing_more_than_two_years`
   - Action: Urgent follow-up sequence

---

## Part 6: Environment Configuration

### Cloudflare Worker Secrets

Set these secrets in your Cloudflare Worker:

```bash
# Set Zapier webhook URL
wrangler secret put ZAPIER_WEBHOOK_URL
# Enter: https://hooks.zapier.com/hooks/catch/YOUR_HOOK_ID/

# Set webhook signing secret (optional but recommended)
wrangler secret put WEBHOOK_SECRET
# Enter: your-random-secret-string
```

### Next.js Environment Variables

For local development, create `.env.local`:

```env
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/YOUR_HOOK_ID/
WEBHOOK_SECRET=your-random-secret-string
```

For production (Cloudflare Pages), set these in the dashboard:
1. Go to your Pages project → Settings → Environment variables
2. Add `ZAPIER_WEBHOOK_URL` and `WEBHOOK_SECRET`

---

## Part 7: Testing Checklist

### Pre-Launch Testing

- [ ] Submit test lead through calculator UI
- [ ] Verify webhook receives correct payload
- [ ] Confirm contact created in GHL with all fields
- [ ] Verify tags applied correctly
- [ ] Check opportunity created (if configured)
- [ ] Test high-value lead tagging
- [ ] Verify consent timestamp recorded
- [ ] Test UTM parameter passthrough

### Test Scenarios

1. **Soft tissue, not at fault, recent**
   - Expected: Lower value estimate, standard tags

2. **Catastrophic, not at fault, recent**
   - Expected: High value estimate, `high_value_lead` tag

3. **Any injury, at fault**
   - Expected: Zero estimate, `fault_at_fault` tag

4. **Any injury, >2 years old**
   - Expected: Reduced estimate, statute warning tag

### Monitoring

Set up Zapier error notifications:
1. Go to Zap settings
2. Enable error notifications
3. Set notification email

---

## Part 8: Data Retention & Compliance

### TCPA Compliance

- Consent timestamp is always recorded
- Consent text is stored with each lead
- Consent is required before form submission

### Data Retention Policy

Recommended retention periods:
- Lead data in GHL: Follow your firm's retention policy
- Zapier task history: 30 days (Zapier default)
- Worker logs: 7 days (Cloudflare default)

### Audit Trail

Each lead includes:
- `consent_timestamp` - When user consented
- `consent_text` - Exact consent language
- `submitted_at` - Form submission time
- `model_version` - Calculator version used
- `source` - Always "ai_case_calculator"

---

## Troubleshooting

### Common Issues

**Webhook not receiving data:**
- Check ZAPIER_WEBHOOK_URL is set correctly
- Verify no CORS issues in browser console
- Check Cloudflare Worker logs

**Contact not created in GHL:**
- Verify GHL API connection in Zapier
- Check field mappings match GHL custom field IDs
- Review Zapier task history for errors

**Missing custom fields:**
- Ensure custom fields created in GHL before mapping
- Check field IDs match exactly

**Tags not applying:**
- Verify tag names exist in GHL
- Check Formatter step logic

### Support Resources

- [Zapier Help Center](https://help.zapier.com)
- [GHL Knowledge Base](https://help.gohighlevel.com)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
