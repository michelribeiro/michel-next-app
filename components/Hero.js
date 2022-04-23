import React from 'react';
import Image from 'next/image';
import ButtonPrimary from './misc/ButtonPrimary';
const Hero = ({
  listUser = [
    {
      name: 'Users',
      number: '390',
      icon: '/assets/Icon/heroicons_sm-user.svg',
    },
    {
      name: 'Locations',
      number: '20',
      icon: '/assets/Icon/gridicons_location.svg',
    },
    {
      name: 'Server',
      number: '50',
      icon: '/assets/Icon/bx_bxs-server.svg',
    },
  ],
}) => {
  return (
    <div className='max-w-screen-xl mt-24 px-8 xl:px-16 mx-auto' id='about'>
      <div className='grid grid-flow-row sm:grid-flow-col grid-rows-2 md:grid-rows-1 sm:grid-cols-2 gap-8 py-6 sm:py-16 '>
        <div className=' flex flex-col justify-center items-start row-start-2 sm:row-start-1'>
          <h1 className='text-3xl lg:text-4xl xl:text-5xl font-medium text-black-600 leading-normal'>
            Quer sua empresa no mundo <strong>Digital</strong>.
          </h1>
          <p className='text-black-500 mt-4 mb-6'>
            Profissional com mais de 15 anos de experiência, acostumado a
            grandes desafios.
          </p>
          {/* <ButtonPrimary>Get Started</ButtonPrimary> */}
        </div>
        <div className='flex w-full'>
          <div className='h-full w-full'>
            <Image
              src='/assets/Illustration1.png'
              alt='VPN Illustrasi'
              quality={100}
              width={612}
              height={383}
              layout='responsive'
            />
          </div>
        </div>
      </div>
      <div className='relative w-full flex'>
        <div
          className='absolute bg-black-600 opacity-5 w-11/12 roudned-lg h-64 sm:h-48 top-0 mt-8 mx-auto left-0 right-0'
          style={{ filter: 'blur(114px)' }}
        ></div>
      </div>
    </div>
  );
};

export default Hero;
