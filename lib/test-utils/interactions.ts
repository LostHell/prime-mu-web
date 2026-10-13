import { createEvent, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

type DirectOptions = Parameters<(typeof userEvent)["click"]>[1];
type TypeOptions = Parameters<(typeof userEvent)["type"]>[2];

/** **********************
 * userEvent abstractions
 *********************** */
export const enterKey = async (
  text: string,
  options?: DirectOptions,
): Promise<void> => {
  await userEvent.keyboard(text, options);
};

export const tab = async (): Promise<void> => {
  await userEvent.tab();
};

export const clear = async (element: Element): Promise<void> => {
  await userEvent.clear(element);
};

export const upload = async (
  element: HTMLElement,
  fileOrFiles: File | File[],
  options?: DirectOptions,
): Promise<void> => {
  await userEvent.upload(element, fileOrFiles, options);
};

// If options.applyAccept is set to true and there is an accept attribute on the element,
// uploaded files that don't match will be discarded. We don't want this for our tests.
// Lazy to avoid invoking userEvent.setup() at import time — its patchFocus step
// redefines HTMLElement.prototype.focus, which conflicts with libraries (e.g.
// @react-aria/interactions) that do the same during module initialization.
export const uploadNoApplyAccept = (
  ...args: Parameters<ReturnType<typeof userEvent.setup>["upload"]>
): ReturnType<ReturnType<typeof userEvent.setup>["upload"]> =>
  userEvent.setup({ applyAccept: false }).upload(...args);

/** **********************
 * fireEvent abstractions
 *********************** */

export const {
  // userEvent can't manage drag and drop events
  // Source: https://github.com/testing-library/user-event/issues/440
  dragOver,
  dragEnter,
  dragLeave,
  drop,
  // userEvent can't manage the event for an input with range type
  // Source: https://github.com/testing-library/user-event/issues/871
  change: slide,
  scroll,
} = fireEvent;

/** ****************************************************************************************
 * CUSTOM INTERACTIONS
 * **********************
 *
 * WHAT IS THE noDelay OPTION
 * By default, this library waits for a setTimeout delay during its execution.
 * Since jest.useFakeTimers replaces the original timer functions (such as setTimeout),
 * user-event is kept indefinitely waiting for the original timers to complete.
 * @link https://onestepcode.com/testing-library-user-event-with-fake-timers
 ***************************************************************************************** */

export const selectOptions = async (
  select: Element,
  values: HTMLElement | HTMLElement[] | string[] | string,
  options?: DirectOptions,
): Promise<void> => {
  await userEvent.selectOptions(select, values, options);
};

export const mouseDown = async (
  target: Element,
  noDelay = false,
): Promise<void> => {
  await (noDelay ? userEvent.setup({ delay: null }) : userEvent).pointer([
    { keys: "[TouchA>]", target },
    { keys: "[/TouchA]" },
  ]);
};

export const clickWithEvent = (el: Element): Event => {
  const clickEvent = createEvent.click(el);
  fireEvent(el, clickEvent);

  return clickEvent;
};

export const click = (el: Element, noDelay = false): Promise<void> => {
  if (noDelay) {
    return userEvent.setup({ delay: null }).click(el);
  }

  return userEvent.click(el);
};

export const submit = (el: Element): void => {
  fireEvent.submit(el);
};

export const type = async (
  el: Element,
  text: string,
  options?: TypeOptions,
  noDelay = false,
): Promise<void> => {
  await (noDelay ? userEvent.setup({ delay: null }) : userEvent).type(
    el,
    text,
    options,
  );
};
