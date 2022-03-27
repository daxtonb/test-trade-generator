import React from 'react';

type Props = {
  label: string;
  minDefault: number;
  maxDefault: number;
  onMinChange: (value: any) => void;
  onMaxChange: (value: any) => void;
};

export default ({
  label,
  minDefault,
  maxDefault,
  onMinChange,
  onMaxChange,
}: Props) => {
  const minName = label + '-min';
  const maxName = label + '-max';

  return (
    <div className="input-group">
      <label>{label}</label>
      <br />
      <label htmlFor={minName}>Min</label>
      <input
        name={minName}
        defaultValue={minDefault.toString()}
        onChange={(e) => onMinChange(e.target.value)}
      />
      <label
        htmlFor={maxName}
        defaultValue={maxDefault.toString()}
        onChange={(e) => onMaxChange(e.target.value)}
      >
        Max
      </label>
      <input name={maxName} />
    </div>
  );
};
