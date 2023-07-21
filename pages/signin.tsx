export default function () {
  return null
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/auth/email-signin',
      permanent: false,
    },
  }
}