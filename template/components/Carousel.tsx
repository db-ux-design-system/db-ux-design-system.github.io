import React, { useMemo, useState } from 'react';
import { DBButton, DBStack } from '@db-ux/react-core-components';

type CarouselProps = {
  children: React.ReactNode[] | React.ReactNode;
  ariaLabel?: string;
};

export const Carousel: React.FC<CarouselProps> = ({ children, ariaLabel }) => {
  const items = useMemo(() => (Array.isArray(children) ? children : [children]), [children]);
  const [index, setIndex] = useState(0);

  const count = items.length;
  const goPrev = () => setIndex((i) => (i - 1 + count) % count);
  const goNext = () => setIndex((i) => (i + 1) % count);

  return (
    <div className="dbux-carousel" aria-label={ariaLabel}>
      {/* viewport */}
      <div className="dbux-carousel__viewport" data-count={count}>
        {items.map((item, i) => (
          <div
            key={i}
            className="dbux-carousel__item"
            aria-hidden={i !== index}
            style={{ display: i === index ? 'block' : 'none' }}
          >
            {item as React.ReactNode}
          </div>
        ))}
      </div>
      {/* controls */}
      <DBStack direction="row" gap="medium">
        <DBButton icon="chevron_left" noText aria-label="Previous" onClick={goPrev} />
        <DBButton icon="chevron_right" noText aria-label="Next" onClick={goNext} />
      </DBStack>
    </div>
  );
};
