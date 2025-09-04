import { defineStore } from 'pinia'

export const useMailerStore = defineStore('mailer', {
  state: () => ({
    isLoading: false,
    error: null,
    apiKey: import.meta.env.VITE_MAILERLITE_API_KEY,
    baseUrl: 'https://connect.mailerlite.com/api'
  }),

  actions: {
    async subscribeToAuthor(authorId, userEmail, userName = '') {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await fetch(`${this.baseUrl}/subscribers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            email: userEmail,
            name: userName,
            groups: [`author-${authorId}`], // Group for following specific author
            status: 'active',
            subscribed_at: new Date().toISOString(),
            fields: {
              following_author: authorId
            }
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to subscribe')
        }

        const data = await response.json()
        return data
      } catch (error) {
        this.error = error.message
        console.error('Error subscribing to author:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async unsubscribeFromAuthor(authorId, userEmail) {
      this.isLoading = true
      this.error = null
      
      try {
        // First get the subscriber to check their status
        const response = await fetch(`${this.baseUrl}/subscribers/${userEmail}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to find subscriber')
        }

        const subscriber = await response.json()

        // Update subscriber to remove them from the author's group
        const updateResponse = await fetch(`${this.baseUrl}/subscribers/${subscriber.data.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            groups: subscriber.data.groups.filter(group => group !== `author-${authorId}`),
            fields: {
              following_author: null
            }
          })
        })

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json()
          throw new Error(errorData.message || 'Failed to unsubscribe')
        }

        return await updateResponse.json()
      } catch (error) {
        this.error = error.message
        console.error('Error unsubscribing from author:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async checkSubscriptionStatus(userEmail, authorId) {
      try {
        const response = await fetch(`${this.baseUrl}/subscribers/${userEmail}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        })

        if (!response.ok) {
          return false
        }

        const data = await response.json()
        return data.data.groups.includes(`author-${authorId}`)
      } catch (error) {
        console.error('Error checking subscription status:', error)
        return false
      }
    },

    async sendNewPostNotification(authorId, post) {
      this.isLoading = true
      this.error = null
      
      try {
        // Create a campaign for the new post
        const response = await fetch(`${this.baseUrl}/campaigns`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            name: `New Post: ${post.title}`,
            groups: [`author-${authorId}`],
            type: 'regular',
            subject: `New Post from ${post.author.name}: ${post.title}`,
            from: 'Sacred Lore <your-email@domain.com>',
            content: {
              html: `
                <h2>New Post Published!</h2>
                <h3>${post.title}</h3>
                <p>${post.excerpt || post.description}</p>
                <a href="${post.url}">Read More</a>
                <p>---</p>
                <p>You received this email because you follow ${post.author.name} on Sacred Lore.</p>
                <p><small>To unsubscribe from these notifications, click the unsubscribe link below.</small></p>
              `
            }
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to send notification')
        }

        return await response.json()
      } catch (error) {
        this.error = error.message
        console.error('Error sending post notification:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async sendNewPostAlert(post) {
      this.isLoading = true
      this.error = null
      
      try {
        // Create a campaign for all subscribers
        const response = await fetch(`${this.baseUrl}/campaigns`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            name: `New Post Alert: ${post.title}`,
            groups: [process.env.MAILERLITE_GROUP_ID], // Send to all subscribers
            type: 'regular',
            subject: `New Post on Sacred Lore: ${post.title}`,
            from: 'Sacred Lore <your-email@domain.com>',
            content: {
              html: `
                <h2>New Post Alert!</h2>
                <h3>${post.title}</h3>
                <p>${post.excerpt || post.description}</p>
                <a href="${post.url}">Read More</a>
                <p>---</p>
                <p>You received this email because you're subscribed to Sacred Lore.</p>
                <p><small>To unsubscribe from these alerts, click the unsubscribe link below.</small></p>
              `
            }
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to send alert')
        }

        return await response.json()
      } catch (error) {
        this.error = error.message
        console.error('Error sending post alert:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})