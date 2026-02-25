/**
 * License service — Keygen.sh integration layer.
 *
 * Currently STUBBED. All functions return placeholder state.
 * When a Keygen.sh account is ready, swap each stub body for the
 * corresponding invoke() call (marked with TODO comments below).
 *
 * ACTIVATION CHECKLIST (do this when Keygen account is created):
 * ─────────────────────────────────────────────────────────────────
 * 1. Add to .env.local:
 *      KEYGEN_ACCOUNT_ID=<your-account-uuid>
 *      KEYGEN_PRODUCT_ID=<your-product-uuid>
 *      KEYGEN_PUBLIC_KEY=<your-ed25519-verify-key>
 *
 * 2. Add to src-tauri/Cargo.toml [dependencies]:
 *      tauri-plugin-keygen-rs2 = "0.4"
 *
 * 3. Register in src-tauri/src/lib.rs builder chain:
 *      .plugin(
 *          tauri_plugin_keygen_rs2::Builder::new(
 *              std::env::var("KEYGEN_ACCOUNT_ID").unwrap_or_default(),
 *              std::env::var("KEYGEN_PRODUCT_ID").unwrap_or_default(),
 *              std::env::var("KEYGEN_PUBLIC_KEY").unwrap_or_default(),
 *          )
 *          .build()
 *      )
 *
 * 4. In each function below, replace the stub body with the real invoke():
 *      import { invoke } from '@tauri-apps/api/core';
 *      return await invoke('plugin:keygen|<command_name>', { ... });
 *
 * 5. Enable the Activate button in LicensePanel.tsx (remove disabled prop).
 *
 * Offline grace period: 14 days (configure in Keygen policy settings).
 * License model: binary — valid key = Professional tier.
 * ─────────────────────────────────────────────────────────────────
 */

import type { LicenseTier } from '@/types/assessment';

// ─── Types ─────────────────────────────────────────────────────────────────

export type LicenseStatus =
  | 'unconfigured'  // No Keygen credentials configured (dev/pre-launch)
  | 'no_license'    // No key entered yet
  | 'active'        // Key valid and activated on this machine
  | 'expired'       // Key valid but past expiry date
  | 'invalid'       // Key format correct but validation failed
  | 'error';        // Network or unexpected error during validation

export interface LicenseState {
  status: LicenseStatus;
  tier: LicenseTier;
  key: string | null;
  expiresAt: string | null;
  isValid: boolean;
  /** Human-readable message for display in LicensePanel */
  message: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const UNCONFIGURED_STATE: LicenseState = {
  status: 'unconfigured',
  tier: 'free',
  key: null,
  expiresAt: null,
  isValid: false,
  message: 'Licensing not yet configured.',
};

// ─── Stub implementations ───────────────────────────────────────────────────
// Each function has a TODO marking the exact invoke() call to swap in.

/**
 * Returns the current license state from the local cache.
 * Called on app startup to restore license status without a network round-trip.
 *
 * TODO: replace stub with:
 *   const raw = await invoke<RawLicense | null>('plugin:keygen|get_license');
 *   return raw ? mapRawToState(raw) : { status: 'no_license', tier: 'free', key: null, expiresAt: null, isValid: false, message: 'No license key entered.' };
 */
export async function getLicenseState(): Promise<LicenseState> {
  return UNCONFIGURED_STATE;
}

/**
 * Validates a license key against the Keygen.sh API and activates
 * this machine if the key is valid.
 *
 * @param key - The license key string entered by the user.
 *
 * TODO: replace stub with:
 *   await invoke('plugin:keygen|validate_key', { key });
 *   await invoke('plugin:keygen|activate');
 *   return getLicenseState();
 */
export async function activateLicense(_key: string): Promise<LicenseState> {
  return UNCONFIGURED_STATE;
}

/**
 * Deactivates the current machine's license, freeing an activation seat.
 *
 * TODO: replace stub with:
 *   await invoke('plugin:keygen|deactivate');
 */
export async function deactivateLicense(): Promise<void> {
  // stub — no-op
}

/**
 * Checks out a local license file for offline use.
 * Call after activation to enable the 14-day grace period.
 *
 * @param ttlDays - Offline grace period in days (default: 14).
 *
 * TODO: replace stub with:
 *   await invoke('plugin:keygen|checkout_machine', { ttl: ttlDays * 86400 });
 */
export async function checkoutOfflineLicense(ttlDays = 14): Promise<void> {
  void ttlDays; // suppress unused warning in stub
  // stub — no-op
}

/**
 * Resets the local license cache. Used when a user wants to enter
 * a different key or transfer their license to another machine.
 *
 * TODO: replace stub with:
 *   await invoke('plugin:keygen|reset_license');
 */
export async function resetLicense(): Promise<void> {
  // stub — no-op
}

/**
 * Derives a LicenseTier from a LicenseState.
 * Centralises the "is this a paid user?" logic so it's one place to update.
 */
export function tierFromState(state: LicenseState): LicenseTier {
  return state.isValid ? 'professional' : 'free';
}
