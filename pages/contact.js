import React from 'react'
import Head from 'next/head'
import Base from '../layouts/Base'
import stripHtml from '../lib/strip-html'
import Toast from '../components/Toast'
import { Box } from '../components/Box'
import { styled } from '../stitches.config'

export async function getStaticProps() {
  const meta = {
    title: 'Contact // Gusttavo Castro',
    tagline: 'Email me. Like in the old days.',
    image: '/static/images/reminder-bw.jpg',
    primaryColor: 'cyan',
    secondaryColor: 'green',
  }

  return { props: meta }
}

function Contact(props) {
  const { title, image } = props
  const description = `<strong>I enjoy engaging</strong> with software engineers, tech founders, students, and creative minds. <strong>I'm quite the busy bee</strong>, so while I can't guarantee an instant reply to your email, I'll certainly strive to get back to you as soon as I can!`
  const [isEmailSent, setIsEmailSent] = React.useState(undefined)
  const [showToast, setShowToast] = React.useState(false)

  const onSendEmail = async (e) => {
    e.preventDefault()

    try {
      const isProd = process.env.NODE_ENV === 'production'
      const base = isProd ? 'https://castrogusttavo.vercel.app' : 'http://localhost:3000'

      const response = await fetch(`${base}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: e.target.name.value,
          email: e.target.email.value,
          message: e.target.message.value,
        }),
      })

      if (response.ok) {
        setIsEmailSent(true)
      } else {
        const data = await response.json();
        console.error('Error response:', data);
        setIsEmailSent(false)
      }
      setShowToast(true)
    }
    catch(e) {
      console.error('Fetch error:', e)
      setIsEmailSent(false)
      setShowToast(true)
    }
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta content={title} property="og:title" />
        <meta content={stripHtml(description)} name="description" />
        <meta content={stripHtml(description)} property="og:description" />
        <meta content="https://castrogusttavo.vercel.app/contact" property="og:url" />
        <meta content={`https://castrogusttavo.vercel.app${image}`} property="og:image" />
      </Head>

      <Box>
        <p dangerouslySetInnerHTML={{ __html: description }} />
        <h2>Send an email</h2>
        <Form onSubmit={onSendEmail}>
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="Steve Jobs" required />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="steve@jobs.com" required />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="How can I help you?" rows="4" required />
          </FormGroup>
          <FormGroup>
            <Button type="submit">Send</Button>
          </FormGroup>
        </Form>

        <Toast
          title={isEmailSent ? 'Email sent :D' : 'Error :('}
          description={isEmailSent ? 'Thanks for taking the time to write it.' : 'Something wrong happened. Try again later.'}
          isSuccess={isEmailSent}
          showToast={showToast}
          setShowToast={setShowToast}
        />
      </Box>
    </>
  )
}

const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '400px'
})

const FormGroup = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '10px',
})

const Label = styled('label', {
  color: '$secondary',
  textTransform: 'uppercase',
  fontSize: '12px',
  fontWeight: '500'
})

const Input = styled('input', {
  color: '$primary',
  background: 'none',
  border: '1px solid $secondary',
  borderRadius: '$borderRadius',
  padding: '10px',
  '&:focus': { outline: 'none', borderColor: '$cyan' },
})

const Textarea = styled('textarea', {
  color: '$primary',
  background: 'none',
  border: '1px solid $secondary',
  borderRadius: '$borderRadius',
  padding: '10px',
  '&:focus': { outline: 'none', borderColor: '$cyan' },
})

const Button = styled('button', {
  color: '$background',
  background: '#fff',
  border: '1px solid #fff',
  borderRadius: '$borderRadius',
  cursor: 'pointer',
  padding: '10px',
  marginTop: '5px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': { background: 'transparent', borderColor: '$cyan', color: '$cyan' },
  '&:focus': { background: 'transparent', borderColor: '$cyan', color: '$cyan', outline: 'none' },
})

Contact.Layout = Base

export default Contact
