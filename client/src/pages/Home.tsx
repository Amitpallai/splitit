import Navbar from '@/components/navbar'
import MagicBento from '../components/MagicBento'
import Hero from '@/components/hero'
import { Toaster } from 'sonner'

const Home = () => {
  return (
    <div className=' w-full mx-auto bg-gradient-to-b from-purple-900 via-black to-black overflow-hidden'>
      <Toaster position="top-right" richColors />

      <Navbar />
      <Hero />
      <MagicBento
        textAutoHide={true}
        enableStars={true}
        enableSpotlight={true}
        enableBorderGlow={true}
        enableTilt={true}
        enableMagnetism={true}
        clickEffect={true}
        spotlightRadius={300}
        particleCount={12}
        glowColor="132, 0, 255"

      />
    </div>
  )
}

export default Home