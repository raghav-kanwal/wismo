import { number } from 'yup'

import gateway from './gateway'

const BASE_PATH = 'https://unilog.unicommerce.com'
const OTP_PATH = 'https://unicommunication.unicommerce.com'
// const BASE_PATH = 'http://localhost:4001'
// const OTP_PATH = 'http://localhost:4001'

export async function fetchTracking(tracking_number: string, data?: any): Promise<any> {
  const res = await gateway(
    `${BASE_PATH}/api/buyer/tracking`,
    'POST',
    JSON.stringify({
      tracking_number: tracking_number,
      ...(data && {
        shipping_provider_code: data.shipping_provider_code,
        tenant_code: data.tenant_code,
        facility_code: data.facility_code,
        refresh_required: 1
      })
    }),
    'BASE'
  )
  return res.json()
}

export async function sendOTP(phoneNumber: string): Promise<any> {
  const res = await gateway(
    `${OTP_PATH}/communication/v1/otp/send`,
    'POST',
    JSON.stringify({
      recipient: phoneNumber,
      channel: 'SMS'
    }),
    'otp'
  )
  if (!res.ok) throw new Error(res.statusText)
  return res.json()
}

export async function verifyOTP(otpRequestId: string, otp: string): Promise<any> {
  const res = await gateway(
    `${OTP_PATH}/communication/v1/otp/verify`,
    'PATCH',
    JSON.stringify({
      otp_request_id: otpRequestId,
      otp: otp
    }),
    'otp'
  )
  if (!res.ok) throw new Error(res.statusText)
  return res.json()
}

export async function resendOTP(otpRequestId: string): Promise<any> {
  const res = await gateway(
    `${OTP_PATH}/communication/v1/otp/resend`,
    'PATCH',
    JSON.stringify({
      otp_request_id: otpRequestId
    }),
    'otp'
  )
  if (!res.ok) throw new Error(res.statusText)
  return res.json()
}

export async function submitFeedback(feedback: FeedbackProps): Promise<any> {
  const res = await gateway(
    `${BASE_PATH}/api/buyer/share-feedback`,
    'POST',
    JSON.stringify({
      brand_rating: feedback.brandRating,
      shipping_rating: feedback.shippingRating,
      comments: feedback.feedback,
      phone_number: feedback.phone,
      tenant_code: feedback.tenant,
      awb: feedback.trackingNumber
    }),
    'base'
  )
  if (!res.ok) throw new Error(res.statusText)
  return res.json()
}

interface FeedbackProps {
  brandRating: number
  shippingRating: number
  feedback: string
  phone: string | number
  tenant: string
  trackingNumber: string
}
