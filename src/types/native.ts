import React, { ChangeEventHandler, ClipboardEventHandler } from "react";

export type WithClassName = {
  className?: string;
};

export type WithStyle = {
  style?: React.CSSProperties;
};

export type WithReactEventHandlers<T> = {
  onChange?: ChangeEventHandler<T>;
  onPaste?: ClipboardEventHandler<T>;
};

export type WithBaseElementProps = WithClassName &
  WithStyle & {
    id?: string;
  };

export type WithBaseInputProps = WithBaseElementProps &
  WithReactEventHandlers<HTMLInputElement> & {
    value?: string;
    placeholder?: string;
    name?: string;
  };
