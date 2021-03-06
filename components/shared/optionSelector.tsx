import React from 'react';

type Props = {
  label: string;
  options: { [s: string]: string };
  onChange: (value: string) => void;
  value: any;
  includeMixed?: boolean;
};

export default ({ label, options, onChange, value, includeMixed }: Props) => {
  const keyValues: string[][] = Object.entries(options);
  if (includeMixed) {
    keyValues.push(['mixed', '']);
  }

  return (
    <div className="input-group">
      <label htmlFor={label}>{label}</label>
      <select name={label} value={value} onChange={(e) => onChange(e.target.value)}>
        {keyValues.map(([key, value], index) => (
          <option key={index} value={value}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
};
