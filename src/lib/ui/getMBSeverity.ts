export function getColor(n: number | string): string {
  const number = typeof n === "string" ? convertToInt(n) : n;

  if (number === 1) {
    return "bg-emerald-500";
  }
  if (number === 2) {
    return "bg-green-500";
  }
  if (number === 3) {
    return "bg-lime-500";
  }
  if (number === 4) {
    return "bg-yellow-500";
  }
  if (number === 5) {
    return "bg-amber-500";
  }
  if (number === 6) {
    return "bg-orange-500";
  }
  if (number === 7) {
    return "bg-red-500";
  }
  if (number === 8) {
    return "bg-purple-500";
  }
  if (number === 9) {
    return "bg-violet-700";
  }
  if (number === 10) {
    return "bg-indigo-900";
  }

  return "bg-transparent";
}

function convertToInt(n: string): number {
  return Number(n);
}
export function getTextColor(n: number | string): string {
  const number = typeof n === "string" ? convertToInt(n) : n;

  if (number === 1) {
    return "text-emerald-900";
  }
  if (number === 2) {
    return "text-green-900";
  }
  if (number === 3) {
    return "text-lime-900";
  }
  if (number === 4) {
    return "text-yellow-900";
  }
  if (number === 5) {
    return "text-amber-50";
  }
  if (number === 6) {
    return "text-orange-50";
  }
  if (number === 7) {
    return "text-red-50";
  }
  if (number === 8) {
    return "text-purple-50";
  }
  if (number === 9) {
    return "text-violet-50";
  }
  if (number === 10) {
    return "text-indigo-50";
  }

  return "text-black";
}
export function getName(n: number | string): string {
  const number = typeof n === "string" ? convertToInt(n) : n;

  if (number === 1) {
    return "minor";
  }
  if (number === 2) {
    return "mild";
  }
  if (number === 3) {
    return "noticeable";
  }
  if (number === 4) {
    return "significant";
  }
  if (number === 5) {
    return "serious";
  }
  if (number === 6) {
    return "major";
  }
  if (number === 7) {
    return "severe";
  }
  if (number === 8) {
    return "intense";
  }
  if (number === 9) {
    return "extreme";
  }
  if (number === 10) {
    return "total";
  }
  return "unknown"; // For inputs not between 1 and 10
}

export function getAll(n: number | string): { name: string; color: string } {
  return {
    name: getName(n),
    color: getColor(n),
  };
}

export const severityList = [
  {
    id: 1,
    name: "minor",
    textColor: "text-emerald-900",
    color: "bg-emerald-500",
  },
  {
    id: 2,
    name: "mild",
    textColor: "text-green-900",
    color: "bg-green-500",
  },
  {
    id: 3,
    name: "noticeable",
    textColor: "text-lime-900",
    color: "bg-lime-500",
  },
  {
    id: 4,
    name: "significant",
    textColor: "text-yellow-900",
    color: "bg-yellow-500",
  },
  {
    id: 5,
    name: "serious",
    textColor: "text-amber-50",
    color: "bg-amber-500",
  },
  {
    id: 6,
    name: "major",
    textColor: "text-orange-50",
    color: "bg-orange-500",
  },
  {
    id: 7,
    name: "severe",
    textColor: "text-red-50",
    color: "bg-red-500",
  },
  {
    id: 8,
    name: "intense",
    textColor: "text-purple-50",
    color: "bg-purple-500",
  },
  {
    id: 9,
    name: "extreme",
    textColor: "text-violet-50",
    color: "bg-violet-700",
  },
  {
    id: 10,
    name: "total",
    textColor: "text-indigo-50",
    color: "bg-indigo-900",
  },
];
