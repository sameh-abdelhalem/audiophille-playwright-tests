import { test } from "@playwright/test";

export function isMobile() {
  return (test.info().project.metadata as any)?.formFactor === "mobile";
}

export function isTablet() {
  return (test.info().project.metadata as any)?.formFactor === "tablet";
}

export function isTouchViewport() {
  const meta = (test.info().project.metadata as any) || {};
  return meta.formFactor === "mobile" || meta.formFactor === "tablet";
}
