import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <div className='bg-white-300 pt-44 pb-24'>
      <div className='max-w-screen-xl w-full mx-auto px-6 sm:px-8 lg:px-16 grid grid-rows-6 sm:grid-rows-1 grid-flow-row sm:grid-flow-col grid-cols-3 sm:grid-cols-12 gap-4'>
        <div className='row-span-2 sm:col-span-4 col-start-1 col-end-4 sm:col-end-5 flex flex-col items-start '>
          <p className='h-8 w-auto mb-6'>Michel Ribeiro</p>

          <div className='flex w-full mt-2 mb-8 -mx-2'>
            <div className='mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md'>
              <Link href='https://www.linkedin.com/in/michelribeiro/'>
                <a>Linkedin</a>
              </Link>
            </div>
          </div>
          <p className='text-gray-400'>©2020 Michel Ribeiro</p>
        </div>

        <div className='row-span-2 sm:col-span-2 sm:col-start-9 sm:col-end-11 flex flex-col'>
          <p className='text-black-600 mb-4 font-medium text-lg'>
            Entre em contato
          </p>
          <ul className='text-black-500'>
            <li className='my-2 hover:text-orange-500 cursor-pointer transition-all'>
              michel.ribeiro@michelribeiro.com.br
            </li>
            <li className='my-2 hover:text-orange-500 cursor-pointer transition-all'>
              21 97904-4440
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
