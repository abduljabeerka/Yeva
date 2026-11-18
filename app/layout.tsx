import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title:'YEVA MED — Medical Wear & Healthcare Essentials', description:'Premium medical wear, medical instruments and course-wise healthcare essentials. We engineer comfort. We design confidence.', metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'https://yeva.example'), openGraph:{title:'YEVA MED — Medical Wear & Healthcare Essentials',description:'Premium medical wear, made for those who care.',type:'website'} };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
