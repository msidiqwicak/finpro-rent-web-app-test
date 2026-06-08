// src/components/booking/utils.ts

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDateShort = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatDateFull = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};
