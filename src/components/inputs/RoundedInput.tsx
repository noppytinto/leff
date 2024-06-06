import React from "react";
import { WithBaseInputProps } from "../../types/native";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type Props = WithBaseInputProps;

export const RoundedInput = React.forwardRef(function RoundedInput(
  { className, onChange, ...rest }: Props,
  ref: React.Ref<HTMLInputElement>,
) {
  const [value, setValue] = React.useState("");

  return (
    <div className="relative">
      <input
        ref={ref}
        type="text"
        className={
          "h-12 w-96 rounded-full border border-solid border-gray-100 px-4 py-2 shadow-md " +
          className
        }
        value={value}
        onChange={(ev) => {
          setValue(ev.target.value);
          onChange(ev);
        }}
        {...rest}
      />
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-white p-2"
        onClick={(ev) => {
          setValue("");
          onChange({ target: { value: "" } } as any);
        }}
      >
        <FontAwesomeIcon icon={faXmark} className="text-red-200" size="lg" />
      </button>
    </div>
  );
});
