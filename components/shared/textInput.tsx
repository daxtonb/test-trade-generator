import React from 'react';

type Props = {
  label: string;
  value: any;
  onChange: (value: any) => void;
};

export default ({ label, value, onChange, key }: Props) => {
  const name = label.replace(' ', '-');
  return (
    <div className="input-group">
      <label htmlFor={name}>{label}</label>
      <input
        name={name}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        key={key}
      />
    </div>
  );
};
