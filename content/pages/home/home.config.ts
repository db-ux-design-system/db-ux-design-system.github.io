import { appConfig } from '@config';

export const interactiveDemoOptions = [
  {
    id: 'neutral',
    color: 'neutral',
    variant: 'filled',
    lightSrc: `${appConfig.basePath}assets/interactive-demo/Neutral--Lightmode--C.png`,
    darkSrc: `${appConfig.basePath}assets/interactive-demo/Neutral--Darkmode--C.png`,
    label: 'Neutral',
  },
  {
    id: 'db',
    icon: 'db',
    color: 'red',
    variant: 'filled',
    lightSrc: `${appConfig.basePath}assets/interactive-demo/DB--Lightmode--C.png`,
    darkSrc: `${appConfig.basePath}assets/interactive-demo/DB--Darkmode--C.png`,
    label: 'Deutsche Bahn',
  },
  {
    id: 'sbahn',
    icon: 's_bahn',
    color: 'green',
    variant: 'filled',
    lightSrc: `${appConfig.basePath}assets/interactive-demo/SB--Lightmode--C.png`,
    darkSrc: `${appConfig.basePath}assets/interactive-demo/SB--Darkmode--C.png`,
    label: 'S-Bahn',
  },
  {
    id: 'ri',
    icon: 'train_station',
    color: 'blue',
    variant: 'filled',
    lightSrc: `${appConfig.basePath}assets/interactive-demo/RI--Lightmode--C.png`,
    darkSrc: `${appConfig.basePath}assets/interactive-demo/RI--Darkmode--C.png`,
    label: 'Station & Service',
  },
] as const;

export const interactiveDemoDefaultOptionId = 'db';
