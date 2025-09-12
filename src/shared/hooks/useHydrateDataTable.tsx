import { useEffect, useState } from 'react'


const useHydrateDataTable = () => {
    const [isHydrating, setIsHydrating] = useState(true);
  
    useEffect(() => {
      setIsHydrating(false);
    }, []);
  
    return isHydrating
}

export default useHydrateDataTable