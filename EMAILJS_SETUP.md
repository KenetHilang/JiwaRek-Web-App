# EmailJS Setup Instructions (Tolong Dibaca!)

## Step 1: Create EmailJS Account

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/sign-up)
2. Sign up for a free account (No credit card required)
3. Verify your email address

## Step 2: Add Email Service

1. Go to **Email Services** in the dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail recommended for testing)
4. Connect your email account
5. Copy the **Service ID** (e.g., `service_xxxxxxx`)

## Step 3: Create Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Use this template structure:

### Template Content:

**Subject:** Laporan Assessment Kesehatan Mental - {{assessment_type}}

**Body (HTML Format):**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border: 1px solid #e0e0e0;
        }
        .assessment-box {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
        }
        .score {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
            margin: 10px 0;
        }
        .level {
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0;
        }
        .interpretation {
            background: #e8f4f8;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .footer {
            background: #333;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 10px 10px;
        }
        .info-row {
            margin: 10px 0;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 5px;
        }
        .label {
            font-weight: bold;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧠 JiwaRek - Laporan Assessment</h1>
        <p>Laporan Kesehatan Mental</p>
    </div>
    
    <div class="content">
        <h2>Kepada Yth. Tim Rumah Sakit Menur,</h2>
        <p>Berikut adalah laporan hasil assessment kesehatan mental untuk pasien:</p>
        
        <div class="assessment-box">
            <h3>📋 Informasi Pasien</h3>
            <div class="info-row">
                <span class="label">Nama Pasien:</span> {{patient_name}}
            </div>
            <div class="info-row">
                <span class="label">Tanggal Assessment:</span> {{assessment_date}}
            </div>
            <div class="info-row">
                <span class="label">Waktu Submit:</span> {{submission_time}}
            </div>
        </div>
        
        <div class="assessment-box">
            <h3>📊 Hasil Assessment</h3>
            <div class="info-row">
                <span class="label">Jenis Assessment:</span> {{assessment_type}}
            </div>
            <div class="score">
                Skor: {{score}}/{{max_score}}
            </div>
            <div class="level">
                Tingkat: {{result_level}}
            </div>
        </div>
        
        <div class="interpretation">
            <h4>💭 Interpretasi Hasil:</h4>
            <p>{{interpretation}}</p>
        </div>
        
    
    <div class="footer">
        <p><strong>JiwaRek Mental Health Platform</strong></p>
        <p>Sistem Assessment Kesehatan Mental</p>
        <p style="font-size: 12px; margin-top: 10px;">Email ini dikirim secara otomatis dari sistem JiwaRek</p>
    </div>
</body>
</html>
```

4. Click **Save** and copy the **Template ID** (e.g., `template_xxxxxxx`)

## Step 4: Get Public Key

1. Go to **Account** → **General**
2. Copy your **Public Key** (e.g., `xxxxxxxxxxxxxxx`)

## Step 5: Update Configuration

Open `src/utils/emailService.ts` and update these values:

```typescript
export const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_xxxxxxx',      // Your Service ID from Step 2
    TEMPLATE_ID: 'template_xxxxxxx',    // Your Template ID from Step 3
    PUBLIC_KEY: 'xxxxxxxxxxxxxxx',      // Your Public Key from Step 4
};
```

## Step 6: Configure Hospital Email

1. Open `src/components/AssessmentPage/AssessPagePHQ.tsx`
2. Update the hospital email constant on line 24:
```typescript
const HOSPITAL_EMAIL = 'your-hospital@example.com'; // Replace with actual hospital email
```

## Step 7: Test the Integration

1. Run your application: `pnpm run dev`
2. Complete an assessment
3. Click "Kirim Laporan ke Rumah Sakit"
4. Fill in patient name
5. Click "Kirim Laporan"
6. Check the hospital email inbox!

## EmailJS Free Tier Limits

- **200 emails per month**
- No credit card required
- Perfect for testing and small projects

## Template Variables Available

These variables are automatically populated in the HTML template:
- `{{hospital_email}}` - Hospital's email address (recipient)
- `{{patient_name}}` - Patient's name
- `{{assessment_type}}` - Type of assessment (PHQ-9, SRQ-20, Self-Harm)
- `{{assessment_date}}` - Date of assessment
- `{{submission_time}}` - Time when assessment was submitted
- `{{score}}` - Patient's score
- `{{max_score}}` - Maximum possible score
- `{{result_level}}` - Result level (Rendah, Sedang, Tinggi, etc.)
- `{{interpretation}}` - Detailed interpretation of the results

## Troubleshooting

### Email not sending?
1. Check browser console for errors
2. Verify your Service ID, Template ID, and Public Key
3. Make sure your email service is connected properly
4. Check EmailJS dashboard for any errors

### Emails going to spam?
1. Use a verified domain
2. Add SPF/DKIM records (pro feature)
3. Ask users to check spam folder

### Need more emails?
Upgrade to EmailJS paid plan for more monthly emails and advanced features.

## Additional Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS React Guide](https://www.emailjs.com/docs/examples/reactjs/)
- [EmailJS Dashboard](https://dashboard.emailjs.com/)

---

**Note:** Keep your credentials secure! Don't commit them to public repositories. Consider using environment variables for production.
