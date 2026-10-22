import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title:'RepRadar | Stakeholder intelligence',icons:{icon:'/assets/repradar-mark-color.svg'},description:'Listen closely. Decide confidently. A human-centered Corporate Affairs intelligence prototype for the UZH.ai hackathon.' };
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>;}
