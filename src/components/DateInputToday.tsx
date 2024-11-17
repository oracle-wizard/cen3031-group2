import React, { useState, useEffect } from 'react';

const DateInputUser: React.FC = () => {
  const [todayDate, setTodayDate] = useState<string>('');

  useEffect(() => {
    // Get today's date in the format yyyy-mm-dd
    const today = new Date().toISOString().split('T')[0];
    setTodayDate(today);
  }, []);

  return (
    <input
      type="date"
      className='tw-col-span-1 tw-border tw-pl-4'
      placeholder={todayDate} // Placeholder set to today's date
      value={todayDate} // Value set to today's date
      onChange={(e) => setTodayDate(e.target.value)} // Update state when date changes
    />
  );
};

export default DateInputUser;
