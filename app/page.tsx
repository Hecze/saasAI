'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/main');
  }, [router]);
  
  // Return null instead of DOM elements to avoid any potential nesting conflicts
  return null;
}
