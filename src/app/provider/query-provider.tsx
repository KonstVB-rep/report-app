// import {
//     QueryClient,
//     QueryClientProvider,
//   } from '@tanstack/react-query'
// import { PropsWithChildren, useState } from 'react'



//   const QueryProvider = ({ children }: PropsWithChildren) => {
//     const [queryClient] = useState(() => new QueryClient())
  
//     return (
//       <QueryClientProvider client={queryClient}>
//         {children}
//       </QueryClientProvider>
//     )
//   }

//   export default QueryProvider


import {
    QueryClient,
    QueryClientProvider,isServer
  } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'

function makeQueryClient(){
return new QueryClient({
    defaultOptions:{
      queries: {
        refetchOnWindowFocus: false, 
        staleTime: 1000 * 60 * 5
      }
    }
})
}


let browserQueryClient: QueryClient | undefined = undefined;
export const getQueryClient =()=>{
  if(isServer){
    return makeQueryClient()
  }
  else{
    if(!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient
  }
}

  const QueryProvider = ({ children }: PropsWithChildren) => {
    const queryClient = getQueryClient()
  
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }

  export default QueryProvider
