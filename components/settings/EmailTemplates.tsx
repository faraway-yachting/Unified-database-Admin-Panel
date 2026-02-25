import { useState } from 'react';
import { Mail, Smartphone } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface TemplateType {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  subject: string;
  body: string;
}

const templates: TemplateType[] = [
  {
    id: 'T-001',
    name: 'Booking Confirmation',
    status: 'active',
    subject: 'Your Yacht Charter Booking Confirmation - {{booking_id}}',
    body: `Dear {{customer_name}},\n\nThank you for choosing our yacht charter service! We are delighted to confirm your booking.\n\nBooking Details:\n- Yacht: {{yacht_name}}\n- Date: {{booking_date}}\n- Duration: {{booking_duration}}\n- Total Amount: {{booking_amount}}\n\nWe look forward to providing you with an unforgettable experience.\n\nBest regards,\nYacht Charter Team`
  },
  {
    id: 'T-002',
    name: 'Invoice',
    status: 'active',
    subject: 'Invoice #{{invoice_number}} for Your Yacht Charter',
    body: `Dear {{customer_name}},\n\nPlease find attached your invoice for the yacht charter booking.\n\nInvoice #: {{invoice_number}}\nAmount Due: {{amount_due}}\nDue Date: {{due_date}}\n\nThank you for your business.\n\nBest regards,\nYacht Charter Team`
  },
  {
    id: 'T-003',
    name: 'Cancellation',
    status: 'active',
    subject: 'Booking Cancellation Confirmation - {{booking_id}}',
    body: `Dear {{customer_name}},\n\nWe have processed your cancellation request for booking {{booking_id}}.\n\nRefund Amount: {{refund_amount}}\nRefund will be processed within 5-7 business days.\n\nWe hope to serve you again in the future.\n\nBest regards,\nYacht Charter Team`
  },
  {
    id: 'T-004',
    name: 'Follow-up',
    status: 'active',
    subject: 'How Was Your Yacht Charter Experience?',
    body: `Dear {{customer_name}},\n\nWe hope you enjoyed your recent yacht charter experience with {{yacht_name}}.\n\nWe would love to hear your feedback and would appreciate if you could take a moment to share your thoughts.\n\nLooking forward to welcoming you again soon!\n\nBest regards,\nYacht Charter Team`
  },
  {
    id: 'T-005',
    name: 'Inquiry Response',
    status: 'active',
    subject: 'Thank You for Your Inquiry',
    body: `Dear {{customer_name}},\n\nThank you for your interest in our yacht charter services.\n\nOne of our specialists will review your inquiry and get back to you within 24 hours with available options and pricing.\n\nBest regards,\nYacht Charter Team`
  },
  {
    id: 'T-006',
    name: 'Loyalty Reward',
    status: 'inactive',
    subject: 'Special Offer Just for You!',
    body: `Dear {{customer_name}},\n\nAs a valued customer, we are pleased to offer you an exclusive discount of {{discount_percentage}}% on your next booking.\n\nUse code: {{promo_code}}\n\nValid until: {{expiry_date}}\n\nBest regards,\nYacht Charter Team`
  },
];

const variableTags = [
  '{{customer_name}}',
  '{{yacht_name}}',
  '{{booking_date}}',
  '{{booking_id}}',
  '{{booking_amount}}',
  '{{booking_duration}}',
  '{{invoice_number}}',
  '{{amount_due}}',
  '{{due_date}}',
  '{{refund_amount}}',
  '{{promo_code}}',
  '{{discount_percentage}}',
  '{{expiry_date}}'
];

export function EmailTemplates() {
  const { colors } = useTheme();
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  return (
    <div 
      className="rounded-lg border overflow-hidden"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder
      }}
    >
      <div 
        className="p-4 md:p-6 border-b"
        style={{ borderColor: colors.cardBorder }}
      >
        <h2 className="text-xl md:text-2xl font-bold" style={{ color: colors.textPrimary }}>
          Email Templates
        </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Template List */}
        <div 
          className="p-4 border-b lg:border-b-0 lg:border-r overflow-y-auto"
          style={{ 
            borderColor: colors.cardBorder,
            maxHeight: '600px'
          }}
        >
          <div className="space-y-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className="w-full p-3 rounded-lg text-left transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: selectedTemplate.id === template.id 
                    ? `${colors.accent}20` 
                    : colors.background,
                  borderWidth: selectedTemplate.id === template.id ? '2px' : '1px',
                  borderStyle: 'solid',
                  borderColor: selectedTemplate.id === template.id ? colors.accent : colors.cardBorder
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    {template.name}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      backgroundColor: template.status === 'active' 
                        ? `${colors.accent}20` 
                        : `${colors.textSecondary}20`,
                      color: template.status === 'active' ? colors.accent : colors.textSecondary
                    }}
                  >
                    {template.status}
                  </span>
                </div>
                <div className="text-xs truncate" style={{ color: colors.textSecondary }}>
                  {template.subject}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Template Editor */}
        <div className="lg:col-span-2 p-4 md:p-6">
          {/* Subject Line */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
              Subject Line
            </label>
            <input
              type="text"
              defaultValue={selectedTemplate.subject}
              className="w-full px-4 py-3 rounded-lg border text-sm"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
                color: colors.textPrimary
              }}
            />
          </div>
          
          {/* Variable Tags */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
              Available Variables
            </label>
            <div className="flex flex-wrap gap-2">
              {variableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    navigator.clipboard.writeText(tag);
                  }}
                  className="px-2 py-1 rounded text-xs font-mono transition-all hover:scale-105"
                  style={{
                    backgroundColor: `${colors.accent}20`,
                    color: colors.accent
                  }}
                  title="Click to copy"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          {/* Body Editor */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
              Email Body
            </label>
            <textarea
              rows={12}
              defaultValue={selectedTemplate.body}
              className="w-full px-4 py-3 rounded-lg border text-sm font-mono"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
                color: colors.textPrimary
              }}
            />
          </div>
          
          {/* Preview Toggle */}
          <div className="mb-4 flex items-center gap-3">
            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
              Preview:
            </span>
            <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: colors.background }}>
              <button
                onClick={() => setPreviewMode('desktop')}
                className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all"
                style={{
                  backgroundColor: previewMode === 'desktop' ? colors.accent : 'transparent',
                  color: previewMode === 'desktop' ? '#FFFFFF' : colors.textSecondary
                }}
              >
                <Mail className="w-3 h-3" />
                Desktop
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all"
                style={{
                  backgroundColor: previewMode === 'mobile' ? colors.accent : 'transparent',
                  color: previewMode === 'mobile' ? '#FFFFFF' : colors.textSecondary
                }}
              >
                <Smartphone className="w-3 h-3" />
                Mobile
              </button>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
              style={{
                background: `linear-gradient(to right, ${colors.accent}, #00B39F)`
              }}
            >
              Save Template
            </button>
            <button
              className="px-4 py-2 rounded-lg border text-sm font-medium transition-all hover:scale-105"
              style={{
                borderColor: colors.cardBorder,
                color: colors.textPrimary,
                backgroundColor: colors.background
              }}
            >
              Send Test Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
