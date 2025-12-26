import { Link } from 'react-router-dom'
import { FileQuestion, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const NotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6'>
      <div className='w-24 h-24 bg-dark-elevated rounded-full flex items-center justify-center mb-4'>
        <FileQuestion className='h-12 w-12 text-accent-primary' />
      </div>
      <div className='space-y-2'>
        <h1 className='text-4xl font-bold text-white'>404 - Page Not Found</h1>
        <p className='text-gray-400 max-w-md mx-auto'>
          The page you are looking for doesn't exist or has been moved. Please check the URL or return to the dashboard.
        </p>
      </div>
      <Button asChild variant='default' className='bg-accent-primary hover:bg-accent-primary/90 mt-4'>
        <Link to='/' className='flex items-center gap-2'>
          <ArrowLeft className='h-4 w-4' />
          Back to Dashboard
        </Link>
      </Button>
    </div>
  )
}







