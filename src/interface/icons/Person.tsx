import React from 'react';

type Props = Omit<React.ComponentPropsWithoutRef<'svg'>, 'xmlns' | 'viewBox' | 'className'>;

// https://thenounproject.com/search/?q=person&i=3090778
// person by Marc Torrada from the Noun Project
const Icon = (props: Props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="icon" {...props}>
    <path d="M51.7,46.5c-10.1,0-18.3-8.2-18.3-18.3S41.6,9.9,51.7,9.9S70,18.1,70,28.2S61.8,46.5,51.7,46.5z M51.7,14.9  c-7.4,0-13.3,6-13.3,13.3s6,13.3,13.3,13.3S65,35.6,65,28.2S59,14.9,51.7,14.9z" />
    <path d="M51.7,88.5c-14.4,0-27.6-1.9-28.2-2l-2.1-0.3V65.4c0-8.5,7.7-15.8,19.5-18.8l1-0.2l0.9,0.5c5.5,3,12.5,3,18,0l0.9-0.5l1,0.2  C74.3,49.6,82,57,82,65.4v20.8l-2.1,0.3C79.3,86.6,66,88.5,51.7,88.5z M26.3,81.8c4.3,0.5,14.7,1.7,25.3,1.7c10.7,0,21-1.1,25.3-1.7  V65.4c0-5.8-5.9-11.2-14.8-13.7c-6.5,3.2-14.5,3.2-21,0c-8.9,2.5-14.8,7.9-14.8,13.7C26.3,65.4,26.3,81.8,26.3,81.8z" />
  </svg>
);

export default Icon;
