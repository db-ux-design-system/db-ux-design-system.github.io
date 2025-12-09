import { appConfig } from '@config';

export const interactiveDemoOptions = [
  {
    id: 'neutral-light',
    color: 'neutral',
    variant: 'filled',
    src: `${appConfig.basePath}assets/interactive-demo/Neutral--Lightmode--C.png`,
    label: 'Neutral',
  },
  {
    id: 'db-light',
    icon: 'db',
    color: 'red',
    variant: 'filled',
    src: `${appConfig.basePath}assets/interactive-demo/DB--Lightmode--C.png`,
    label: 'Deutsche Bahn',
  },
  {
    id: 'sbahn-light',
    icon: 's_bahn',
    color: 'green',
    variant: 'filled',
    src: `${appConfig.basePath}assets/interactive-demo/SB--Lightmode--C.png`,
    label: 'S-Bahn',
  },
  {
    id: 'ri-light',
    icon: 'train_station',
    color: 'blue',
    variant: 'filled',
    src: `${appConfig.basePath}assets/interactive-demo/RI--Lightmode--C.png`,
    label: 'Station & Service',
  },
];

export const interactiveDemoDefaultOptionId = 'db-light';
