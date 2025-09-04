export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email } = body

  try {
    const response = await fetch('https://api.mailerlite.com/api/v2/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-MailerLite-ApiKey': process.env.MAILERLITE_API_KEY
      },
      body: JSON.stringify({
        email,
        groups: [process.env.MAILERLITE_GROUP_ID]
      })
    })

    if (!response.ok) {
      throw new Error('Failed to subscribe')
    }

    return {
      success: true,
      message: 'Successfully subscribed!'
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to subscribe. Please try again.'
    }
  }
}) 