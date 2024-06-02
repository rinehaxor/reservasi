'use client';

import * as React from 'react';

import { DateRange } from 'react-day-picker';
import { addDays, format, isBefore, startOfDay } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';

import { useAtom } from 'jotai';
import { bookingDetailsAtom } from '@/components/atoms/bookingStore';

interface DatePickerWithRangeProps {
   date: DateRange | undefined;
   setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

export function DatePickerWithRange({ date, setDate }: DatePickerWithRangeProps) {
   // Create a function to determine if a day should be disabled

   const onSelect = (selectedDates: any) => {
      console.log('Selected Dates:', selectedDates);
      setDate(selectedDates);
   };

   return (
      <div className={cn('grid gap-2  ')}>
         <Popover>
            <PopoverTrigger asChild>
               <Button id="date" variant={'outline'} className={cn(' justify-start text-left font-normal w-[250px]', !date && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                     date.to ? (
                        <>
                           {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                        </>
                     ) : (
                        format(date.from, 'LLL dd, y')
                     )
                  ) : (
                     <span>Pilih Tanggal</span>
                  )}
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
               <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={onSelect} numberOfMonths={2} />
            </PopoverContent>
         </Popover>
      </div>
   );
}
