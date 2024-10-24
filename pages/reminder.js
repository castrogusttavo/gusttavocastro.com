import React from 'react'
import Head from 'next/head'
import Base from '../layouts/Base'
import { Box } from '../components/Box'

export async function getStaticProps() {
  const meta = {
    title: 'Reminder // Gusttavo Castro',
    description:
      'Time is the most important asset. Time does not equal money. Time equals life. And you only have one chance to make it right.',
    tagline: 'Press On!',
    image: '/static/images/reminder-bw.jpg',
    primaryColor: 'cyan',
    secondaryColor: 'green',
  }

  return { props: meta }
}

function Reminder(props) {
  const { title, description, image } = props

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta content={title} property="og:title" />
        <meta content={description} name="description" />
        <meta content={description} property="og:description" />
        <meta content="https://castrogusttavo.com/reminder" property="og:url" />
        <meta content={`https://castrogusttavo.com${image}`} property="og:image" />
      </Head>

      <Box css={{ textAlign: 'justify' }}>
        <p>
          <strong>Nothing in this world can take the place of good old persistence.</strong>{' '} Talent will not; nothing is
          more common than unsuccessful people with talent. Genius will not; unrewarded genius is almost a proverb.
          Education will not; the world is full of educated derelicts. {' '}
          <strong>Persistence and determination alone are omnipotent.</strong>.
          The slogan <strong>'Press On!'</strong> has solved and always will solve the problems of the human race.
        </p>
        <p>
          <em>- by Calvin Coolidge</em>
        </p>
      </Box>
    </>
  )
}

Reminder.Layout = Base

export default Reminder
