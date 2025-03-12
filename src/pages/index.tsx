import React, { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useLocalStorage } from '@/hooks';

const Home = () => {
  const [workHours, setWorkHours] = useState(0); // Hours
  const [workMinutes, setWorkMinutes] = useState(0); // Minutes
  const [arrivalTime, setArrivalTime] = useState('');
  const [lunchHours, setLunchHours] = useState(0); // Hours
  const [lunchMinutes, setLunchMinutes] = useState(0); // Minutes
  const [leaveTime, setLeaveTime] = useState<Dayjs | null>(null);
  const [launchInclude, setLaunchInclude] = useState(true);
  const [localTotalWorkTime, setLocalTotalWorkTime] = useLocalStorage(
    'totalWorkTime',
    ''
  );
  const [localTotalLaunchTime, setLocalTotalLaunchTime] = useLocalStorage(
    'totalLaunchTime',
    ''
  );

  const today = dayjs().format('YYYY-MM-DD');

  const isAfterLeaveTime = dayjs().isAfter(leaveTime);

  const renderWorkTimeInput = (): React.ReactNode => {
    return (
      <>
        <h2 className='text-lg font-bold mb-4 text-black'>
          근무시간을 입력해주세요
        </h2>
        <div className='flex space-x-2 mb-4'>
          <input
            type='text'
            placeholder='시간 (Hours)'
            value={workHours}
            onChange={(e) => setWorkHours(Number(e.target.value))}
            className='border border-gray-300 rounded-lg p-2 w-24 text-black'
          />
          <label className='text-lg font-bold mb-4 text-black'>시간</label>
          <input
            type='text'
            placeholder='분 (Minutes)'
            value={workMinutes}
            onChange={(e) => setWorkMinutes(Number(e.target.value))}
            className='border border-gray-300 rounded p-2 w-24 text-black'
          />
          <label className='text-lg font-bold mb-4 text-black'>분</label>
        </div>
        {/* 점심포함 */}
        <div className='flex space-x-2 mb-4'>
          <input
            type='checkbox'
            checked={launchInclude}
            onChange={(e) => setLaunchInclude(e.target.checked)}
            className='w-4 h-4 text-black border-gray-300 focus:ring-black'
          />
          <label className='text-lg font-bold mb-4 text-black'>
            점심시간 포함(1시간)
          </label>
        </div>
        {/* 점심시간 */}
        {!launchInclude && (
          <>
            <h2 className='text-lg font-bold mb-4 text-black'>점심시간</h2>
            <div className='flex space-x-2 mb-4'>
              <input
                type='number'
                placeholder='시간 (Hours)'
                value={lunchHours}
                onChange={(e) => setLunchHours(Number(e.target.value))}
                className='border border-gray-300 rounded-lg p-2 w-24 text-black'
              />
              <label className='text-lg font-bold mb-4 text-black'>시간</label>
              <input
                type='number'
                placeholder='분 (Minutes)'
                value={lunchMinutes}
                onChange={(e) => setLunchMinutes(Number(e.target.value))}
                className='border border-gray-300 rounded-lg p-2 w-24 text-black'
              />
              <label className='text-lg font-bold mb-4 text-black'>분</label>
            </div>
          </>
        )}
        <button
          onClick={() => {
            setLocalTotalWorkTime(`${workHours}:${workMinutes}`);
            setLocalTotalLaunchTime(`${lunchHours}:${lunchMinutes}`);
          }}
          className='bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition'
        >
          {localTotalWorkTime ? '수정하기' : '저장하기'}
        </button>
      </>
    );
  };

  // useEffect(() => {
  //   console.log(workHours);
  //   console.log(workMinutes);
  // }, [workHours, workMinutes]);

  useEffect(() => {
    // console.log(localTotalWorkTime);
    // console.log(localTotalLaunchTime);
    if (localTotalWorkTime) {
      setWorkHours(
        localTotalWorkTime ? Number(localTotalWorkTime.split(':')[0]) : 0
      );
      setWorkMinutes(
        localTotalWorkTime ? Number(localTotalWorkTime.split(':')[1]) : 0
      );
    }
    if (localTotalLaunchTime) {
      setLunchHours(
        localTotalLaunchTime ? Number(localTotalLaunchTime.split(':')[0]) : 0
      );
      setLunchMinutes(
        localTotalLaunchTime ? Number(localTotalLaunchTime.split(':')[1]) : 0
      );
    }
  }, [localTotalWorkTime, localTotalLaunchTime]);

  const calculateLeaveTime = () => {
    const arrival = dayjs(`${today} ${arrivalTime}`, 'YYYY-MM-DD HH:mm');
    const totalWorkHours = workHours + workMinutes / 60; // Convert to decimal hours
    const totalLunchHours = launchInclude ? 1 : lunchHours + lunchMinutes / 60; // Convert to decimal hours

    const leaveTime = totalLunchHours
      ? arrival.add(totalWorkHours, 'hour').add(totalLunchHours, 'hour')
      : arrival.add(totalWorkHours, 'hour');

    return setLeaveTime(leaveTime);
  };

  useEffect(() => {
    if (arrivalTime && (workHours || workMinutes)) calculateLeaveTime();
  }, [arrivalTime, workHours, workMinutes, launchInclude]);

  // log dayjs(leaveTime).diff(dayjs(arrivalTime)
  useEffect(() => {
    // console.log(leaveTime);
    // console.log(arrivalTime);
    // console.log(dayjs(arrivalTime).format('YYYY-MM-DD HH:mm'));
    console.log(
      dayjs(leaveTime).diff(
        dayjs(`${today} ${arrivalTime}`, 'YYYY-MM-DD HH:mm')
      )
    );
  }, [leaveTime, arrivalTime]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-white p-4'>
      {localTotalWorkTime ? (
        <>
          <h3 className='text-lg font-bold mb-4 text-black'>
            근무시간 {dayjs(today + localTotalWorkTime).format('HH시간 mm분')}
            <span className='text-sm text-gray-500'>
              점심시간{' '}
              {localTotalLaunchTime === '0:0'
                ? '1시간'
                : dayjs(today + localTotalLaunchTime).format('HH시간 mm분')}
            </span>
          </h3>
          <button
            onClick={() => {
              setLocalTotalWorkTime('');
              setLocalTotalLaunchTime('');
            }}
          >
            수정하기
          </button>
        </>
      ) : (
        renderWorkTimeInput()
      )}
      {/* 출근시간 */}
      <div className='flex flex-col items-center justify-center'>
        <h2 className='text-lg font-bold mb-4 text-black'>출근시간</h2>
        {/* <div className='flex flex-row items-center justify-center'> */}
        <input
          type='time'
          placeholder='Arrival time'
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)}
          className='border border-gray-300 rounded-lg p-2 text-black text-xl'
        />
        {/* <button
            onClick={calculateLeaveTime}
            className='bg-blue-500 text-white font-semibold py-1 px-2 rounded hover:bg-blue-600 transition'
          >
            계산하기
          </button> */}
        {/* </div> */}
      </div>
      {/* 퇴근시간 */}
      {arrivalTime && leaveTime && (workHours || workMinutes) ? (
        <>
          <h2 className='text-lg font-bold mb-4 text-black'>퇴근시간</h2>
          <div className='mt-4 text-2xl text-blue-500 font-bold text-center'>
            {leaveTime
              .format('A HH:mm')
              .replace('AM', '오전')
              .replace('PM', '오후')}
          </div>
        </>
      ) : null}
      {/* 지금으로 부터... */}
      {arrivalTime &&
        (workHours || workMinutes) &&
        (isAfterLeaveTime ? (
          <h2 className='text-sm font-md mb-4 text-black'>
            퇴근시간을 초과했습니다. 칼퇴하세요!
          </h2>
        ) : (
          <>
            <h2 className='text-lg font-bold mb-4 text-black'>
              지금으로 부터...
            </h2>
            <div className='mt-4 text-xl text-blue-500 font-bold text-center'>
              {dayjs(leaveTime).diff(dayjs(), 'hour')}시간{' '}
              {dayjs(leaveTime).diff(dayjs(), 'minute') % 60}분{' '}
              {dayjs(leaveTime).diff(dayjs(), 'second') % 60}초
            </div>
            <h2 className='text-md font-bold mb-4 text-black'>남았습니다</h2>
          </>
        ))}
    </div>
  );
};

export default Home;
