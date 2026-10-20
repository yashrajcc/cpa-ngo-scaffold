import type { GlobalConfig } from 'payload'

export const OrgProfile: GlobalConfig = {
  slug: 'org-profile',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true, defaultValue: 'Demo NGO' },
    { name: 'tagline', type: 'text' },
    {
      name: 'layer',
      type: 'select',
      defaultValue: 'publish',
      options: [
        { label: 'Publish', value: 'publish' },
        { label: 'Engage', value: 'engage' },
        { label: 'Operate', value: 'operate' },
      ],
      admin: {
        description: 'Feature layer flag — Engage/Operate UI gated later.',
      },
    },
    { name: 'aboutBlurb', type: 'textarea' },
    { name: 'contactEmail', type: 'email' },
    { name: 'contactPhone', type: 'text' },
    {
      name: 'razorpayKeyId',
      type: 'text',
      admin: {
        description: 'Public Razorpay Key ID only. Secret stays in web/server env.',
      },
    },
    {
      name: 'donatePresetsInr',
      type: 'text',
      defaultValue: '100,500,1000',
      admin: { description: 'Comma-separated INR presets for Donate CTA' },
    },
  ],
}
