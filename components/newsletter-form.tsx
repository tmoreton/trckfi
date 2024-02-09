const Newsletter = () => {
  return (
    <div className="relative isolate overflow-hidden bg-pink-600 p-10 shadow-2xl lg:rounded-3xl sm:px-12 max-w-4xl mx-auto">
      <>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl mb-6 text-center">
          Join Trckfi Community
        </h2>
        {/* <p className="text-white my-4">Sign up today, and gain early access when we launch Trckfi along with <b>3 months free</b>!</p> */}
        <form action="https://rewrite.blog/notion/subscribe" method="post">
          <div className="mx-auto flex max-w-md gap-x-4" >
            <input placeholder="Name" name="name" type="text" required className="min-w-0 flex-auto rounded-3xl border-0 bg-white px-3.5 py-2 shadow-sm ring-1 ring-inset ring-white/10 sm:text-sm sm:leading-6"/> 
            <input placeholder="Email" name="email" type="email" required className="min-w-0 flex-auto rounded-3xl border-0 bg-white px-3.5 py-2 shadow-sm ring-1 ring-inset ring-white/10 sm:text-sm sm:leading-6"/> 
            <input hidden name="id" type="text" value="cls9n0gpo00003yohzura0zyx"/> 
            <input hidden name="success_url" type="text" value="https://www.trckfi.com"/> 
          </div>
          <div className="mx-auto flex max-w-md gap-x-4" >
            <input type="submit" value="Subscribe" className="flex-none w-full rounded-3xl mt-4 bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:none focus-visible:outline-offset-2 focus-visible:outline-white"/> 
          </div>
        </form> 
      </>
    </div>
  )
}

export default Newsletter