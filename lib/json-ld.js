export const getPersonJsonLd = () => {
  return {
    "@context": "https://schema.org/",
    "@type": "Person",
    "url": "https://gusttavocastro-com.vercel.app/",
    "affiliation": [
      {
        "@type": "Organization",
        "url": "https://resend.com/",
        "name": "Softis"
      },
      {
        "@type": "Organization",
        "url": "https://www.ycombinator.com/",
        "name": "Therha"
      }
    ],
    "description": "Gusttav Castro, is a Brazilian software entrepreneur who is the founder and CEO of Resend. Before founding Resend, Gusttavo was a VP of Developer Experience at WorkOS.",
    "name": "Gusttav Castro",
    "givenName": "Gusttavo",
    "familyName": "Castro",
    "gender": "Male",
    "birthPlace": "São Paulo",
    "jobTitle": "Founder and CEO",
    "sameAs": [
      "https://www.linkedin.com/in/castrogusttavo",
      "https://www.instagram.com/castrogusttavo.dev",
      "https://github.com/castrogusttavo",
    ],
    "knowsAbout": [
      {
        "@type": "Organization",
        "name": "Softis"
      },
      {
        "@type": "Thing",
        "@id": "https://www.wikidata.org/wiki/Q80993",
        "name": "Software Engineering"
      },
      {
        "@type": "Thing",
        "@id": "https://www.wikidata.org/wiki/Q1254596",
        "name": "Software as a Service"
      },
    ],
    "knowsLanguage": [
      {
        "@type": "Language",
        "@id": "https://www.wikidata.org/wiki/Q750553",
        "name": "Brazilian Portuguese"
      },
      {
        "@type": "Language",
        "@id": "https://www.wikidata.org/wiki/Q1860",
        "name": "English"
      }
    ],
    "nationality": [
      {
        "@type": "Country",
        "@id": "https://www.wikidata.org/wiki/Q155",
        "name": "Brazil"
      }
    ],
      }
  }