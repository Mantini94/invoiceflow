export const formatMoney = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return `${Number(value).toLocaleString("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} zł`;
};

export const formatDate = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("pl-PL");
};

export const formatDateTime = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


export function formatCompactMoney(value) {
  const amount = Number(value || 0);

  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(2)} mln zł`;
  }

  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)} tys. zł`;
  }

  return `${amount.toFixed(2)} zł`;
}
