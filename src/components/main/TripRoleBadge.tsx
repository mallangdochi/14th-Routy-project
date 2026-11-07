import styled from "@emotion/styled";
import { tripRoleColors, tripRoleLabels, type TripPermission } from "../../utils/tripPermissions";

const Badge = styled.span<{ $permission: TripPermission }>(({ $permission }) => ({
  ...tripRoleColors[$permission],
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  padding: "4px 9px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 600,
  lineHeight: 1.4,
  whiteSpace: "nowrap",
}));

export default function TripRoleBadge({ permission }: { permission?: TripPermission }) {
  if (!permission) return null;
  return <Badge $permission={permission} aria-label={`내 여행 권한: ${tripRoleLabels[permission]}`}>{tripRoleLabels[permission]}</Badge>;
}
