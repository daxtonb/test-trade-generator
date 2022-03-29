import React from 'react';

type Props = {
  label: string;
  minValue: number;
  maxValue: number;
  onMinChange: (value: any) => void;
  onMaxChange: (value: any) => void;
};

export default ({
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: Props) => {
  const minName = label + '-min';
  const maxName = label + '-max';
  console.log(minValue)
  return (
    <div className="input-group">
      <label>{label}</label>
      <br />
      <label htmlFor={minName}>Min</label>
      <input
        name={minName}
        value={minValue}
        onChange={(e) => onMinChange(e.target.value)}
      />
      <label htmlFor={maxName}>Max</label>
      <input
        name={maxName}
        value={maxValue}
        onChange={(e) => onMaxChange(e.target.value)}
      />
    </div>
  );
};
