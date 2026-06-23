export default function RoleBadge({ role }: { role: string }) {
  const isUser = role === "USER";

  return (
    <span
      className={`text-[9px] md:text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shrink-0 ${
        isUser
          ? "bg-secondary-container text-on-secondary-container"
          : "bg-primary-fixed text-on-primary-fixed"
      }`}
    >
      {role}
    </span>
  );
}
