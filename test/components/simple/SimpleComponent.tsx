import React from 'react';

interface SimpleComponentProps {
  text: string;
}

export const SimpleComponent: React.FC<SimpleComponentProps> = ({ text }) => {
  return <div data-testid="simple-component">{text}</div>;
};
