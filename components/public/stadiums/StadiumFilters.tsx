import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import React from 'react'
import { CiFilter } from "react-icons/ci";

const StadiumFilters = () => {
  return (
    <div className='p-3 sm:p-4 lg:p-5'>
      <div className='flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/50 dark:bg-zinc-800/50 rounded-xl sm:rounded-2xl max-w-4xl mx-auto shadow-sm dark:shadow-zinc-900/30'>

        {/* Search Input - Takes full width on mobile, grows on desktop */}
        <div className='w-full sm:flex-1'>
          <Input
            variant='bordered'
            placeholder="Rechercher un stade..."
            className='w-full'
            size='md'
            classNames={{
              input: "text-sm sm:text-base",
            }}
          />
        </div>

        {/* Filter Button - Full width on mobile, auto width on desktop */}
        <Button
          color='warning'
          startContent={<CiFilter size={20} className='sm:size-[22px]' />}
          className='w-full sm:w-auto min-w-[150px]'
          size='md'
        >
          <span className='text-sm sm:text-base'>Filtré par Sport</span>
        </Button>

      </div>
    </div>
  )
}

export default StadiumFilters