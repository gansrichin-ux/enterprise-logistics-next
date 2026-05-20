export const APP_ROLES = [
  "logistician",
  "carrier",
  "cargo_owner",
  "forwarder",
  "lawyer",
  "carrier_forwarder",
  "cargo_owner_carrier",
  "logistician_carrier",
] as const;

export type AppRole = (typeof APP_ROLES)[number];

const legacyRoleMap: Record<string, AppRole> = {
  driver: "carrier",
  driver_forwarder: "carrier_forwarder",
  driver_cargo_owner: "cargo_owner_carrier",
};

const roleLabels: Record<AppRole, string> = {
  logistician: "Логист",
  carrier: "Перевозчик",
  cargo_owner: "Грузовладелец",
  forwarder: "Экспедитор",
  lawyer: "Юрист",
  carrier_forwarder: "Перевозчик-Экспедитор",
  cargo_owner_carrier: "Грузовладелец-Перевозчик",
  logistician_carrier: "Логист-Перевозчик",
};

const roleDashboardPaths: Record<AppRole, string> = {
  logistician: "/workspace",
  carrier: "/active-cargos",
  cargo_owner: "/find-transport",
  forwarder: "/workspace",
  lawyer: "/workspace",
  carrier_forwarder: "/workspace",
  cargo_owner_carrier: "/workspace",
  logistician_carrier: "/workspace",
};

export function normalizeRole(role: string | null | undefined): AppRole {
  const value = (role ?? "").trim().toLowerCase();
  const mapped = legacyRoleMap[value] ?? value;
  return APP_ROLES.includes(mapped as AppRole)
    ? (mapped as AppRole)
    : "logistician";
}

export function getRoleLabel(role: string | null | undefined) {
  return roleLabels[normalizeRole(role)];
}

export function getRoleDashboardPath(role: string | null | undefined) {
  return roleDashboardPaths[normalizeRole(role)];
}

export function isCarrier(role: string | null | undefined) {
  return ["carrier", "carrier_forwarder", "cargo_owner_carrier", "logistician_carrier"].includes(
    normalizeRole(role),
  );
}

export function isLogistician(role: string | null | undefined) {
  return ["logistician", "logistician_carrier"].includes(normalizeRole(role));
}

export function isCargoOwner(role: string | null | undefined) {
  return ["cargo_owner", "cargo_owner_carrier"].includes(normalizeRole(role));
}

export function isForwarder(role: string | null | undefined) {
  return ["forwarder", "carrier_forwarder"].includes(normalizeRole(role));
}

export function isLawyer(role: string | null | undefined) {
  return normalizeRole(role) === "lawyer";
}

export function isHybridRole(role: string | null | undefined) {
  return ["carrier_forwarder", "cargo_owner_carrier", "logistician_carrier"].includes(
    normalizeRole(role),
  );
}
