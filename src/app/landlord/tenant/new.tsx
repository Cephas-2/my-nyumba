import { ChoiceGroup } from "@/components/forms/ChoiceGroup";
import { TextField } from "@/components/forms/TextField";
import { AppHeader } from "@/components/navigation/AppHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { useSession } from "@/hooks/useSession";
import { addTenant, listVacantUnits } from "@/services/landlord";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert } from "react-native";

const LEASE_LENGTHS = [
  { label: "6 months", value: "6" },
  { label: "1 year", value: "12" },
  { label: "2 years", value: "24" },
];

const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const addMonths = (iso: string, months: number) => {
  const d = new Date(`${iso}T12:00:00`);
  d.setMonth(d.getMonth() + months);
  return toISODate(d);
};

export default function NewTenantScreen() {
  const router = useRouter();
  const { user } = useSession();
  const landlordId = user?.id ?? "";

  const vacant = useMemo(() => listVacantUnits(landlordId), [landlordId]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [unitId, setUnitId] = useState("");
  const [rent, setRent] = useState("");
  const [deposit, setDeposit] = useState("");
  const [startDate, setStartDate] = useState(toISODate(new Date()));
  const [months, setMonths] = useState("12");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const selected = vacant.find((v) => v.unit.id === unitId);
  const autoFillRent = () => {
    if (selected && !rent) setRent(String(selected.unit.monthlyRent));
    if (selected && !deposit) setDeposit(String(selected.unit.deposit));
  };

  const save = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Enter the tenant’s full name";
    if (!/^07\d{2}\s?\d{3}\s?\d{3}$/.test(phone.trim()))
      e.phone = "Enter a valid phone number, e.g. 0712 345 678";
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim()))
      e.email = "Enter a valid email address";
    if (!unitId) e.unitId = "Choose the unit the tenant is moving into";
    if (!/^\d+$/.test(rent.trim()) || Number(rent) < 1)
      e.rent = "Enter the monthly rent in KES";
    if (!/^\d+$/.test(deposit.trim())) e.deposit = "Enter the deposit in KES";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate.trim()))
      e.startDate = "Use the format YYYY-MM-DD";
    setErrors(e);
    if (Object.keys(e).length) return;

    setSaving(true);
    setTimeout(() => {
      try {
        const tenant = addTenant({
          fullName,
          phone,
          email,
          unitId,
          monthlyRent: Number(rent),
          deposit: Number(deposit),
          startDate,
          endDate: addMonths(startDate, Number(months)),
        });
        Alert.alert(
          "Tenant added",
          `${tenant.fullName} is now linked to ${selected?.property.name} · Unit ${selected?.unit.unitNumber}.`,
          [
            {
              text: "View tenant",
              onPress: () => router.replace(`/landlord/tenant/${tenant.id}`),
            },
            {
              text: "Done",
              onPress: () => router.replace("/landlord/tenants"),
            },
          ],
        );
      } catch (err) {
        Alert.alert(
          "Could not add tenant",
          err instanceof Error ? err.message : "Something went wrong",
        );
      } finally {
        setSaving(false);
      }
    }, 600);
  };

  if (vacant.length === 0) {
    return (
      <ScreenContainer header={<AppHeader title="Add tenant" showBack />}>
        <EmptyState
          icon="key-outline"
          title="No vacant units"
          message="All your units are occupied or under maintenance. Add a unit or property first."
          actionLabel="Add property"
          onAction={() => router.push("/landlord/property/new")}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      header={
        <AppHeader
          title="Add tenant"
          subtitle="Link a new tenant to a vacant unit"
          showBack
        />
      }
      footer={
        <Button
          label="Add tenant"
          icon="person-add-outline"
          onPress={save}
          loading={saving}
        />
      }
    >
      <TextField
        label="Full name"
        value={fullName}
        onChangeText={setFullName}
        error={errors.fullName}
        placeholder="e.g. Brian Otieno"
        autoCapitalize="words"
      />
      <TextField
        label="Phone number"
        value={phone}
        onChangeText={setPhone}
        error={errors.phone}
        placeholder="e.g. 0712 345 678"
        keyboardType="phone-pad"
        leftIcon="call-outline"
      />
      <TextField
        label="Email (optional)"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        placeholder="e.g. brian@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon="mail-outline"
      />
      <ChoiceGroup
        label="Vacant unit"
        options={vacant.map((v) => ({
          label: `${v.property.name} · Unit ${v.unit.unitNumber}`,
          value: v.unit.id,
        }))}
        value={unitId}
        onChange={(v) => {
          setUnitId(v);
          setTimeout(autoFillRent, 0);
        }}
      />
      {errors.unitId ? null : null}
      <TextField
        label="Monthly rent (KES)"
        value={rent}
        onChangeText={setRent}
        error={errors.rent}
        keyboardType="number-pad"
        placeholder="e.g. 45000"
        leftIcon="cash-outline"
      />
      <TextField
        label="Deposit (KES)"
        value={deposit}
        onChangeText={setDeposit}
        error={errors.deposit}
        keyboardType="number-pad"
        placeholder="e.g. 45000"
      />
      <TextField
        label="Lease start date"
        value={startDate}
        onChangeText={setStartDate}
        error={errors.startDate}
        placeholder="YYYY-MM-DD"
        leftIcon="calendar-outline"
      />
      <ChoiceGroup
        label="Lease length"
        options={LEASE_LENGTHS}
        value={months}
        onChange={setMonths}
      />
    </ScreenContainer>
  );
}
