const Newsletter = () => {
  return (
    <div className="relative isolate overflow-hidden bg-pink-600 p-10 shadow-2xl lg:rounded-3xl sm:px-12 max-w-4xl mx-auto">
      <>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl mb-6 text-center">
          Join Trckfi Community
        </h2>
        <form action="https://notion.ly/notion/subscribe" method="post">
          <div className="mx-auto flex max-w-md gap-x-4" >
            <input placeholder="Name" name="name" type="text" required className="min-w-0 flex-auto rounded-3xl border-0 bg-white px-3.5 py-2 shadow-sm ring-1 ring-inset ring-white/10 sm:text-sm sm:leading-6"/> 
            <input placeholder="Email" name="email" type="email" required className="min-w-0 flex-auto rounded-3xl border-0 bg-white px-3.5 py-2 shadow-sm ring-1 ring-inset ring-white/10 sm:text-sm sm:leading-6"/> 
            <input hidden name="rewrite" type="text" />
            <input hidden name="id" type="text" value="8c260412-f011-4887-b91e-024fe1ed25dd"/>
            <input hidden name="notionly" type="text" />
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