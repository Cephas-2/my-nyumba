import { PaymentCard } from "@/components/cards/PaymentCard";
import { AppHeader } from "@/components/navigation/AppHeader";
import { AppText } from "@/components/ui/AppText";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { InfoRow } from "@/components/ui/InfoRow";
import { LoadingState } from "@/components/ui/LoadingState";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MetaBadge } from "@/components/ui/StatusBadge";
import { colors, spacing } from "@/constants/theme";
import { useMockQuery } from "@/hooks/useMockQuery";
import { formatDate, formatMoney, formatPeriod } from "@/lib/utils/format";
import { leaseStatusMeta, paymentStatusMeta } from "@/lib/utils/status";
import { endTenancy, getTenantDetail } from "@/services/landlord";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function TenantDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tenantId = String(id);
  const [confirmingEnd, setConfirmingEnd] = useState(false);
  const { data, loading, error, refetch } = useMockQuery(
    `tenant-${tenantId}`,
    () => getTenantDetail(tenantId),
  );

  const header = (
    <AppHeader
      title={data?.tenant.fullName ?? "Tenant"}
      subtitle={
        data
          ? `Unit ${data.unit.unitNumber} · ${data.property.name}`
          : undefined
      }
      showBack
    />
  );

  if (error)
    return (
      <ScreenContainer header={header}>
        <ErrorState message={error} onRetry={refetch} />
      </ScreenContainer>
    );
  if (loading && !data)
    return (
      <ScreenContainer header={header}>
        <LoadingState label="Loading tenant..." />
      </ScreenContainer>
    );
  if (!data)
    return (
      <ScreenContainer header={header}>
        <EmptyState
          icon="person-outline"
          title="Tenant not found"
          message="They may have been removed."
          actionLabel="Back to tenants"
          onAction={() => router.replace("/landlord/tenants")}
        />
      </ScreenContainer>
    );

  const { tenant, unit, property, lease, payment, payments } = data;
  const active = lease.status === "active" || lease.status === "expiring";

  const confirmEnd = () => {
    setConfirmingEnd(false);
    endTenancy(tenantId);
    refetch();
  };

  return (
    <ScreenContainer header={header} refreshing={loading} onRefresh={refetch}>
      <View style={{ gap: spacing.lg }}>
        <Card>
          <View style={styles.profile}>
            <Avatar name={tenant.fullName} size="lg" />
            <AppText variant="title">{tenant.fullName}</AppText>
            {active ? <MetaBadge meta={leaseStatusMeta[lease.status]} /> : null}
          </View>
          <InfoRow label="Phone" value={tenant.phone} />
          <InfoRow label="Email" value={tenant.email || "—"} />
          <InfoRow label="Tenant since" value={formatDate(tenant.createdAt)} />
          {tenant.emergencyContact ? (
            <>
              <AppText
                variant="label"
                color={colors.textMuted}
                style={{ marginTop: spacing.sm }}
              >
                Emergency contact
              </AppText>
              <InfoRow label="Name" value={tenant.emergencyContact.name} />
              <InfoRow
                label="Relationship"
                value={tenant.emergencyContact.relationship}
              />
              <InfoRow label="Phone" value={tenant.emergencyContact.phone} />
            </>
          ) : null}
        </Card>

        <Card>
          <AppText variant="heading" style={{ marginBottom: spacing.sm }}>
            Tenancy
          </AppText>
          <InfoRow label="Property" value={property.name} />
          <InfoRow label="Unit" value={unit.unitNumber} />
          <InfoRow
            label="Monthly rent"
            value={formatMoney(lease.monthlyRent)}
          />
          <InfoRow label="Deposit" value={formatMoney(lease.deposit)} />
          <InfoRow label="Lease start" value={formatDate(lease.startDate)} />
          <InfoRow label="Lease end" value={formatDate(lease.endDate)} />
          <InfoRow
            label="Lease status"
            value={leaseStatusMeta[lease.status].label}
          />
        </Card>

        {payment ? (
          <Card>
            <View style={styles.rentHeader}>
              <AppText variant="heading">Rent this month</AppText>
              <MetaBadge meta={paymentStatusMeta[payment.status]} />
            </View>
            <InfoRow
              label="Expected"
              value={formatMoney(payment.expectedAmount)}
            />
            <InfoRow label="Paid" value={formatMoney(payment.amount)} />
            <InfoRow
              label="Balance"
              value={formatMoney(
                Math.max(payment.expectedAmount - payment.amount, 0),
              )}
            />
          </Card>
        ) : null}

        <View>
          <SectionHeader title="Payment history" />
          {payments.length === 0 ? (
            <Card>
              <AppText color={colors.textMuted}>
                No payments recorded yet.
              </AppText>
            </Card>
          ) : (
            <View style={{ gap: spacing.md }}>
              {payments.map((p) => (
                <PaymentCard
                  key={p.id}
                  payment={p}
                  title={formatPeriod(p.period)}
                  subtitle={
                    p.paidDate
                      ? `Paid ${formatDate(p.paidDate)}`
                      : `Due ${formatDate(p.dueDate)}`
                  }
                  onPress={() => router.push(`/landlord/rent/${p.id}`)}
                />
              ))}
            </View>
          )}
        </View>

        <View style={{ gap: spacing.md }}>
          <Button
            label="Message tenant"
            icon="chatbubble-outline"
            variant="secondary"
            onPress={() => router.push(`/landlord/messages/${tenant.id}`)}
          />
          {active ? (
            <Button
              label="End tenancy"
              icon="exit-outline"
              variant="danger"
              onPress={() => setConfirmingEnd(true)}
            />
          ) : null}
        </View>
      </View>

      <ConfirmationModal
        visible={confirmingEnd}
        destructive
        title="End tenancy?"
        message={`${tenant.fullName} will be removed from Unit ${unit.unitNumber} and the unit marked vacant. Lease history and payments stay on record.`}
        confirmLabel="End tenancy"
        cancelLabel="Keep tenant"
        onConfirm={confirmEnd}
        onCancel={() => setConfirmingEnd(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  profile: {
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  rentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
});
